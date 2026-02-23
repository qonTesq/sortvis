import type { SortStep, SortStatistics, BarState, SpeedLevel } from '$types';
import {
	bubbleSort,
	quickSort,
	mergeSort,
	heapSort,
	insertionSort,
	selectionSort
} from '$lib/algorithms';
import { algorithmMetadata } from '$config/algorithms';

const ALGORITHMS: Record<string, (arr: number[]) => Generator<SortStep, void, undefined>> = {
	bubble: bubbleSort,
	quick: quickSort,
	merge: mergeSort,
	heap: heapSort,
	insertion: insertionSort,
	selection: selectionSort
};

// Map speed levels to engine parameters: { delay (ms), batchSize (steps per frame) }
const SPEED_CONFIG: Record<SpeedLevel, { delay: number; batch: number }> = {
	snail: { delay: 500, batch: 1 },
	slow: { delay: 100, batch: 1 },
	med: { delay: 10, batch: 1 },
	fast: { delay: 0, batch: 1 },
	rapid: { delay: 0, batch: 5 },
	flash: { delay: 0, batch: 100 }
};

export class VisualizerState {
	// --- Reactive State ---
	/**
	 * `array` and `colors` are intentionally plain (non-reactive) fields.
	 * Individual elements are mutated in-place during each sort step (swap, merge, etc.),
	 * which would cause Svelte's proxy-based deep reactivity to fire on every mutation —
	 * far too noisy for a high-frequency animation loop. Instead, the Canvas reads these
	 * directly and we use the `tick` signal below to tell it when to re-render.
	 * `$state.raw` is not used because it requires reassignment rather than mutation,
	 * which would require restructuring the entire step engine.
	 */
	array: number[] = [];
	initialArray: number[] = [];
	colors: BarState[] = [];
	tick = $state(0);

	stats = $state<SortStatistics>({ comparisons: 0, swaps: 0 });
	// Internal non-reactive counters — mutated in step(), synced to $state once per batch
	private _comparisons = 0;
	private _swaps = 0;
	status = $state<'idle' | 'playing' | 'paused' | 'finished'>('idle');

	// Settings
	size = $state(64);
	speed = $state<SpeedLevel>('med'); // Default to 'med'
	algorithmId = $state<string>('bubble');

	// --- Internal State ---
	private generator: Generator<SortStep, void, undefined> | null = null;
	private loopTimeoutId: ReturnType<typeof setTimeout> | null = null;
	/**
	 * Intentionally a plain Map, not SvelteMap. `dirtyIndices` is a private,
	 * per-frame scratch buffer used to restore bar colours after each step.
	 * It is never read reactively from a template, so Svelte's reactive Map
	 * proxy would add overhead with zero benefit.
	 */
	// eslint-disable-next-line svelte/prefer-svelte-reactivity
	private dirtyIndices = new Map<number, BarState>();

	constructor() {
		this.generateArray();
	}

	// --- Core Actions ---
	generateArray() {
		this.pause();
		const newArray = Array.from({ length: this.size }, () => Math.floor(Math.random() * 100) + 5);
		this.array = [...newArray];
		this.initialArray = [...newArray];
		this.resetMetrics();
	}

	reset() {
		this.pause();
		this.array = [...this.initialArray];
		this.resetMetrics();
	}

	private resetMetrics() {
		this.colors = Array(this.size).fill('default');
		this._comparisons = 0;
		this._swaps = 0;
		this.stats = { comparisons: 0, swaps: 0 };
		this.status = 'idle';
		this.generator = null;
		this.dirtyIndices.clear();
		this.tick++;
	}

	// --- Settings Modifiers ---
	setAlgorithm(id: string) {
		if (this.algorithmId === id) return;
		this.algorithmId = id;
		this.reset();
	}

	setSize(newSize: number) {
		if (this.size === newSize) return;
		this.size = newSize;
		this.generateArray();
	}

	setSpeed(newSpeed: SpeedLevel) {
		this.speed = newSpeed;
	}

	// --- Playback Controls ---
	play() {
		if (this.status === 'playing') return;

		if (this.status === 'finished') {
			this.resetMetrics();
		}

		if (!this.generator) {
			const algo = ALGORITHMS[this.algorithmId];
			if (!algo) throw new Error(`Algorithm ${this.algorithmId} not found`);
			this.generator = algo(this.array);
		}

		this.status = 'playing';
		this.runLoop();
	}

	pause() {
		this.status = 'paused';
		if (this.loopTimeoutId !== null) {
			clearTimeout(this.loopTimeoutId);
			this.loopTimeoutId = null;
		}
	}

	private setColor(index: number, state: BarState) {
		// Only save the previous state if it's not already in the dirty map for this frame step
		if (!this.dirtyIndices.has(index)) {
			this.dirtyIndices.set(index, this.colors[index]!);
		}
		this.colors[index] = state;
	}

	// --- The Engine ---
	private step(): boolean {
		if (!this.generator) return false;

		const result = this.generator.next();

		if (result.done) {
			this.status = 'finished';
			this.stats = { comparisons: this._comparisons, swaps: this._swaps };
			this.dirtyIndices.clear();
			this.tick++;
			return false;
		}

		for (const [index, prevState] of this.dirtyIndices) {
			if (this.colors[index] !== 'sorted') this.colors[index] = prevState;
		}
		this.dirtyIndices.clear();

		const { type, indices } = result.value;

		switch (type) {
			case 'compare':
				this.setColor(indices[0], 'comparing');
				this.setColor(indices[1], 'comparing');
				this._comparisons++;
				break;
			case 'swap':
				[this.colors[indices[0]], this.colors[indices[1]]] = [
					this.colors[indices[1]]!,
					this.colors[indices[0]]!
				];
				this.setColor(indices[0], 'swapping');
				this.setColor(indices[1], 'swapping');
				this._swaps++;
				break;
			case 'pivot':
				this.setColor(indices[0], 'pivot');
				break;
			case 'sorted':
				for (const idx of indices) {
					this.colors[idx] = 'sorted';
					this.dirtyIndices.delete(idx);
				}
				break;
			case 'merge':
				this.setColor(indices[0], 'merge');
				this.array[indices[0]] = result.value.value;
				this._swaps++;
				break;
		}

		return true;
	}

	private runLoop() {
		if (this.status !== 'playing') return;

		// Grab the current speed config based on the discrete setting
		const { delay, batch } = SPEED_CONFIG[this.speed];
		for (let i = 0; i < batch && this.step(); i++);

		if (this.status === 'playing') {
			// Sync internal counters to reactive $state once per batch (not once per step)
			this.stats = { comparisons: this._comparisons, swaps: this._swaps };
			this.tick++;
			this.loopTimeoutId = setTimeout(() => this.runLoop(), delay);
		}
	}
	// --- Derived State ---
	get currentAlgorithmMetadata() {
		return algorithmMetadata.find((a) => a.id === this.algorithmId) || algorithmMetadata[0]!;
	}
}

export const visualizer = new VisualizerState();

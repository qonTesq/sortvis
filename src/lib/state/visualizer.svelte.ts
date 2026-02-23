import type { SortStep, SortStatistics, BarState, SpeedLevel } from '$types';
import { BAR_STATE_ID } from '$types';
import {
	bubbleSort,
	quickSort,
	mergeSort,
	heapSort,
	insertionSort,
	selectionSort
} from '$lib/algorithms';
import { algorithmMetadata } from '$config/algorithms';

const ALGORITHMS: Record<string, (arr: Uint8Array) => Generator<SortStep, void, undefined>> = {
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
	 * `array` and `colors` are plain (non-reactive) `Uint8Array` fields.
	 * `Uint8Array` is used because bar values (5–104) and color states (0–5) are
	 * single-byte integers — 8x smaller than `number[]` (float64) and pointer arrays,
	 * making snapshot copies in the canvas a native `memcpy`. Elements are mutated
	 * in-place during each sort step; the `tick` signal below notifies the canvas
	 * when to re-render. Deep reactivity and `$state.raw` are both avoided to prevent
	 * per-mutation reactivity overhead in the high-frequency sort engine loop.
	 */
	array: Uint8Array = new Uint8Array(0);
	initialArray: Uint8Array = new Uint8Array(0);
	colors: Uint8Array = new Uint8Array(0);
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
	 * Values are encoded color integers (matching the Uint8Array color buffer),
	 * read directly from `this.colors[index]` — no string encoding needed.
	 * Never read reactively from a template, so SvelteMap would add overhead with zero benefit.
	 */
	// eslint-disable-next-line svelte/prefer-svelte-reactivity
	private dirtyIndices = new Map<number, number>();

	constructor() {
		this.generateArray();
	}

	// --- Core Actions ---
	generateArray() {
		this.pause();
		const arr = new Uint8Array(this.size);
		for (let i = 0; i < this.size; i++) arr[i] = (Math.random() * 100 + 5) | 0;
		this.array = arr;
		this.initialArray = arr.slice();
		this.resetMetrics();
	}

	reset() {
		this.pause();
		this.array.set(this.initialArray);
		this.resetMetrics();
	}

	private resetMetrics() {
		this.colors = new Uint8Array(this.size); // zero-initialized = BAR_STATE_ID.default (0)
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
		this.colors[index] = BAR_STATE_ID[state];
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
			if (this.colors[index] !== BAR_STATE_ID.sorted) this.colors[index] = prevState;
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
					this.colors[idx] = BAR_STATE_ID.sorted;
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

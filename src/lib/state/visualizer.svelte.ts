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
	// We use `tick` to signal updates to the UI (Canvas).
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
	private dirtyIndices = new Set<number>();

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

	// --- The Engine ---
	private step(): boolean {
		if (!this.generator) return false;

		const result = this.generator.next();

		if (result.done) {
			this.status = 'finished';
			// Sync final stats before finishing
			this.stats = { comparisons: this._comparisons, swaps: this._swaps };
			// Mark all as sorted
			this.colors = Array(this.size).fill('sorted');
			this.dirtyIndices.clear();
			this.tick++;
			return false;
		}

		// Reset only dirty indices from previous step
		for (const index of this.dirtyIndices) {
			if (this.colors[index] !== 'sorted') {
				this.colors[index] = 'default';
			}
		}
		this.dirtyIndices.clear();

		const stepData = result.value;

		if (stepData.type === 'compare') {
			this.colors[stepData.indices[0]] = 'comparing';
			this.colors[stepData.indices[1]] = 'comparing';
			this.dirtyIndices.add(stepData.indices[0]);
			this.dirtyIndices.add(stepData.indices[1]);
			this._comparisons++;
		} else if (stepData.type === 'swap') {
			this.colors[stepData.indices[0]] = 'swapping';
			this.colors[stepData.indices[1]] = 'swapping';
			this.dirtyIndices.add(stepData.indices[0]);
			this.dirtyIndices.add(stepData.indices[1]);
			this._swaps++;
		} else if (stepData.type === 'pivot') {
			this.colors[stepData.indices[0]] = 'pivot';
			this.dirtyIndices.add(stepData.indices[0]);
		} else if (stepData.type === 'sorted') {
			for (const idx of stepData.indices) {
				this.colors[idx] = 'sorted';
				// Sorted indices don't need to be in dirtyIndices because we don't want to reset them to default
			}
		} else if (stepData.type === 'merge') {
			this.colors[stepData.indices[0]] = 'merge';
			this.array[stepData.indices[0]] = stepData.value;
			this.dirtyIndices.add(stepData.indices[0]);
			this._swaps++;
		}

		return true;
	}

	private runLoop() {
		if (this.status !== 'playing') return;

		// Grab the current speed config based on the discrete setting
		const { delay, batch } = SPEED_CONFIG[this.speed];

		for (let i = 0; i < batch; i++) {
			const shouldContinue = this.step();
			if (!shouldContinue) break;
		}

		if (this.status === 'playing') {
			// Sync internal counters to reactive $state once per batch (not once per step)
			this.stats = { comparisons: this._comparisons, swaps: this._swaps };
			this.tick++;
			if (this.tick > 1_000_000_000) this.tick = 0;
			this.loopTimeoutId = setTimeout(() => this.runLoop(), delay);
		}
	}
	// --- Derived State ---
	get currentAlgorithmMetadata() {
		const meta = algorithmMetadata.find((a) => a.id === this.algorithmId);
		if (!meta) return algorithmMetadata[0]!;
		return meta;
	}
}

export const visualizer = new VisualizerState();

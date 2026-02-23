/**
 * Valid algorithm identifiers — known at compile time
 */
export type AlgorithmId = 'bubble' | 'quick' | 'merge' | 'heap' | 'insertion' | 'selection';

/**
 * Single step in the sorting visualization
 * Uses a Discriminated Union for strict type safety based on the step 'type'
 */
export type SortStep =
	| { type: 'compare'; indices: [number, number] }
	| { type: 'swap'; indices: [number, number] }
	| { type: 'pivot'; indices: [number] }
	| { type: 'sorted'; indices: number[] }
	| { type: 'merge'; indices: [number]; value: number }; // Requires 'value' so the UI knows what to write

/**
 * Statistics tracked during sorting
 */
export interface SortStatistics {
	/** Number of comparisons made */
	comparisons: number;
	/** Number of swaps or array writes performed */
	swaps: number;
}

/**
 * Algorithm metadata for UI display
 */
export interface AlgorithmInfo {
	/** Unique identifier (e.g., 'bubble', 'quick') */
	id: AlgorithmId;
	/** Display name (e.g., 'Bubble Sort') */
	name: string;
	/** Time complexity (best case) */
	minTimeComplexity: string;
	/** Time complexity (worst case) */
	maxTimeComplexity: string;
	/** Space complexity */
	spaceComplexity: string;
	/** Whether algorithm is stable */
	stable: boolean;
	/** Brief description */
	description: string;
}

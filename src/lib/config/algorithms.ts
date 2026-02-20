import type { AlgorithmInfo } from '$types/algorithm';

export const algorithmMetadata: AlgorithmInfo[] = [
	{
		id: 'bubble',
		name: 'Bubble Sort',
		minTimeComplexity: 'O(n)',
		maxTimeComplexity: 'O(n²)',
		spaceComplexity: 'O(1)',
		stable: true,
		description: 'Repeatedly compares and swaps adjacent elements until sorted.'
	},
	{
		id: 'quick',
		name: 'Quick Sort',
		minTimeComplexity: 'O(n log n)',
		maxTimeComplexity: 'O(n²)',
		spaceComplexity: 'O(log n)',
		stable: false,
		description: 'Partitions by a pivot and recursively sorts the parts.'
	},
	{
		id: 'merge',
		name: 'Merge Sort',
		minTimeComplexity: 'O(n log n)',
		maxTimeComplexity: 'O(n log n)',
		spaceComplexity: 'O(n)',
		stable: true,
		description: 'Recursively splits the array, then merges sorted halves.'
	},
	{
		id: 'heap',
		name: 'Heap Sort',
		minTimeComplexity: 'O(n log n)',
		maxTimeComplexity: 'O(n log n)',
		spaceComplexity: 'O(1)',
		stable: false,
		description: 'Builds a heap and repeatedly moves the max to the end.'
	},
	{
		id: 'insertion',
		name: 'Insertion Sort',
		minTimeComplexity: 'O(n)',
		maxTimeComplexity: 'O(n²)',
		spaceComplexity: 'O(1)',
		stable: true,
		description: 'Builds a sorted portion by inserting each element into place.'
	},
	{
		id: 'selection',
		name: 'Selection Sort',
		minTimeComplexity: 'O(n²)',
		maxTimeComplexity: 'O(n²)',
		spaceComplexity: 'O(1)',
		stable: false,
		description: 'Repeatedly selects the smallest unsorted element and places it in order.'
	}
];

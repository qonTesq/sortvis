import type { SortStep } from '$types/algorithm';

/**
 * Iterative sift-down (replaces recursive heapify).
 * Uses a while loop instead of recursion → O(1) auxiliary space.
 */
function* siftDown(array: number[], n: number, i: number): Generator<SortStep, void, undefined> {
	while (true) {
		let largest = i;
		const left = 2 * i + 1;
		const right = 2 * i + 2;

		if (left < n) {
			yield {
				type: 'compare',
				indices: [largest, left]
			};
			if (array[left]! > array[largest]!) {
				largest = left;
			}
		}

		if (right < n) {
			yield {
				type: 'compare',
				indices: [largest, right]
			};
			if (array[right]! > array[largest]!) {
				largest = right;
			}
		}

		if (largest === i) break;

		[array[i], array[largest]] = [array[largest]!, array[i]!];
		yield {
			type: 'swap',
			indices: [i, largest]
		};

		// Move down to the swapped child's position and continue (no recursion)
		i = largest;
	}
}

export function* heapSort(arr: number[]): Generator<SortStep, void, undefined> {
	const n = arr.length;

	for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
		yield* siftDown(arr, n, i);
	}

	for (let i = n - 1; i > 0; i--) {
		[arr[0], arr[i]] = [arr[i]!, arr[0]!];
		yield {
			type: 'swap',
			indices: [0, i]
		};

		yield* siftDown(arr, i, 0);

		yield {
			type: 'sorted',
			indices: [i]
		};
	}

	yield {
		type: 'sorted',
		indices: [0]
	};
}

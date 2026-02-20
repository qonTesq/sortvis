import type { SortStep } from '$types/algorithm';

function* medianOfThree(
	array: number[],
	low: number,
	high: number
): Generator<SortStep, void, undefined> {
	const mid = Math.floor((low + high) / 2);

	yield { type: 'compare', indices: [low, mid] };
	if (array[low]! > array[mid]!) {
		[array[low], array[mid]] = [array[mid]!, array[low]!];
		yield { type: 'swap', indices: [low, mid] };
	}

	yield { type: 'compare', indices: [low, high] };
	if (array[low]! > array[high]!) {
		[array[low], array[high]] = [array[high]!, array[low]!];
		yield { type: 'swap', indices: [low, high] };
	}

	yield { type: 'compare', indices: [mid, high] };
	if (array[mid]! > array[high]!) {
		[array[mid], array[high]] = [array[high]!, array[mid]!];
		yield { type: 'swap', indices: [mid, high] };
	}

	// Median is at mid — place it at high-1 out of the way
	// arr[low] <= pivot <= arr[high] guaranteed after above
	[array[mid], array[high - 1]] = [array[high - 1]!, array[mid]!];
	yield { type: 'swap', indices: [mid, high - 1] };

	yield { type: 'pivot', indices: [high - 1] };
}

function* threeWayPartition(
	array: number[],
	low: number,
	high: number
): Generator<SortStep, [number, number], undefined> {
	const pivot = array[high - 1]!;

	// Invariants:
	// arr[low]              <= pivot (median-of-three guarantee)
	// arr[high]             >= pivot (median-of-three guarantee)
	// arr[high-1]           == pivot (pivot sitting here)
	// arr[low+1  .. lt-1]   <  pivot
	// arr[lt     .. gt]     == pivot (equal region, grows inward)
	// arr[gt+1   .. high-2] >  pivot
	let lt = low + 1;
	let gt = high - 2;
	let i = low + 1;

	while (i <= gt) {
		yield { type: 'compare', indices: [i, high - 1] };

		if (array[i]! < pivot) {
			if (lt !== i) {
				[array[lt], array[i]] = [array[i]!, array[lt]!];
				yield { type: 'swap', indices: [lt, i] };
			}
			lt++;
			i++;
		} else if (array[i]! > pivot) {
			if (gt !== i) {
				[array[gt], array[i]] = [array[i]!, array[gt]!];
				yield { type: 'swap', indices: [gt, i] };
			}
			gt--;
			// do not increment i — swapped element needs inspection
		} else {
			i++;
		}
	}

	// Move pivot from high-1 into gt+1 (start of > region)
	// Equal region becomes [lt .. gt+1]
	if (gt + 1 !== high - 1) {
		[array[gt + 1], array[high - 1]] = [array[high - 1]!, array[gt + 1]!];
		yield { type: 'swap', indices: [gt + 1, high - 1] };
	}

	// Mark entire equal region as sorted — these elements never move again
	const equalIndices: number[] = [];
	for (let k = lt; k <= gt + 1; k++) equalIndices.push(k);
	yield { type: 'sorted', indices: equalIndices };

	// equalStart = lt    → first index of equal region
	// equalEnd   = gt+1  → last index of equal region
	// Left subarray:  [low,          equalStart - 1]
	// Right subarray: [equalEnd + 1, high           ]
	return [lt, gt + 1];
}

function* quickSortHelper(
	array: number[],
	low: number,
	high: number
): Generator<SortStep, void, undefined> {
	while (low < high) {
		// Base case: 2 elements
		if (high - low === 1) {
			yield { type: 'compare', indices: [low, high] };
			if (array[low]! > array[high]!) {
				[array[low], array[high]] = [array[high]!, array[low]!];
				yield { type: 'swap', indices: [low, high] };
			}
			yield { type: 'sorted', indices: [low, high] };
			break;
		}

		// Base case: 3 elements — medianOfThree fully sorts them
		if (high - low === 2) {
			yield* medianOfThree(array, low, high);
			yield { type: 'sorted', indices: [low, low + 1, high] };
			break;
		}

		yield* medianOfThree(array, low, high);
		const [equalStart, equalEnd] = yield* threeWayPartition(array, low, high);

		// Tail call elimination — recurse smaller, loop larger
		if (equalStart - 1 - low < high - equalEnd - 1) {
			yield* quickSortHelper(array, low, equalStart - 1);
			low = equalEnd + 1;
		} else {
			yield* quickSortHelper(array, equalEnd + 1, high);
			high = equalStart - 1;
		}
	}

	if (low === high) {
		yield { type: 'sorted', indices: [low] };
	}
}

export function* quickSort(arr: number[]): Generator<SortStep, void, undefined> {
	if (arr.length <= 1) return;
	yield* quickSortHelper(arr, 0, arr.length - 1);
}

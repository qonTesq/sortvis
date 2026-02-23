import type { SortStep } from '$types/algorithm';

function* medianOfThree(
	arr: Uint8Array,
	low: number,
	high: number
): Generator<SortStep, void, undefined> {
	const mid = (low + high) >> 1;

	yield { type: 'compare', indices: [low, mid] };
	if (arr[low]! > arr[mid]!) {
		[arr[low], arr[mid]] = [arr[mid]!, arr[low]!];
		yield { type: 'swap', indices: [low, mid] };
	}

	yield { type: 'compare', indices: [low, high] };
	if (arr[low]! > arr[high]!) {
		[arr[low], arr[high]] = [arr[high]!, arr[low]!];
		yield { type: 'swap', indices: [low, high] };
	}

	yield { type: 'compare', indices: [mid, high] };
	if (arr[mid]! > arr[high]!) {
		[arr[mid], arr[high]] = [arr[high]!, arr[mid]!];
		yield { type: 'swap', indices: [mid, high] };
	}

	yield { type: 'pivot', indices: [mid] };
}

function* partition(
	arr: Uint8Array,
	low: number,
	high: number
): Generator<SortStep, number, undefined> {
	const mid = (low + high) >> 1;
	const pivot = arr[mid]!;

	let i = low - 1;
	let j = high + 1;

	while (true) {
		do {
			i++;
			yield { type: 'compare', indices: [i, mid] };
		} while (arr[i]! < pivot);

		do {
			j--;
			yield { type: 'compare', indices: [j, mid] };
		} while (arr[j]! > pivot);

		if (i >= j) return j;

		[arr[i], arr[j]] = [arr[j]!, arr[i]!];
		yield { type: 'swap', indices: [i, j] };
	}
}

function* quickSortHelper(
	arr: Uint8Array,
	low: number,
	high: number
): Generator<SortStep, void, undefined> {
	while (low < high) {
		if (high - low === 1) {
			yield { type: 'compare', indices: [low, high] };
			if (arr[low]! > arr[high]!) {
				[arr[low], arr[high]] = [arr[high]!, arr[low]!];
				yield { type: 'swap', indices: [low, high] };
			}
			yield { type: 'sorted', indices: [low, high] };
			break;
		}

		yield* medianOfThree(arr, low, high);
		const p = yield* partition(arr, low, high);

		if (p - low < high - p) {
			yield* quickSortHelper(arr, low, p);
			low = p + 1;
		} else {
			yield* quickSortHelper(arr, p + 1, high);
			high = p;
		}
	}

	if (low === high) yield { type: 'sorted', indices: [low] };
}

export function* quickSort(arr: Uint8Array): Generator<SortStep, void, undefined> {
	if (arr.length <= 1) return;
	yield* quickSortHelper(arr, 0, arr.length - 1);
}

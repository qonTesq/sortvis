import type { SortStep } from '$types/algorithm';

function* merge(
	array: number[],
	buffer: number[],
	left: number,
	mid: number,
	right: number
): Generator<SortStep, void, undefined> {
	for (let i = left; i <= right; i++) {
		buffer[i] = array[i]!;
	}

	let i = left;
	let j = mid + 1;
	let k = left;

	while (i <= mid && j <= right) {
		yield {
			type: 'compare',
			indices: [i, j]
		};

		if (buffer[i]! <= buffer[j]!) {
			array[k] = buffer[i]!;
			i += 1;
		} else {
			array[k] = buffer[j]!;
			j += 1;
		}

		yield {
			type: 'merge',
			indices: [k],
			value: array[k]!
		};

		k += 1;
	}

	while (i <= mid) {
		array[k] = buffer[i]!;
		yield {
			type: 'merge',
			indices: [k],
			value: array[k]!
		};
		i += 1;
		k += 1;
	}

	while (j <= right) {
		array[k] = buffer[j]!;
		yield {
			type: 'merge',
			indices: [k],
			value: array[k]!
		};
		j += 1;
		k += 1;
	}
}

function* mergeSortHelper(
	array: number[],
	buffer: number[],
	left: number,
	right: number
): Generator<SortStep, void, undefined> {
	if (left < right) {
		const mid = Math.floor((left + right) / 2);
		yield* mergeSortHelper(array, buffer, left, mid);
		yield* mergeSortHelper(array, buffer, mid + 1, right);

		// Early-exit: skip merge if left and right halves are already in order
		if (array[mid]! <= array[mid + 1]!) return;

		yield* merge(array, buffer, left, mid, right);
	}
}

export function* mergeSort(arr: number[]): Generator<SortStep, void, undefined> {
	const buffer = new Array<number>(arr.length);
	yield* mergeSortHelper(arr, buffer, 0, arr.length - 1);
}

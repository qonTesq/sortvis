import type { SortStep } from '$types/algorithm';

function* merge(
	arr: number[],
	buf: number[],
	left: number,
	mid: number,
	right: number
): Generator<SortStep, void, undefined> {
	for (let i = left; i <= right; i++) buf[i] = arr[i]!;

	let i = left,
		j = mid + 1,
		k = left;

	while (i <= mid && j <= right) {
		yield { type: 'compare', indices: [i, j] };

		if (buf[i]! <= buf[j]!) {
			arr[k] = buf[i++]!;
		} else {
			arr[k] = buf[j++]!;
		}

		yield { type: 'merge', indices: [k], value: arr[k]! };
		k++;
	}

	while (i <= mid) {
		arr[k] = buf[i++]!;
		yield { type: 'merge', indices: [k], value: arr[k]! };
		k++;
	}

	while (j <= right) {
		arr[k] = buf[j++]!;
		yield { type: 'merge', indices: [k], value: arr[k]! };
		k++;
	}
}

function* mergeSortHelper(
	arr: number[],
	buf: number[],
	left: number,
	right: number
): Generator<SortStep, void, undefined> {
	if (left >= right) return;

	const mid = (left + right) >> 1;
	yield* mergeSortHelper(arr, buf, left, mid);
	yield* mergeSortHelper(arr, buf, mid + 1, right);

	if (arr[mid]! <= arr[mid + 1]!) return;

	yield* merge(arr, buf, left, mid, right);
}

export function* mergeSort(arr: number[]): Generator<SortStep, void, undefined> {
	yield* mergeSortHelper(arr, new Array<number>(arr.length), 0, arr.length - 1);
	for (let i = 0; i < arr.length; i++) yield { type: 'sorted', indices: [i] };
}

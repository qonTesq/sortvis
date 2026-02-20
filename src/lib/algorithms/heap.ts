import type { SortStep } from '$types/algorithm';

function* siftDown(arr: number[], n: number, i: number): Generator<SortStep, void, undefined> {
	while (true) {
		let largest = i;
		const l = 2 * i + 1;
		const r = 2 * i + 2;

		if (l < n) {
			yield { type: 'compare', indices: [largest, l] };
			if (arr[l]! > arr[largest]!) largest = l;
		}

		if (r < n) {
			yield { type: 'compare', indices: [largest, r] };
			if (arr[r]! > arr[largest]!) largest = r;
		}

		if (largest === i) break;

		[arr[i], arr[largest]] = [arr[largest]!, arr[i]!];
		yield { type: 'swap', indices: [i, largest] };
		i = largest;
	}
}

export function* heapSort(arr: number[]): Generator<SortStep, void, undefined> {
	const n = arr.length;

	for (let i = Math.floor(n / 2) - 1; i >= 0; i--) yield* siftDown(arr, n, i);

	for (let i = n - 1; i > 0; i--) {
		[arr[0], arr[i]] = [arr[i]!, arr[0]!];
		yield { type: 'swap', indices: [0, i] };
		yield* siftDown(arr, i, 0);
		yield { type: 'sorted', indices: [i] };
	}

	yield { type: 'sorted', indices: [0] };
}

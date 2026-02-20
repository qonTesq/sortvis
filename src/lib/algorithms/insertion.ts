import type { SortStep } from '$types/algorithm';

export function* insertionSort(arr: number[]): Generator<SortStep, void, undefined> {
	yield { type: 'sorted', indices: [0] };

	for (let i = 1; i < arr.length; i++) {
		const current = arr[i]!;
		let j = i;

		while (j > 0) {
			yield { type: 'compare', indices: [j - 1, j] };
			if (arr[j - 1]! <= current) break;
			arr[j] = arr[j - 1]!;
			yield { type: 'swap', indices: [j - 1, j] };
			j--;
		}

		arr[j] = current;
		yield { type: 'sorted', indices: [j] };
	}
}

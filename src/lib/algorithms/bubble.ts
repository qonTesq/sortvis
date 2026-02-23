import type { SortStep } from '$types/algorithm';

export function* bubbleSort(arr: Uint8Array): Generator<SortStep, void, undefined> {
	const n = arr.length;
	let bound = n - 1;

	while (bound > 0) {
		let newBound = 0;

		for (let j = 0; j < bound; j++) {
			yield { type: 'compare', indices: [j, j + 1] };

			if (arr[j]! > arr[j + 1]!) {
				[arr[j], arr[j + 1]] = [arr[j + 1]!, arr[j]!];
				newBound = j;
				yield { type: 'swap', indices: [j, j + 1] };
			}
		}

		const sortedIndices = Array.from({ length: bound - newBound }, (_, i) => newBound + 1 + i);
		if (sortedIndices.length) yield { type: 'sorted', indices: sortedIndices };
		bound = newBound;
	}

	yield { type: 'sorted', indices: [0] };
}

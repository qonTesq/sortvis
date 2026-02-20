import type { SortStep } from '$types/algorithm';

export function* bubbleSort(arr: number[]): Generator<SortStep, void, undefined> {
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

		// Mark everything from newBound+1 to bound as sorted
		const sortedIndices = Array.from({ length: bound - newBound }, (_, idx) => newBound + 1 + idx);
		if (sortedIndices.length > 0) {
			yield { type: 'sorted', indices: sortedIndices };
		}

		bound = newBound;
	}

	// Mark element 0 as sorted — last remaining element
	yield { type: 'sorted', indices: [0] };
}

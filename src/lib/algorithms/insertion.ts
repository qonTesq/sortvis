import type { SortStep } from '$types/algorithm';

export function* insertionSort(arr: number[]): Generator<SortStep, void, undefined> {
	const n = arr.length;

	// First element is always sorted by itself
	yield {
		type: 'sorted',
		indices: [0]
	};

	for (let i = 1; i < n; i++) {
		let j = i;

		while (j > 0) {
			yield {
				type: 'compare',
				indices: [j - 1, j]
			};

			if (arr[j - 1]! > arr[j]!) {
				[arr[j], arr[j - 1]] = [arr[j - 1]!, arr[j]!];
				yield {
					type: 'swap',
					indices: [j - 1, j]
				};
				j--;
			} else {
				break;
			}
		}

		// Element landed at index j — mark it as part of the sorted prefix
		yield {
			type: 'sorted',
			indices: [j]
		};
	}
}

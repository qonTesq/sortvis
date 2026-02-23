/**
 * Semantic states that map directly to CSS variables in the Canvas component
 */
export type BarState = 'default' | 'comparing' | 'swapping' | 'sorted' | 'pivot' | 'merge';

/**
 * Ordered lookup array — index matches the integer stored in the Uint8Array color buffer.
 * BAR_STATES[0] === 'default', BAR_STATES[1] === 'comparing', etc.
 */
export const BAR_STATES = [
	'default',
	'comparing',
	'swapping',
	'sorted',
	'pivot',
	'merge'
] as const satisfies BarState[];

/**
 * Reverse lookup — encodes a BarState string to its Uint8 integer for storage in colors[].
 */
export const BAR_STATE_ID: Record<BarState, number> = {
	default: 0,
	comparing: 1,
	swapping: 2,
	sorted: 3,
	pivot: 4,
	merge: 5
};

/**
 * Discrete speed levels for the sorting animation
 */
export type SpeedLevel = 'snail' | 'slow' | 'med' | 'fast' | 'rapid' | 'flash';

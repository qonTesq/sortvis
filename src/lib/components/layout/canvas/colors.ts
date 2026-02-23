import type { BarState } from '$types';

export function readThemeColors(): Record<BarState, string> {
	const style = getComputedStyle(document.documentElement);
	const get = (v: string, fb: string) => style.getPropertyValue(v).trim() || fb;
	return {
		default: get('--bar-default', 'oklch(0.205 0 0)'),
		comparing: get('--bar-comparing', 'oklch(0.398 0.07 227.392)'),
		swapping: get('--bar-swapping', 'oklch(0.646 0.222 41.116)'),
		sorted: get('--bar-sorted', 'oklch(0.6 0.118 184.704)'),
		pivot: get('--bar-pivot', 'oklch(0.828 0.189 84.429)'),
		merge: style.getPropertyValue('--bar-pivot').trim()
	};
}

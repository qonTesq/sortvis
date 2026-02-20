import type { BarState } from '$types';

export const CONFIG = {
	MIN_BAR_HEIGHT_OFFSET: 10
};

/** Cached layout — computed once per full redraw, reused for partial redraws */
export interface BarLayout {
	step: number;
	gap: number;
	maxValue: number;
	height: number;
}

/**
 * Compute layout parameters from current canvas/array state.
 * Inputs (width, height) are PHYSICAL PIXELS now.
 */
export function computeLayout(width: number, height: number, array: number[]): BarLayout {
	const size = array.length;

	let maxValue = 1;
	for (let i = 0; i < array.length; i++) {
		if (array[i]! > maxValue) maxValue = array[i]!;
	}

	const step = width / size;
	// 1 physical pixel gap when bars are wide enough (> 6px physical)
	const gap = step > 3 ? 1 : 0;

	return { step, gap, maxValue, height };
}

/** Full redraw — all bars, batched by color */
export function drawAllBars(
	ctx: CanvasRenderingContext2D,
	width: number,
	height: number,
	array: number[],
	colors: BarState[],
	themeColors: Record<BarState, string>
): BarLayout {
	const layout = computeLayout(width, height, array);
	const size = array.length;

	const batches: Record<string, Path2D> = {};

	for (let i = 0; i < size; i++) {
		const value = array[i] ?? 0;
		const state = colors[i] || 'default';
		const color = themeColors[state];

		if (!batches[color]) {
			batches[color] = new Path2D();
		}

		// Height scaling needs dpr-aware offset? No, height is physical.
		// MIN_BAR_HEIGHT_OFFSET is arbitrary constant, 10px physical is fine at high DPI.
		const barHeight = ((value / layout.maxValue) * (height - CONFIG.MIN_BAR_HEIGHT_OFFSET)) | 0;
		const y = (height - barHeight) | 0;
		const x0 = (i * layout.step) | 0;
		const x1 = ((i + 1) * layout.step) | 0;
		const barWidth = x1 - x0 - layout.gap;

		batches[color]!.rect(x0, y, barWidth, barHeight);
	}

	for (const [color, path] of Object.entries(batches)) {
		ctx.fillStyle = color;
		ctx.fill(path);
	}

	return layout;
}

/** Partial redraw — only the bars at the given indices */
export function drawBarsByIndex(
	ctx: CanvasRenderingContext2D,
	indices: number[],
	layout: BarLayout,
	array: number[],
	colors: BarState[],
	themeColors: Record<BarState, string>
) {
	for (let j = 0; j < indices.length; j++) {
		const i = indices[j]!;
		const value = array[i] ?? 0;
		const state = colors[i] || 'default';
		const color = themeColors[state];

		const barHeight =
			((value / layout.maxValue) * (layout.height - CONFIG.MIN_BAR_HEIGHT_OFFSET)) | 0;
		const y = (layout.height - barHeight) | 0;
		const x0 = (i * layout.step) | 0;
		const x1 = ((i + 1) * layout.step) | 0;
		const barWidth = x1 - x0 - layout.gap;

		// Clear the full physical column width
		ctx.clearRect(x0, 0, x1 - x0, layout.height);

		// Redraw just the bar (gap stays cleared)
		ctx.fillStyle = color;
		ctx.fillRect(x0, y, barWidth, barHeight);
	}
}

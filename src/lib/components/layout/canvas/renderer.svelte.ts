import { visualizer } from '$store';
import type { BarState } from '$types';
import { drawAllBars, drawBarsByIndex, type BarLayout } from './draw';
import { readThemeColors } from './colors';

export function render(canvas: HTMLCanvasElement) {
	const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
	let rafId: number | null = null;
	let dirty = true;
	let fullRedraw = true;

	// Cache DPR and cap at 2 — still needed for contentRect fallback sizing
	const dpr = Math.min(window.devicePixelRatio || 1, 2);

	// Cached layout from last full draw — reused for partial draws
	let cachedLayout: BarLayout | null = null;

	// Snapshots of what was last drawn — used for diffing (Uint8Array for memcpy-speed copies)
	let prevColors: Uint8Array = new Uint8Array(0);
	let prevArray: Uint8Array = new Uint8Array(0);

	let themeColors: Record<BarState, string> = {
		default: '',
		comparing: '',
		swapping: '',
		sorted: '',
		pivot: '',
		merge: ''
	};

	function updateThemeColors() {
		themeColors = readThemeColors();
		dirty = true;
		fullRedraw = true;
		startLoop();
	}

	function drawFrame() {
		if (!ctx) return;

		// Use physical pixels for rendering (no DPR scaling in context)
		const width = canvas.width;
		const height = canvas.height;
		const { array, colors } = visualizer;

		if (array.length === 0) return;

		if (fullRedraw || !cachedLayout || prevColors.length !== colors.length) {
			// Full redraw — resize, theme change, array regeneration, first draw
			ctx.clearRect(0, 0, width, height);
			cachedLayout = drawAllBars(ctx, width, height, array, colors, themeColors);
			fullRedraw = false;
		} else {
			// Diff against what was last drawn to find changed bars
			const changed: number[] = [];
			for (let i = 0; i < array.length; i++) {
				if (colors[i] !== prevColors[i] || array[i] !== prevArray[i]) changed.push(i);
			}

			if (changed.length === 0) return; // Nothing changed

			if (changed.length > array.length * 0.4) {
				// More than 40% changed — full redraw is faster (batched by color)
				ctx.clearRect(0, 0, width, height);
				cachedLayout = drawAllBars(ctx, width, height, array, colors, themeColors);
			} else {
				// Partial redraw — only the changed bars
				drawBarsByIndex(ctx, changed, cachedLayout, array, colors, themeColors);
			}
		}

		// Snapshot what we just drew
		prevColors = colors.slice();
		prevArray = array.slice();
	}

	// "Sleepy Loop" — runs only when dirty or playing, stops when idle
	function loop() {
		if (dirty) {
			dirty = false;
			drawFrame();
		}

		// Keep loop running if playing (animation updates happen frequently)
		// OR if dirty flag is set (pending update)
		if (visualizer.status === 'playing' || dirty) {
			rafId = requestAnimationFrame(loop);
		} else {
			// Stop the loop — truly 0 CPU usage when idle
			rafId = null;
		}
	}

	function startLoop() {
		if (rafId === null) loop();
	}

	// Initial Setup
	updateThemeColors();
	startLoop();

	// Observers
	const resizeObserver = new ResizeObserver((entries) => {
		const entry = entries[0];
		if (!entry) return;

		// Prefer devicePixelContentBoxSize (exact physical pixels) when available,
		// falling back to contentRect * dpr for older browsers
		const dpBox = entry.devicePixelContentBoxSize?.[0];
		canvas.width = dpBox ? dpBox.inlineSize : entry.contentRect.width * dpr;
		canvas.height = dpBox ? dpBox.blockSize : entry.contentRect.height * dpr;

		// Draw immediately to avoid blank flash — don't wait for next RAF
		fullRedraw = true;
		drawFrame();
	});

	const themeObserver = new MutationObserver(() => updateThemeColors());

	if (canvas.parentElement) {
		resizeObserver.observe(canvas.parentElement);
	}

	themeObserver.observe(document.documentElement, {
		attributes: true,
		attributeFilter: ['class']
	});

	// Reactive — set dirty flag and wake up the loop if needed
	$effect(() => {
		void visualizer.size;
		dirty = true;
		fullRedraw = true;
		startLoop();
	});

	$effect(() => {
		void visualizer.tick;
		dirty = true;
		// Don't set fullRedraw — let drawFrame diff and decide
		startLoop();
	});

	return () => {
		if (rafId !== null) cancelAnimationFrame(rafId);
		resizeObserver.disconnect();
		themeObserver.disconnect();
	};
}

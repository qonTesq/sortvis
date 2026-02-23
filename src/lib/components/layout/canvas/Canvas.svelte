<script lang="ts">
	import { visualizer } from '$state';
	import type { BarState } from '$types';
	import { drawAllBars, drawBarsByIndex, type BarLayout } from './renderer';

	function render(canvas: HTMLCanvasElement) {
		let ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
		let rafId: number | null = null;
		let dirty = true;
		let fullRedraw = true;

		// Cache DPR and cap at 2 - though we now use physical pixels,
		// we still need dpr for initial canvas sizing
		const dpr = Math.min(window.devicePixelRatio || 1, 2);

		// Cached layout from last full draw — reused for partial draws
		let cachedLayout: BarLayout | null = null;

		// Snapshots of what was last drawn — used for diffing
		let prevColors: BarState[] = [];
		let prevArray: number[] = [];

		let themeColors: Record<BarState, string> = {
			default: '',
			comparing: '',
			swapping: '',
			sorted: '',
			pivot: '',
			merge: ''
		};

		function updateThemeColors() {
			const style = getComputedStyle(document.documentElement);
			themeColors = {
				default: style.getPropertyValue('--bar-default').trim() || 'oklch(0.205 0 0)',
				comparing: style.getPropertyValue('--bar-comparing').trim() || 'oklch(0.398 0.07 227.392)',
				swapping: style.getPropertyValue('--bar-swapping').trim() || 'oklch(0.646 0.222 41.116)',
				sorted: style.getPropertyValue('--bar-sorted').trim() || 'oklch(0.6 0.118 184.704)',
				pivot: style.getPropertyValue('--bar-pivot').trim() || 'oklch(0.828 0.189 84.429)',
				merge: style.getPropertyValue('--bar-pivot').trim()
			};
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
			if (!entries[0]) return;

			const { width, height } = entries[0].contentRect;
			canvas.width = width * dpr;
			canvas.height = height * dpr;
			// No setTransform — we draw in physical pixels directly

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

		// Reactive — set dirty flag and WAKE UP THE LOOP if needed
		$effect(() => {
			void visualizer.size;
			dirty = true;
			fullRedraw = true;
			startLoop(); // Wake up!
		});

		$effect(() => {
			void visualizer.tick;
			dirty = true;
			// Don't set fullRedraw — let drawFrame diff and decide
			startLoop(); // Wake up!
		});

		return () => {
			if (rafId !== null) cancelAnimationFrame(rafId);
			resizeObserver.disconnect();
			themeObserver.disconnect();
		};
	}
</script>

<div class="relative h-full min-h-0 w-full flex-1 overflow-hidden">
	<canvas
		{@attach render}
		class="block h-full w-full"
		aria-label="{visualizer.algorithmId} sorting visualization"
	></canvas>
</div>

import { clamp, mapRange } from '~/libs/common/math';

export const useScrollProgress = (
	target: HTMLElement,
	callback: (progress: number) => void,
	entry: number = 0.5,
	exit: number = 0.5
) => {
	const { height: windowHeight } = useWindowSize();

	const { stop, inView } = useInView(target);

	// measure once + on layout changes, instead of a layout read on every scroll
	let pageTop = 0;
	let height = 0;
	const measure = () => {
		if (!target) return;
		const rect = target.getBoundingClientRect();
		pageTop = rect.top + window.scrollY;
		height = rect.height;
	};
	onMounted(measure);
	useResizeObserver(() => (import.meta.client ? document.documentElement : null), measure);
	useEventListener('resize', measure);

	const scrollCallback = ({ scroll }: { scroll: number }) => {
		if (!height || !windowHeight.value) return;
		if (!inView.value) return;

		const start: number = pageTop - windowHeight.value * entry;
		const end: number = pageTop + height - windowHeight.value * exit;
		const progress: number = clamp(0, mapRange(start, end, scroll, 0, 1), 1);

		callback(progress);
	};

	useLenis(scrollCallback);

	tryOnBeforeUnmount(() => {
		stop();
	});
};

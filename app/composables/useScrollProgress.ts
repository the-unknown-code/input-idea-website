import { clamp, mapRange } from '~/libs/common/math';

export const useScrollProgress = (
	target: HTMLElement,
	callback: (progress: number) => void,
	entry: number = 0.5,
	exit: number = 0.5
) => {
	const { top, height } = useElementBounding(target);
	const { height: windowHeight } = useWindowSize();

	const { stop, inView } = useInView(target);

	const scrollCallback = ({ scroll }: { scroll: number }) => {
		if (!height.value || !windowHeight.value) return;
		if (!inView.value) return;

		const pageTop: number = scroll + top.value;
		const start: number = pageTop - windowHeight.value * entry;
		const end: number = pageTop + height.value - windowHeight.value * exit;
		const progress: number = clamp(0, mapRange(start, end, scroll, 0, 1), 1);

		callback(progress);
	};

	useLenis(scrollCallback);

	tryOnBeforeUnmount(() => {
		stop();
	});
};

export default (target: HTMLElement | undefined, ops?: { once?: boolean }) => {
	const { once } = {
		once: false,
		...ops,
	};

	const inView = ref(false);
	let stop = function () {};

	onMounted(() => {
		const { stop: stopIntersecting } = useIntersectionObserver(
			target,

			// @ts-expect-error - IntersectionObserverEntry is not typed
			([{ isIntersecting }]) => {
				inView.value = isIntersecting;
				if (once && inView.value) {
					stopIntersecting();
				}
			}
		);
		stop = stopIntersecting;
	});

	onBeforeUnmount(() => stop());

	return { inView, stop };
};

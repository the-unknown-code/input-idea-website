type LenisScrollEvent = {
	scroll: number;
	limit: number;
	velocity: number;
	direction: number;
	progress: number;
};

type ScrollCallback = (e: LenisScrollEvent) => void;

export default (callback?: ScrollCallback) => {
	const instanceKey: string = `lenis-instance`;
	const lenis = inject<any>(instanceKey);

	if (lenis?.value && callback) {
		lenis.value.on('scroll', callback);
	}

	tryOnBeforeUnmount(() => {
		if (callback) {
			lenis.value?.off('scroll', callback);
		}
	});

	return lenis;
};

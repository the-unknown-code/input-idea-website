const { width } = useWindowSize();

export default () => {
	const breakpoints = useRuntimeConfig().public.breakpoints;
	// The server has no window (width = Infinity -> desktop). Report desktop until the
	// component is mounted so the first client render matches the SSR HTML (no hydration mismatch).
	const mounted = useMounted();
	const isMobile = computed(() => mounted.value && width.value < breakpoints.mobile);
	const isDesktop = computed(() => !isMobile.value);

	return {
		isMobile,
		isDesktop,
	};
};

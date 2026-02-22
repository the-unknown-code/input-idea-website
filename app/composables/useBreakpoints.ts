const { width } = useWindowSize();

export default () => {
	const breakpoints = useRuntimeConfig().public.breakpoints;
	const isMobile = computed(() => width.value < breakpoints.mobile);
	const isDesktop = computed(() => width.value >= breakpoints.mobile);

	return {
		isMobile,
		isDesktop,
	};
};

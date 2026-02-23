<!--
  App.vue
  Root component of the Nuxt 4.1 application.
  - Handles global layout wrapper and page rendering.
  - Manages app-level states like focus, resize events, font loading, and loading indicators.
  - Applies global classes to #site for styling and interaction control.
-->

<template>

	<div id="site"
		:class="[
			toKebabCase(route.name as string),
			{ 'is-disabled': !enabled, 'fonts-loaded': fontsLoaded, 'is-loading': isLoading },
			$store.theme

		]">

		<nuxt-layout>
			<nuxt-page />
		</nuxt-layout>
	</div>
</template>

<script setup lang="ts">
import { toKebabCase } from './libs/common/utils';
import { EVENTS } from './libs/constants/event';
import useAppStore from './store/useAppStore';

const $store = useAppStore();
const { $emit } = useNuxtApp();
const { width, height } = useWindowSize();
const { isLoading } = useLoadingIndicator();
const fontsLoaded = ref<boolean>(false);

const route = useRoute();
const scope = effectScope();
const enabled = computed(() => $store.isEnabled);

const preloadFonts = async () => {
	await nextTick();
	fontsLoaded.value = true;
};

scope.run(async () => {
	const resize = useDebounceFn(() => {
		$emit(EVENTS.RESIZE, { width: width.value, height: height.value });
	}, 40);

	watch([width, height], () => {
		resize();
	});
});

tryOnBeforeMount(async () => {
	await preloadFonts();
});
</script>

<style lang="scss" scoped>
#site {
	position: relative;
	width: 100vw;
	min-height: 100vh;
	overflow-x: clip;
	opacity: 0;

	background-color: var(--theme-bg);
	color: var(--theme-fg);

	&.is-loading,
	&.is-not-focused {
		pointer-events: none;
	}

	&.fonts-loaded {
		opacity: unset;
	}
}
</style>

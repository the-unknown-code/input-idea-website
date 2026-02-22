<!--
  LenisWrapper.vue
  ----------------
  This component sets up a Lenis smooth scrolling instance
  with wrapper and content refs, provides it globally via
  Vue's provide/inject system, and ensures cleanup on unmount.
-->

<template>
	<div ref="$wrapper" class="lenis">
		<div ref="$content">
			<slot />
		</div>
	</div>
</template>

<script setup lang="ts">
import Lenis from 'lenis';
import Tempus from 'tempus';
import useAppStore from '~/store/useAppStore';

const { root, options } = defineProps({
	root: {
		type: Boolean,
		default: true,
	},
	options: {
		type: Object,
		default: () => {},
	},
});

const { hook } = useNuxtApp();
const $store = useAppStore();
const $wrapper = ref<HTMLElement | null>(null);
const $content = ref<HTMLElement | null>(null);
const lenis = shallowRef<Lenis | null>(null);
const removeRaf = ref();
const scope = effectScope();
provide('lenis-instance', lenis);
defineExpose({
	lenis,
});

const initLenis = () => {
	lenis.value = new Lenis({
		...(!root
			? {
					wrapper: $wrapper.value as HTMLElement,
					content: $content.value as HTMLElement,
					eventsTarget: $wrapper.value as HTMLElement,
					...options,
			  }
			: {
					...options,
			  }),
	});

	lenis.value.scrollTo(0, { immediate: true });
	// lenis.value.stop();

	removeRaf.value = Tempus.add((time: number) => {
		lenis.value?.raf(time);
	});
};

scope.run(async () => {
	watch(
		() => $store.isEnabled,
		enabled => {
			if (lenis.value) {
				lenis.value[enabled ? 'start' : 'stop']();
			}
		}
	);
});

if (!import.meta.server && !lenis.value && root) {
	const nuxtApp = useNuxtApp();
	const isMounted = nuxtApp?.vueApp?._container;

	if (isMounted) initLenis();
	else hook('app:mounted', initLenis);
}

tryOnMounted(() => {
	if (!lenis.value) {
		initLenis();
	}

	hook('page:finish', async () => {
		await nextTick();
		lenis.value?.scrollTo(0, { immediate: true, force: true });
	});
});

tryOnBeforeUnmount(() => {
	removeRaf.value?.();
	lenis.value?.destroy();
});
</script>

<template>
	<transition mode="out-in" @enter="onEnter" @after-enter="onAfterEnter">
		<slot />
	</transition>

	<!-- CUSTOM PAGE TRANSITION -->
	<client-only>
		<teleport to="body">
			<div id="page-transition" ref="$transition" />
		</teleport>
	</client-only>
</template>

<script setup lang="ts">
import gsap from 'gsap/all';
import { GSAPDuration, GSAPEase } from '~/libs/constants/gsap';
import useAppStore from '~/store/useAppStore';

const { hook } = useNuxtApp();
const $transition = ref<HTMLElement | null>(null);
const lenis = useLenis();
const $store = useAppStore();

// ---- TRANSITION HOOKS ----

const onAfterEnter = async () => {
	await nextTick();
	$store.enable();

	if (lenis.value) {
		await nextTick();
		lenis.value.scrollTo(0, { immediate: true, force: true });
	}
};

const onEnter = async (e: Element, done: () => void) => {
	done();
};

hook('page:start', () => {
	$store.disable();
});

hook('page:finish', () => {
	setTimeout(async () => {
		await nextTick();
		$store.enable();
		gsap.to('#page-transition', {
			opacity: 0,
			duration: GSAPDuration.FAST,
			ease: GSAPEase.SLOW_IN_OUT,
		});
	}, 0);
});
</script>

<style lang="scss" scoped>
#page-transition {
	@include fill(fixed);
	background-color: var(--green);
	opacity: 0;
	z-index: 999;
	pointer-events: none;
}
</style>

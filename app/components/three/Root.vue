<template>
	<div ref="$root" class="three-root" />
</template>

<script setup lang="ts">
import type { WebGLRendererParameters } from 'three';
import SF3Application from '~/libs/three';

const { options } = defineProps({
	options: {
		type: Object as PropType<Partial<WebGLRendererParameters>>,
		default: () => {},
	},
});

const $root = ref<HTMLElement | null>(null);
const $three: SF3Application = new SF3Application(options);

tryOnMounted(() => {
	$three.start();
	$root.value?.appendChild($three.domElement);
});

tryOnBeforeUnmount(() => {
	$three.stop();
});
</script>

<style lang="scss" scoped>
.three-root {
	@include fill(fixed);
	z-index: 0;
}
</style>

<!--
  Orchestra Component
  -------------------
  A visual layout grid overlay used as a design/debugging tool.
  It renders a configurable number of vertical columns to help align content
  with the design system during development.

  Features:
   • Controlled via global debug state (Build Panel).
   • Dynamically reads the number of columns from the CSS variable `--layout-columns-count`.
   • Adapts automatically to breakpoints via `useBreakpoints()`.
   • Renders above all content without interfering with interactions (pointer-events disabled).

  Props: 
   • None (column count is derived from CSS variables).
-->

<template>
	<div id="orchestra" :class="{ active }">
		<div class="columns layout-grid">
			<div v-for="i in columns" :key="i" />
		</div>
	</div>
</template>

<script setup lang="ts">
import useAppStore from '~/store/useAppStore';

const $store = useAppStore();
const { isMobile } = useBreakpoints();
// const active = ref<boolean>(false);
const active = computed(() => $store.debug.orchestra);
const columns: Ref<number> = computed((): number => {
	void isMobile.value;

	return parseInt(
		getComputedStyle(document.documentElement).getPropertyValue(
			'--layout-columns-count'
		)
	);
});
</script>

<style lang="scss" scoped>
#orchestra {
	@include fill(fixed);
	z-index: 99999;
	pointer-events: none;
	display: none;

	&.active {
		display: block;
	}

	.columns {
		position: absolute;
		inset: 0;

		div {
			background: red;
			opacity: 0.3;
			height: 100vh;
		}
	}
}
</style>

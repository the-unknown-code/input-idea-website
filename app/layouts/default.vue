<template>
	<lenis :options="{}">
		<div :class="['container']">
			<site-header />

			<page-transition>
				<slot />
			</page-transition>

		<site-footer />

		<client-only>
			<lazy-debug v-if="showDebug" />
		</client-only>
		</div>
	</lenis>
</template>

<script setup lang="ts">
const { public: publicConfig } = useRuntimeConfig();
const showDebug = computed(() => publicConfig.showDebug);
</script>

<style lang="scss" scoped>
.container {
	position: relative;
	z-index: 1;
}
</style>

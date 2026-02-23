<template>
	<main class="page-index">
		<div class="layout-block">
			<home-hero />
			<layout-services />
		</div>
	</main>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
.page-index {
	position: relative;
	padding-top: var(--header-height);

	>div {
		display: flex;
		flex-direction: column;
	}

	section {
		&:not(:first-child) {
			margin: var(--spacer-64) 0;

			@include desktop {
				margin: var(--spacer-128) 0;
			}
		}
	}


}
</style>

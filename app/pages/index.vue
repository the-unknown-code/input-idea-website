<template>
	<main class="page-index">
		<div class="layout-block">
			<home-hero />
			<layout-services />
			<layout-stories />
			<layout-logo-marquee />
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
		gap: var(--spacer-64);

		@include desktop {
			gap: var(--spacer-128);
		}
	}

	section {
		&:last-child {
			margin-bottom: var(--spacer-64);

			@include desktop {
				margin-bottom: var(--spacer-128);
			}
		}
	}


}
</style>

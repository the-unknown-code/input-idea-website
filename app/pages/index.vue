<template>
	<storyblok-wrapper url="home">
		<template #default="{ story, refreshKey }">
			<main :key="refreshKey"
				class="page-index">
				<div class="layout-block">
					<home-hero />
					<storyblok-map :bloks="story.content.body"
						:refresh-key="refreshKey" />
				</div>
			</main>
		</template>
	</storyblok-wrapper>
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

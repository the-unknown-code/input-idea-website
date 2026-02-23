<template>
	<header ref="$header"
		class="header">
		<div class="header__inner layout-block">
			<div>
				<ui-arrow />
			</div>
			<div class="logo">
				<img src="/svgs/logo-input-idea.svg"
					alt="Input Idea" />
			</div>
			<div>
				<ui-ham />
			</div>
		</div>
	</header>
</template>

<script setup lang="ts">
const $header = ref<HTMLElement | null>(null);
const { height } = useElementSize($header);

const initialize = () => {
	console.log(height.value);
}

tryOnMounted(() => {
	initialize();
});
</script>

<style scoped lang="scss">
.header {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	z-index: 50;
	padding-top: var(--spacer-64);

	&__inner {
		display: flex;
		justify-content: space-between;
		align-items: center;

		>div {

			&:nth-child(1),
			&:nth-child(3) {
				position: relative;
				display: flex;
				width: 32px;
				flex: 0 0 32px;
				height: auto;
			}

			&:nth-child(3) {
				justify-content: flex-end;
			}
		}
	}

	.logo {
		display: flex;
		width: 210px;
		flex: 0 0 210px;

		img {
			width: 100%;
			height: auto;
		}


	}
}
</style>

<template>
	<header ref="$header"
		class="header">
		<div class="header__inner layout-block">
			<div>
				<ui-arrow />
			</div>
			<div class="logo">
				<img ref="$logo"
					src="/svgs/logo-input-idea.svg"
					alt="Input Idea" />
			</div>
			<div>
				<ui-ham />
			</div>
		</div>
	</header>
</template>

<script setup lang="ts">
import gsap from 'gsap/all';
import { GSAPDuration, GSAPEase } from '~/libs/constants/gsap';

const $logo = ref<HTMLImageElement | null>(null);
const $header = ref<HTMLElement | null>(null);
const { height } = useElementBounding($header);
const timeline = gsap.timeline({ paused: true });
const scope = effectScope();



const initialize = () => {
	timeline.to($logo.value, {
		opacity: 1,
		y: '-100%',
		duration: GSAPDuration.FAST,
		ease: GSAPEase.SLOW_IN_OUT,
	});
};


scope.run(async () => {
	watch(height, (v) => {
		if (import.meta.client) {
			document.documentElement.style.setProperty('--header-height', `${v}px`);
		}
	}, { immediate: true });

	useLenis(({ scroll }): void => {
		timeline[scroll > 10 ? 'play' : 'reverse']();
	});
})


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
	padding: var(--spacer-32) 0;

	@include desktop {
		padding: var(--spacer-64) 0;
	}

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
		position: relative;
		display: flex;
		width: 120px;
		flex: 0 0 120px;
		overflow: hidden;

		@include desktop {
			width: 210px;
			flex: 0 0 210px;
		}

		img {
			width: 100%;
			height: auto;
		}


	}
}
</style>

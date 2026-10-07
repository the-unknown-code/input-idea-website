<template>
	<header ref="$header"
		class="header">
		<div class="header__inner layout-block">
			<div class="circle">
				<ui-arrow color="var(--darkgrey)" />
			</div>
			<div class="logo">
				<img ref="$logo"
					src="/svgs/logo-input-idea.svg"
					alt="Input Idea" />
			</div>
			<div class="circle">
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

	.circle {
		position: relative;

		&::before {
			content: '';
			position: absolute;
			width: 48px;
			height: 48px;
			border-radius: 50%;
			background-color: var(--yellow);
			z-index: 0;

			left: 50%;
			top: 50%;
			transform: translate(-50%, calc(-50% - 1px));


		}

		>* {
			position: relative;
			z-index: 1;
		}

		&:deep(.ui-ham) {
			transform: scale(.8);
		}
	}

	&__inner {
		display: flex;
		justify-content: space-between;
		align-items: center;

		>div {

			width: 40px;
			flex: 0 0 40px;
			display: flex;
			justify-content: center;

			&:nth-child(1),
			&:nth-child(3) {
				position: relative;
				display: flex;
				height: auto;
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

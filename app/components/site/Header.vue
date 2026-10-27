<template>
	<header ref="$header"
		:class="['header', { 'is-scrolled': isScrolled, 'is-menu-open': menuVisible }]">
		<div class="header__inner layout-block">
			<div class="circle">
				<ui-arrow :color="isScrolled || menuVisible ? 'var(--darkgrey)' : 'var(--yellow)'" />
			</div>
			<div class="logo">
				<img ref="$logo"
					src="/svgs/logo-input-idea.svg"
					alt="Input Idea" />
			</div>
			<div class="circle">
				<button ref="$menuToggle"
					class="menu-toggle"
					type="button"
					:aria-label="isMenuOpen ? 'Chiudi menu' : 'Apri menu'"
					:aria-expanded="isMenuOpen"
					aria-controls="site-menu"
					@click="isMenuOpen = !isMenuOpen">
					<ui-ham />
				</button>
			</div>
		</div>
		<Transition name="menu">
			<nav v-if="isMenuOpen"
				id="site-menu"
				ref="$menu"
				class="header__menu"
				aria-label="Navigazione principale"
				tabindex="-1">
				<div class="header__menu-panel">
					<div class="header__menu-items">
						<template v-for="(item, index) in menuItems"
							:key="item.label">
							<nuxt-link v-if="item.href"
								:to="item.href"
								class="header__menu-item"
								:style="{ animationDelay: `${160 + index * 65}ms` }"
								@click="isMenuOpen = false">{{ item.label }}</nuxt-link>
							<span v-else
								class="header__menu-item"
								:style="{ animationDelay: `${160 + index * 65}ms` }">{{ item.label }}</span>
						</template>
					</div>
				</div>
			</nav>
		</Transition>
	</header>
</template>

<script setup lang="ts">
import gsap from 'gsap/all';
import { GSAPDuration, GSAPEase } from '~/libs/constants/gsap';

const $logo = ref<HTMLImageElement | null>(null);
const $header = ref<HTMLElement | null>(null);
const $menu = ref<HTMLElement | null>(null);
const $menuToggle = ref<HTMLButtonElement | null>(null);
const isScrolled = ref(false);
const isMenuOpen = ref(false);
const menuVisible = computed(() => isMenuOpen.value || Boolean($menu.value));
const menuItems = [
	{ label: 'INPUT', href: '/chi-siamo' },
	{ label: 'PROGETTI', href: '/portfolio' },
	{ label: 'LAVORA CON NOI', href: '/lavora-con-noi' },
	{ label: 'CONTATTI', href: '/contatti' },
];
const lenis = useLenis();
const route = useRoute();
let previousOverflow = '';
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
		isScrolled.value = scroll > 10;
		timeline[isScrolled.value ? 'play' : 'reverse']();
	});
})

watch(isMenuOpen, async (open) => {
	if (!import.meta.client) return;

	if (open) {
		previousOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		lenis.value?.stop();
		await nextTick();
		$menu.value?.focus();
	} else {
		document.body.style.overflow = previousOverflow;
		lenis.value?.start();
	}
});

watch(() => route.fullPath, () => { isMenuOpen.value = false; });

const onKeydown = (event: KeyboardEvent) => {
	if (event.key !== 'Escape' || !isMenuOpen.value) return;
	isMenuOpen.value = false;
	$menuToggle.value?.focus();
};

tryOnMounted(() => {
	isScrolled.value = window.scrollY > 10;
	initialize();
	window.addEventListener('keydown', onKeydown);
});

tryOnBeforeUnmount(() => {
	window.removeEventListener('keydown', onKeydown);
	if (isMenuOpen.value) {
		document.body.style.overflow = previousOverflow;
		lenis.value?.start();
	}
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
			background-color: transparent;
			z-index: 0;
			transition: background-color 250ms ease;

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

			rect {
				fill: var(--yellow);
				transition: fill 250ms ease;
			}
		}

		&:deep(.ui-arrow path) {
			transition: fill 250ms ease;
		}
	}

	&.is-scrolled {
		.circle {
			&::before {
				background-color: var(--yellow);
			}

			&:deep(.ui-ham rect) {
				fill: var(--darkgrey);
			}
		}
	}

	&.is-menu-open {
		.circle {
			&::before {
				background-color: transparent;
			}

			&:deep(.ui-ham rect) {
				fill: var(--darkgrey);
			}
		}

		.logo img {
			opacity: 1 !important;
			transform: none !important;
			filter: brightness(0);
		}
	}

	&__inner {
		position: relative;
		z-index: 2;
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

	.menu-toggle {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		border: 0;
		background: transparent;
		cursor: pointer;
	}

	&__menu {
		position: fixed;
		inset: 0;
		z-index: 1;
		background: var(--darkgrey);
		outline: none;
	}

	&__menu-panel {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		background: var(--yellow);
		clip-path: inset(0 0 0 0);
		overflow-y: auto;
	}

	&__menu-items {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 8px;
		padding: 120px 24px 48px clamp(32px, 17vw, 280px);

		@include mobile {
			padding: 110px 24px 32px 32px;
		}
	}

	&__menu-item {
		color: var(--darkgrey);
		font-family: 'Pathway Extreme', sans-serif;
		font-size: clamp(64px, 6vw, 92px);
		font-weight: 100;
		font-variation-settings: 'wdth' 55;
		line-height: 1.05;
		letter-spacing: -.04em;
		text-transform: uppercase;
		text-decoration: none;
		white-space: nowrap;
		transition: transform 250ms var(--ease-out-circ), opacity 250ms ease;

		@include mobile {
			font-size: clamp(42px, 11vw, 64px);
		}

		@include hover {
			&[href]:hover {
				transform: translateX(10px);
				opacity: .6;
			}
		}
	}

	.menu-enter-active,
	.menu-leave-active {
		transition: opacity 350ms ease;
	}

	.menu-enter-from,
	.menu-leave-to {
		opacity: 0;
	}

	.menu-enter-active .header__menu-panel,
	.menu-leave-active .header__menu-panel {
		transition: clip-path 680ms var(--ease-in-out-circ);
	}

	.menu-enter-from .header__menu-panel,
	.menu-leave-to .header__menu-panel {
		clip-path: inset(0 0 100% 0);
	}

	.menu-enter-active .header__menu-item {
		animation: menu-item-enter 560ms var(--ease-out-circ) both;
	}

	@keyframes menu-item-enter {
		from {
			opacity: 0;
			transform: translateY(24px);
		}

		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (prefers-reduced-motion: reduce) {

		.menu-enter-active,
		.menu-leave-active,
		.menu-enter-active .header__menu-panel,
		.menu-leave-active .header__menu-panel,
		.menu-enter-active .header__menu-item {
			animation: none;
			transition: none;
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

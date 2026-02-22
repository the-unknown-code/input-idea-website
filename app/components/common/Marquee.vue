<!--
  Marquee Component
  -----------------
  A horizontally scrolling marquee that loops its slot content infinitely.

  Props:
   • reverse (Boolean) → Scrolls right-to-left when false, left-to-right when true.
   • repeat (Number, default: 3) → How many times the slot content is duplicated for seamless looping.
   • speed (Number, default: 0.02) → Base scroll speed; higher = faster.
   • pauseOnHover (Boolean) → Whether to stop scrolling when hovered.

-->

<template>
	<div
		ref="$container"
		:class="['marquee', { reverse: reverse }]"
		v-on="
			props.pauseOnHover
				? {
						mouseenter: () => (isHovered = true),
						mouseleave: () => (isHovered = false),
				  }
				: {}
		"
	>
		<div ref="$track" class="marquee--track">
			<div v-for="i in repeat" ref="$elements" :key="i" class="inner">
				<slot />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
const props = withDefaults(
	defineProps<{
		reverse?: boolean;
		repeat?: number;
		speed?: number;
		pauseOnHover?: boolean;
	}>(),
	{
		repeat: 3,
		speed: 0.02,
	}
);

const { isDesktop } = useBreakpoints();
const lenis = useLenis();
const scope = effectScope();

const transform = ref<number>(0);
const isHovered = ref<boolean>(false);
const $container = ref<HTMLElement | null>(null);
const $track = ref<HTMLElement | null>(null);
const $elements = shallowRef<HTMLElement[]>([]);

// @ts-expect-error - IntersectionObserverEntry is not typed
const { inView } = useInView($container);

const render = () => {
	useFrame((_, delta: number) => {
		if (!$track.value) return;
		if (!inView.value) return;
		if (props.pauseOnHover && isHovered.value) return;

		if (isNaN(transform.value)) transform.value = 0;

		const velocity: number = lenis.value?.velocity || 0;
		let adjSpeed: number = props.speed;

		if (isDesktop.value) adjSpeed *= 1 + Math.abs(velocity * 0.1);

		let newTransform: number = transform.value;
		newTransform += delta * adjSpeed * (props.reverse ? -1 : 1);

		const { width } = useElementSize($elements.value[0]);
		transform.value =
			((newTransform % width.value) + width.value) % width.value;

		$track.value.style.transform = `translate3d(${-transform.value}px, 0, 0)`;
	});
};

scope.run(render);

tryOnBeforeUnmount(() => {
	scope.stop();
});
</script>

<style lang="scss" scoped>
.marquee {
	display: flex;
	max-width: 100vw;
	overflow-x: clip;
	will-change: transform;

	&.reverse {
		flex-direction: row-reverse;
	}

	&--track {
		display: flex;
		white-space: nowrap;
		will-change: transform;
		pointer-events: none;

		> * {
			flex-shrink: 0;
		}
	}
}
</style>

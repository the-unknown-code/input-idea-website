/** * RotateDevice.vue * * A component that displays a "rotate your device"
overlay for devices * when the screen is in a specific orientation (landscape or
portrait) and * meets optional width/height constraints. * * Props: * @prop
{RegExp} [devices] - Regex to detect mobile devices (default:
/Android|iPhone|iPad|iPod/i) * @prop {number} [maxWidth=1024] - Maximum width to
consider mobile * @prop {number} [minWidth=0] - Minimum width for the overlay to
show * @prop {number} [maxHeight] - Optional maximum height for the overlay *
@prop {number} [minHeight=0] - Minimum height for the overlay to show * @prop
{'landscape' | 'portrait'} [orientation='landscape'] - Required orientation for
overlay to appear * @prop {string}
[imageSrc='images/project-rotation-image.png'] - Image displayed for rotate
screen * * Usage:
<!-- <RotateDevice
        :devices="/Android|iPhone/i"
        :maxWidth="900"
        :minHeight="500"
        orientation="portrait"
        image-src="images/custom-rotate.png"
      />
  -->
*/

<template>
	<div v-if="showRotateScreen" class="rotate-device">
		<h1 class="rotate-title">Please Rotate Your Device</h1>
    <NuxtImg
      :src="imageSrc"
      alt="Rotate Device"
      class="my-4 size-7"
    />
		<!-- <img :src="imageSrc" alt="Rotate Device" /> -->
	</div>
</template>

<script setup lang="ts">
const { width, height } = useWindowSize();
const props = defineProps<{
	devices?: RegExp;
	maxWidth?: number;
	minWidth?: number;
	maxHeight?: number;
	minHeight?: number;
	orientation?: 'landscape' | 'portrait';
	imageSrc?: string;
}>();
const deviceRegex = props.devices ?? /Android|iPhone|iPad|iPod/i;
const maxWidth = props.maxWidth ?? 1024;
const minWidth = props.minWidth ?? 0;
const minHeight = props.minHeight ?? 0;
const orientation = props.orientation ?? 'landscape';
const imageSrc = props.imageSrc ?? '/svgs/rotate-device.svg';

const isMobileDevice = ref(false);
onMounted(() => {
	isMobileDevice.value = deviceRegex.test(navigator.userAgent);
});
const isCorrectOrientation = computed(() => {
	if (orientation === 'landscape') return width.value > height.value;
	if (orientation === 'portrait') return height.value > width.value;
	return true;
});

const showRotateScreen = computed(() => {
	return (
		isMobileDevice.value &&
		width.value >= minWidth &&
		width.value <= maxWidth &&
		height.value >= minHeight &&
		isCorrectOrientation.value
	);
});
</script>

<style lang="scss" scoped>
.rotate-device {
	position: fixed;
	inset: 0;
	background-color: var(--white);
	z-index: 99999;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: var(--spacer-32);

	img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
}

.rotate-title {
  font-size: clamp(4.5rem, 6vw, 3.5rem);
  font-weight: 700;
  text-transform: uppercase;
}
</style>

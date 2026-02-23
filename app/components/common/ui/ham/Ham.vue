<template>
  <div class="ui-ham">
    <svg xmlns="http://www.w3.org/2000/svg"
      width="29"
      height="26"
      viewBox="0 0 29 26"
      @mouseenter="active = true"
      @mouseleave="active = false">
      <g id="Raggruppa_9111"
        data-name="Raggruppa 9111"
        transform="translate(-1221 -3)">
        <rect ref="$rect1"
          width="29"
          height="10"
          transform="translate(1221 3)"
          fill="#fff" />
        <rect ref="$rect2"
          width="29"
          height="5"
          transform="translate(1221 18)"
          fill="#fff" />
        <rect ref="$rect3"
          width="29"
          height="1"
          transform="translate(1221 28)"
          fill="#fff" />
      </g>
    </svg>

  </div>
</template>

<script setup lang="ts">
import gsap from 'gsap/all';
import { GSAPDuration, GSAPEase } from '~/libs/constants/gsap';

const $rect1 = ref<SVGRectElement | null>(null);
const $rect2 = ref<SVGRectElement | null>(null);
const $rect3 = ref<SVGRectElement | null>(null);
const timeline = gsap.timeline({ paused: true });
const active = ref(false);
const scope = effectScope();

const initialize = () => {
  timeline.to($rect1.value, {
    y: -6,
    duration: GSAPDuration.FAST,
    ease: GSAPEase.FAST_OUT
  });

  timeline.to($rect2.value, {
    y: 9,
    duration: GSAPDuration.FAST,
    ease: GSAPEase.FAST_OUT
  }, 0);


  timeline.to($rect3.value, {
    y: 19,
    height: 10,
    duration: GSAPDuration.FAST,
    ease: GSAPEase.FAST_OUT
  }, 0);

}

scope.run(async () => {
  watch(active, (v) => {
    timeline[v ? 'play' : 'reverse']();
  });
});

tryOnMounted(() => {
  initialize()
});

</script>

<style lang="scss" scoped>
.ui-ham {
  display: block;
  cursor: pointer;

}
</style>

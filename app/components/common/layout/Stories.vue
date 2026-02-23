<template>
  <section ref="$stories"
    class="layout-stories layout-grid">
    <a-link href="#"
      role="article"
      class="item item--big-left">
      <common-media src="https://picsum.photos/800/800?random=1"
        cover />
      <div class="content">
        <p class="--yellow"><b>Lorem ipsum dolor amet</b></p>
        <p class="p-small">Dalla comunicazione social istituzionale a quella personalizzata per punto vendita</p>
      </div>
      <ui-arrow />
    </a-link>
    <a-link href="#"
      role="article"
      class="item item--title">
      <h3 class="display">
        <span v-text-reveal>Tutte le nostre <b>storie</b></span>
      </h3>
      <ui-arrow />
    </a-link>
    <a-link href="#"
      role="article"
      class="item item--top-right">
      <common-media src="https://picsum.photos/800/800?random=2"
        cover />
      <div class="content">
        <p class="--yellow"><b>Lorem ipsum dolor amet</b></p>
        <p class="p-small">Dalla comunicazione social istituzionale a quella personalizzata per punto vendita</p>
      </div>
      <ui-arrow />
    </a-link>
    <a-link href="#"
      role="article"
      class="item item--bottom-left">
      <common-media src="https://picsum.photos/800/800?random=3"
        cover />
      <div class="content">
        <p class="--yellow"><b>Lorem ipsum dolor amet</b></p>
        <p class="p-small">Dalla comunicazione social istituzionale a quella personalizzata per punto vendita</p>
      </div>
      <ui-arrow />
    </a-link>
    <a-link href="#"
      role="article"
      class="item item--bottom-center">
      <common-media src="https://picsum.photos/800/800?random=4"
        cover />
      <div class="content">
        <p class="--yellow"><b>Lorem ipsum dolor amet</b></p>
        <p class="p-small">Dalla comunicazione social istituzionale a quella personalizzata per punto vendita</p>
      </div>
      <ui-arrow />
    </a-link>
    <a-link href="#"
      role="article"
      class="item item--bottom-right">
      <common-media src="https://picsum.photos/800/800?random=5"
        cover />
      <div class="content">
        <p class="--yellow"><b>Lorem ipsum dolor amet</b></p>
        <p class="p-small">Dalla comunicazione social istituzionale a quella personalizzata per punto vendita</p>
      </div>
      <ui-arrow />
    </a-link>
  </section>
</template>


<script setup lang="ts">
import gsap from 'gsap/all';
import { GSAPEase } from '~/libs/constants/gsap';


const $stories = ref<HTMLElement | null>(null);

const initialize = () => {
  const $items = $stories.value?.querySelectorAll('.a-div') ?? [];


  $items.forEach((item) => {
    gsap.to(item, {
      opacity: 1,
      y: 0,
      ease: GSAPEase.SLOW_IN_OUT,
      scrollTrigger: {
        trigger: $stories.value,
        start: 'top 95%',
        end: 'bottom 75%',
        scrub: 3,
      }
    })
  });


}

tryOnMounted(() => {
  initialize()
})

tryOnBeforeUnmount(() => {
  const $items = $stories.value?.querySelectorAll('.a-div') ?? [];
  $items.forEach((item) => {
    gsap.killTweensOf(item);
  });
});
</script>

<style lang="scss" scoped>
.layout-stories {
  height: auto;
  $desktop: 1280px;

  @media screen and (min-width: $desktop) {
    aspect-ratio: 3;
    grid-template-rows: 1fr 1fr;
  }

  &:deep(.a-div) {
    width: 100%;
    display: block;
    opacity: 0;

    @media screen and (min-width: $desktop) {
      transform: translateY(25%);
    }
  }

  .content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: var(--spacer-16);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-start;
    gap: var(--spacer-4);
    z-index: 10;

    p {
      max-width: 420px;
    }
  }

  .item {
    grid-column: -1 / 1;
    position: relative;
    overflow: hidden;
    border-radius: var(--spacer-16);

    @media screen and (max-width: #{$desktop - 1px}) {
      aspect-ratio: 2;
    }


    &:not(&--title) {

      &:deep(.ui-arrow) {
        position: absolute;
        top: var(--spacer-16);
        right: var(--spacer-16);
        z-index: 10;
        opacity: 0;
        transform: translate(-16px, 16px);
        transition: all 650ms var(--ease-in-out-quint);
      }


      @media screen and (min-width: $desktop) {
        &:hover {
          &:deep(.ui-arrow) {
            opacity: 1;
            transform: translate(0, 0);
          }
        }
      }


      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(to bottom, transparent -30%, var(--black-80));
      }
    }

  }

  /* Big left card spans both rows */
  .item--big-left {

    @media screen and (max-width: #{$desktop - 1px}) {
      aspect-ratio: 1;
    }

    @media screen and (min-width: $desktop) {
      grid-column: 1 / span 4;
      grid-row: 1 / span 2;
    }
  }

  /* Title block (top center) */
  .item--title {
    position: relative;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    padding: var(--spacer-16);
    border-radius: 0;

    @media screen and (max-width: #{$desktop - 1px}) {
      aspect-ratio: unset;
      height: auto;
      aspect-ratio: 2;
      order: -1;
    }


    @media screen and (min-width: $desktop) {
      grid-column: 5 / span 4;
      grid-row: 1;
    }

    &:deep(.ui-arrow) {
      position: absolute;
      top: var(--spacer-8);
      right: var(--spacer-8);
    }
  }

  /* Top right card */
  .item--top-right {

    @media screen and (min-width: $desktop) {
      grid-column: 9 / span 2;
      grid-row: 1;
    }
  }

  /* Bottom center cards */
  .item--bottom-left {
    @media screen and (min-width: $desktop) {
      grid-column: 5 / span 3;
      grid-row: 2;
    }
  }

  .item--bottom-center {
    @media screen and (min-width: $desktop) {
      grid-column: 8 / span 3;
      grid-row: 2;
    }
  }

  /* Tall right card (still spans both rows) */
  .item--bottom-right {
    @media screen and (min-width: $desktop) {
      grid-column: 11 / span 2;
      grid-row: 1 / span 2;
    }
  }

  h3 {
    display: flex;

  }
}
</style>

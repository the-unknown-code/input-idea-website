<template>
  <section class="layout-pillar">
    <div class="layout-pillar__content layout-grid">
      <div>
        <h2>
          <storyblok-richtext :content="blok.title[0].text"
            cleanup />
        </h2>
        <div class="counter">
          <div v-for="(item, i) in blok.list"
            :key="i"
            :class="['counter--item', { active: activeIndex === Number(i) }]">
          </div>
        </div>
      </div>
      <div>
        <div v-for="(item, i) in blok.list"
          :key="i"
          :class="['pillar', { active: activeIndex === Number(i) }]"
          @click="activeIndex = Number(i)">

          <h2>0<b>{{ Number(i) + 1 }}</b></h2>
          <p class="p">{{ item.title }}</p>
          <p class="p-small">
            <storyblok-richtext :content="item.description[0].text"
              cleanup />
          </p>
        </div>
      </div>
    </div>

  </section>
</template>

<script setup lang="ts">

defineProps({
  blok: {
    type: Object,
    required: true,
  }
})

const activeIndex = ref<number>(0)

</script>


<style lang="scss" scoped>
.layout-pillar {
  position: relative;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;

  &__content {
    width: 100%;
    gap: 32px;

    @include desktop {
      gap: 32px;
    }

    >div {
      width: 100%;
      grid-column: -1 / 1;

      display: flex;
      align-items: center;
      gap: 12px;

      &:nth-child(1) {
        align-items: flex-start;
        flex-direction: column;
      }

      &:nth-child(2) {
        @include mobile {
          flex-direction: column;
          align-items: flex-start;
        }
      }

      @include desktop {
        &:nth-child(1) {
          grid-column: span 5;

        }

        &:nth-child(2) {
          grid-column: span 7
        }
      }
    }

    .counter {
      position: relative;
      width: 100%;
      display: flex;
      align-items: center;
      gap: 8px;

      &--item {
        position: relative;
        width: 12px;
        height: 6px;
        border-radius: 6px;
        background-color: var(--white);

        transition: all .25s var(--ease-in-out-circ);

        &.active {
          width: 32px;
          background-color: var(--yellow);
        }
      }
    }

    .pillar {
      position: relative;
      width: 100%;
      height: auto;
      min-height: 120px;
      cursor: pointer;

      background-color: var(--lightgrey-30);
      border-radius: 12px;

      padding: 32px;
      display: flex;
      flex-direction: column;
      gap: 12px;

      transition: background-color .25s var(--ease-in-out-circ), color .25s var(--ease-in-out-circ);

      @include desktop {
        width: 20%;
        flex: 0 0 20%;
        height: 100%;
        min-height: auto;

      }

      p {
        display: none;
      }

      h2 {
        position: absolute;
        left: 32px;
        bottom: 32px;
        font-size: 44px !important;
        color: var(--white-5);
      }

      &.active {
        width: 100%;
        flex: auto;
        flex-grow: 1;

        pointer-events: none;

        background-color: var(--yellow);
        color: var(--darkgrey);

        h2 {
          left: inherit;
          right: 32px;
          color: var(--darkgrey-10);
        }

        p {
          display: block;
          padding-right: 64px;
        }
      }
    }
  }
}
</style>

<template>
  <section class="layout-claim">
    <div class="layout-claim__content layout-grid">
      <div>
        <div class="layout-claim__bg">
          <div v-for="i in 8"
            :key="i"
            class="layout-claim__bg--item">
            <div />
          </div>
        </div>
      </div>
      <div>
        <h2> <storyblok-richtext :content="blok.title[0].text"
            cleanup /></h2>
        <p class="--grey"> <storyblok-richtext :content="blok.description[0].text"
            cleanup /></p>
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

</script>

<style lang="scss" scoped>
.layout-claim {
  position: relative;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;

  &__content {

    gap: 24px;

    @include desktop {
      gap: 32px
    }

    >div {
      position: relative;
      grid-column: -1 / 1;

      &:nth-child(1) {
        @include mobile {
          height: 120px;
        }
      }

      &:nth-child(2) {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }


      @include desktop {
        &:nth-child(1) {
          grid-column: span 5;
        }

        &:nth-child(2) {
          grid-column: span 7;
        }
      }
    }
  }

  &__bg {
    @include fill(absolute);
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    &--item {
      position: relative;

      width: clamp(100%, 100% / 8, 100%);

      @for $i from 1 through 8 {
        &:nth-child(#{$i}) {
          >div {
            position: absolute;
            left: 0;
            width: calc(90% / 8 * #{$i});
            height: 100%;
            background: var(--yellow)
          }

        }
      }

    }

  }
}
</style>

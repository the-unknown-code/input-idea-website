<template>
  <section class="home-hero">
    <client-only>
      <div class="home-hero__bg">
        <div v-for="i in 8"
          :key="i"
          class="home-hero__bg--item">
          <div />
        </div>
      </div>
    </client-only>
    <div v-show="isDesktop"
      class="home-hero__inner"
      role="h1"
      aria-label="Everything start with one Input">
      <div class="row row-1">
        <div>
          <span class="h1">Everything</span>
        </div>
        <div class="media">
          <div></div>
        </div>
        <div>
          <span class="h1">starts</span>
        </div>
      </div>
      <div class="row row-2">
        <div class="media">
          <div></div>
        </div>
        <div>
          <span class="h1">with one</span>
        </div>
        <div class="media empty">
          <div></div>
        </div>
      </div>
      <div class="row row-2">
        <div>
          <span class="h1 heavy">Input</span>
        </div>
        <div class="media">
          <div></div>
        </div>
      </div>
    </div>
    <div v-show="!isDesktop"
      class="home-hero__mobile">
      <h1>Everything <b>starts</b> with one <b>Input</b></h1>
      <div class="media">
        <div></div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { isDesktop } = useBreakpoints();
</script>


<style lang="scss" scoped>
.home-hero {
  position: relative;
  width: 100%;
  height: auto;

  @include desktop {
    padding: 0 var(--spacer-64);
  }

  &__bg {
    @include fill(absolute);
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    &::after {
      content: '';
      @include fill(absolute);
      background: linear-gradient(135deg, var(--darkgrey) 30%, transparent 160%);
    }

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
            background: linear-gradient(180deg, var(--darkgrey) 0%, var(--theme-contrast) 100%);
          }

        }
      }

    }

  }

  &__mobile {
    position: relative;
    text-wrap: balance;
    padding-bottom: var(--spacer-32);

    h1 {
      line-height: 1.25cap;
      text-align: center;
    }
  }

  &__inner {
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: var(--spacer-64) 0;
    gap: var(--spacer-32);

    .row {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      white-space: nowrap;

      &.row-1 {
        >div {
          &:nth-child(1) {
            padding-right: var(--spacer-32);
          }

          &:nth-child(3) {
            padding-left: var(--spacer-32);
          }
        }
      }

      &.row-2 {
        >div {
          &:nth-child(1) {
            padding-right: var(--spacer-32);
          }
        }
      }

      span {
        display: block;
      }
    }

  }

  .media {
    position: relative;
    display: flex;
    align-self: stretch;
    align-items: center;
    width: 100%;
    height: auto;

    @include mobile {
      margin-inline: auto;
      max-width: 360px;
      aspect-ratio: 4;
      margin-top: var(--spacer-16);
    }

    &:not(.empty) {
      >div {
        @include fill(relative);
        width: 100%;
        height: 100%;
        background-color: var(--theme-contrast);
        border-radius: var(--spacer-16);
      }
    }

  }

}
</style>

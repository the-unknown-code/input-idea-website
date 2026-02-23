<script setup lang="ts"></script>

<template>
  <section class="home-hero">
    <div class="home-hero__bg">
      <div v-for="i in 8"
        :key="i"
        class="home-hero__bg--item"></div>
    </div>
    <div class="home-hero__inner"
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
  </section>
</template>

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
    flex-direction: row-reverse;
    justify-content: space-between;

    &::after {
      content: '';
      @include fill(absolute);
      background: linear-gradient(135deg, var(--darkgrey) 20%, transparent 160%);
    }

    &--item {
      position: relative;
      background: linear-gradient(180deg, var(--darkgrey) 20%, var(--theme-contrast) 100%);

      @for $i from 1 through 8 {
        &:nth-child(#{$i}) {
          width: calc(1.5% * #{$i - 1});
        }
      }
    }

  }

  &__inner {
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;
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

    .media {
      position: relative;
      display: flex;
      align-self: stretch;
      align-items: center;
      width: 100%;
      height: auto;

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

}
</style>

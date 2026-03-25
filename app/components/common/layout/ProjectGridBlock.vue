<template>
  <section class="layout-project-grid-block">
    <div class="layout-project-grid-block__inner layout-grid">
      <div class="content">
        <div>
          <p class="p-big --yellow">Magni Telescopic Handlers</p>
        </div>
        <div></div>
        <div>
          <nuxt-img src="/images/magni.png" />
        </div>
      </div>
      <div class="content">
        <common-media src="https://picsum.photos/800/800?random=4"
          cover />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.layout-project-grid-block {
  position: relative;
  width: 100%;

  &__inner {
    grid-template-columns: repeat(1, 1fr);

    @include desktop {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .content {
    &:nth-child(1) {
      display: grid;
      width: 100%;
      max-width: var(--layout-width);
      grid-template-columns: repeat(6, 1fr);
      grid-gap: var(--layout-columns-gap);

      >div {
        position: relative;
        background-color: var(--lightgrey);
        padding: var(--spacer-16);
        border-radius: var(--spacer-16);

        p {
          padding-top: var(--spacer-64);
        }

        &:nth-child(1) {
          grid-column: 1 / span 4;
        }

        &:nth-child(2) {
          grid-column: 5 / span 2;
          background-color: var(--yellow);
        }

        &:nth-child(3) {
          grid-column: 1 / span 6;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 10% 5%;

          img {
            width: 100%;
            height: 100%;
            max-width: 320px;
            max-height: 80px;
            object-fit: contain;
          }
        }
      }

    }

    &:nth-child(2) {
      border-radius: var(--spacer-16);
      overflow: hidden;

      @include mobile {
        position: relative;
        width: 100%;
        aspect-ratio: 3 / 2;
      }
    }
  }
}
</style>

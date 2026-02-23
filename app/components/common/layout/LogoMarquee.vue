<template>
  <section class="layout-logo-marquee">
    <common-marquee>
      <span v-for="logo in LOGOS"
        :key="logo.name">
        <img :src="logo.src"
          :alt="logo.name" />
      </span>
    </common-marquee>
  </section>
</template>

<script setup lang="ts">
const LOGOS = [
  {
    name: 'Cellular Line',
    src: '/svgs/cellular-line.svg',
  },
  {
    name: 'DAlessandro',
    src: '/svgs/dalessandro.svg',
  },
  {
    name: 'Delivery Plus',
    src: '/svgs/delivery-plus.svg',
  },
  {
    name: 'La contabile',
    src: '/svgs/la-contabile.svg',
  },
  {
    name: 'Magni',
    src: '/svgs/magni.svg',
  },
  {
    name: 'Mazak',
    src: '/svgs/mazak.svg',
  },
]
</script>

<style lang="scss" scoped>
.layout-logo-marquee {
  position: relative;
  width: 100%;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to right,
        var(--darkgrey) 16px,
        transparent 20%,
        transparent 80%,
        var(--darkgrey) calc(100% - 16px));
  }


  &:deep(.marquee) {
    width: 100%;

    .inner {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  span {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: auto;
    height: 72px;
    aspect-ratio: 16 / 9;
    margin: 0 var(--spacer-16);
    padding: 0 var(--spacer-16);
  }

  img {
    position: relative;
    object-fit: contain;
    object-position: center;
  }
}
</style>

<template>
  <section class="layout-media-marquee">
    <common-marquee>
      <span v-for="logo in LOGOS"
        :key="logo.name">
        <common-media :src="logo.src"
          cover />
      </span>
    </common-marquee>
  </section>
</template>

<script setup lang="ts">
const LOGOS = [
  {
    name: 'Cellular Line',
    src: 'https://picsum.photos/320/200?random=1',
  },
  {
    name: 'DAlessandro',
    src: 'https://picsum.photos/320/200?random=2',
  },
  {
    name: 'Delivery Plus',
    src: 'https://picsum.photos/320/200?random=3',
  },
  {
    name: 'La contabile',
    src: 'https://picsum.photos/320/200?random=4',
  },
  {
    name: 'Magni',
    src: 'https://picsum.photos/320/200?random=5',
  },
  {
    name: 'Mazak',
    src: 'https://picsum.photos/320/200?random=6',
  },
]
</script>

<style lang="scss" scoped>
.layout-media-marquee {
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
    aspect-ratio: 16 / 6;
    margin: 0 8px;
    border-radius: var(--spacer-16);
    overflow: hidden;
  }


}
</style>

<script setup lang="ts">


defineProps({
  reverse: {
    type: Boolean,
    default: false
  },
  callback: {
    type: Function,
    default: () => { },
  },
});
</script>

<template>
  <div class="ui-arrow-button"
    @click.prevent="() => callback()">
    <div :class="{ reverse }">
      <span />
      <span />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ui-arrow-button {
  position: relative;
  width: 30px;
  height: 30px;
  border: 0.5px solid white;
  border-radius: 5px;

  transition: all .45s var(--ease-out-expo);

  @include hover {
    &:hover {
      border-color: black !important;
      background-color: var(--yellow);

      span {
        background-color: black !important;
      }
    }
  }

  >div {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    transform: translate(2px) scaleX(1);

    &.reverse {
      transform: translate(-2px) scaleX(-1);
    }
  }

  span {
    position: relative;
    width: 1px;
    height: 6px;
    background-color: white;

    &:nth-child(1) {
      transform-origin: bottom;
      transform: rotate(-45deg);
    }

    &:nth-child(2) {
      transform-origin: top;
      transform: rotate(45deg);
    }
  }
}
</style>

<template>
  <section class="layout-three-columns">
    <div class="layout-three-columns__inner layout-grid">
      <div v-for="item in blok.list"
        :key="item._uid">
        <div class="display --yellow">{{ item.title }}</div>
        <p class="p-tiny --grey">{{ item.description }}</p>
      </div>
    </div>
  </section>
</template>


<script setup lang="ts">
import { DATA_THREE_COLUMNS } from '~/libs/data';

defineProps({
  blok: {
    type: Object,
    required: false,
    default: DATA_THREE_COLUMNS

  }
})
</script>

<style lang="scss" scoped>
.layout-three-columns {
  position: relative;
  width: 100%;

  &__inner {
    grid-template-columns: repeat(1, 1fr);

    @include desktop {
      grid-template-columns: repeat(3, 1fr);
    }

    >div {
      position: relative;
      background-color: var(--grey-10);
      padding: var(--spacer-16);
      border-radius: var(--spacer-16);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: var(--spacer-32);

      @include desktop {
        padding: var(--spacer-32);
      }


    }
  }
}
</style>

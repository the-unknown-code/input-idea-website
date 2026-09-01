<template>
  <section class="layout-accordion-list">

    <div class="title">
      <div class="h2">
        <storyblok-richtext :content="blok.title[0].text"
          cleanup />
      </div>
      <p class="--yellow">{{ blok.description }}</p>
    </div>

    <div v-for="(item, index) in blok.list"
      :key="item._uid"
      :class="['item', { 'active': activeItem === index }]"
      @click.prevent="activeItem = activeItem === index ? -1 : Number(index)">
      <div class="display">
        <storyblok-richtext :content="item.title[0].text"
          cleanup />
      </div>
      <div class="p --grey">
        <storyblok-richtext :content="item.description[0].text"
          cleanup />
      </div>
      <ui-arrow />
    </div>

  </section>
</template>


<script setup lang="ts">
import { DATA_LINK_LIST } from '~/libs/data';


defineProps({
  blok: {
    type: Object,
    required: false,
    default: DATA_LINK_LIST
  }
})

const activeItem = ref<number>(-1);
</script>

<style lang="scss" scoped>
.layout-accordion-list {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 960px;
  margin: 0 auto;
  gap: var(--spacer-8);

  .title {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 8px;
    margin-bottom: 32px;
  }

  .item {
    position: relative;
    width: 100%;
    max-width: 960px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--spacer-16);
    border-radius: var(--spacer-16);
    border: 1px solid var(--grey-50);
    transition: all 250ms var(--ease-in-out-quint);
    padding: 16px;
    cursor: pointer;

    @include hover {
      &:hover {
        //color: var(--yellow);
        background-color: var(--grey-20);
      }
    }

    &.active {
      .p {
        display: block;
      }
    }

    .display {
      padding-right: 24px;
    }

    .p {
      padding-bottom: 32px;
      display: none;
    }

    &:deep(.ui-arrow) {
      position: absolute;
      right: 16px;
      bottom: 16px;
      transform: rotate(135deg);
    }
  }
}
</style>

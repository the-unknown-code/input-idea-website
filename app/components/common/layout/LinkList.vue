<template>
  <section class="layout-link-list">

    <div class="title">
      <div class="h2">
        <storyblok-richtext :content="blok.title[0].text"
          cleanup />
      </div>
      <p class="--yellow">{{ blok.description }}</p>
    </div>

    <a-link v-for="item in blok.list"
      :key="item._uid"
      :href="resolveLink(item.link)"
      class="item">
      <div class="display">
        <storyblok-richtext :content="item.title[0].text"
          cleanup />
      </div>
      <ui-arrow />
    </a-link>

  </section>
</template>


<script setup lang="ts">
import { DATA_LINK_LIST } from '~/libs/data';
import { resolveLink } from '~/libs/storyblok/utils';


defineProps({
  blok: {
    type: Object,
    required: false,
    default: DATA_LINK_LIST
  }
})
</script>

<style lang="scss" scoped>
.layout-link-list {
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
    justify-content: space-between;
    align-items: flex-end;
    gap: var(--spacer-16);
    border-radius: var(--spacer-16);
    border: 1px solid var(--grey-50);
    transition: all 250ms var(--ease-in-out-quint);
    padding: 16px;

    @include hover {
      &:hover {
        color: var(--yellow);
        background-color: var(--grey-20);
      }
    }
  }
}
</style>

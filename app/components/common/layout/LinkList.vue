<template>
  <section class="layout-link-list">
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
  gap: var(--spacer-8);

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
        background-color: var(--grey-20);
      }
    }
  }
}
</style>

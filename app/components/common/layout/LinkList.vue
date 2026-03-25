<template>
  <section class="layout-link-list">
    <a-link :href="resolveLink('https://www.google.com')"
      class="item">
      <div class="display">
        <b>Brand identity design</b> & positioning
      </div>
      <ui-arrow />
    </a-link>
    <a-link :href="resolveLink('https://www.google.com')"
      class="item">
      <div class="display">
        <b>Social Media</b> Management
      </div>
      <ui-arrow />
    </a-link>
    <a-link :href="resolveLink('https://www.google.com')"
      class="item">
      <div class="display">
        Brand <b>Awareness</b>
      </div>
      <ui-arrow />
    </a-link>
  </section>
</template>


<script setup lang="ts">
import { resolveLink } from '~/libs/storyblok/utils';
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

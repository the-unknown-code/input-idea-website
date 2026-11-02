<!--
  DiscoverProjects <layout-discover-projects />
  Full-width marquee repeating "SCOPRI TUTTI I PROGETTI ↗", linking to the portfolio.
  Storyblok component: "DiscoverProjects" — optional fields: text, highlight, link.
-->
<template>
  <section class="layout-discover-projects">
    <a-link :href="href"
      :aria-label="`${text} ${highlight}`">
      <common-marquee>
        <span v-for="i in 4"
          :key="i"
          class="item"
          aria-hidden="true">
          <span class="text">{{ text }}</span>
          <b class="highlight">{{ highlight }}</b>
          <ui-arrow />
        </span>
      </common-marquee>
    </a-link>
  </section>
</template>

<script setup lang="ts">
import { resolveLink } from '~/libs/storyblok/utils';

const props = defineProps({
  blok: {
    type: Object,
    required: false,
    default: () => ({}),
  },
});

const text = computed(() => props.blok?.text || 'Scopri tutti i');
const highlight = computed(() => props.blok?.highlight || 'progetti');
const href = computed(() => resolveLink(props.blok?.link) || '/portfolio');
</script>

<style lang="scss" scoped>
.layout-discover-projects {
  position: relative;
  // full-bleed: edge to edge even inside padded page containers
  width: 100vw;
  margin-left: calc(50% - 50vw);
  overflow: hidden;
  background-color: var(--darkgrey);

  &:deep(.a-div) {
    display: block;
    padding: var(--spacer-16) 0;
    color: inherit;
    text-decoration: none;
  }

  .item {
    display: inline-flex;
    align-items: center;
    gap: 0.25em;
    padding-right: 0.6em;

    font-family: 'Pathway Extreme', sans-serif;
    font-optical-sizing: auto;
    text-transform: uppercase;
    font-size: 64px;
    line-height: 1;
    color: var(--white);

    @include desktop {
      font-size: 120px;
    }
  }

  .text {
    font-weight: 100;
    font-variation-settings: 'wdth' 75;
    letter-spacing: 1%;
  }

  .highlight {
    font-weight: 900;
    font-variation-settings: 'wdth' 100;
    letter-spacing: 2%;
  }

  &:deep(.ui-arrow) {
    width: 0.55em;
    margin-left: 0.25em;
    transition: transform 320ms var(--ease-out-circ);

    svg {
      height: auto;
    }
  }

  @include hover {
    &:hover:deep(.ui-arrow) {
      transform: translate(4px, -4px);
    }
  }
}
</style>

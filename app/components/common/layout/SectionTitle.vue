<template>
  <template v-if="blok.claim">
    <layout-claim-hero :blok="blok" />
  </template>
  <template v-else>
    <layout-text-hero :blok="blok" />
  </template>
</template>

<script setup lang="ts">
import { SECTION_TITLE } from '~/libs/data';

defineProps({
  blok: {
    type: Object,
    required: false,
    default: SECTION_TITLE
  }
})
</script>

<style scoped></style>

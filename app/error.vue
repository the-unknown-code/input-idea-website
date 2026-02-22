<template>
  <main class="error-index">
    <h1>{{ error.statusCode }}</h1>
    <p class="mono-large">{{ error.message ?? error.statusMessage ?? 'Unknown error' }}</p>
    <NuxtLink to="/">Go back home</NuxtLink>
  </main>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{ error: NuxtError }>()
</script>

<style lang="scss" scoped>
.error-index {
	padding: var(--spacer-64) 0;
}
</style>
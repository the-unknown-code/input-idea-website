<script setup lang="ts">
const { callback } = defineProps({
  label: {
    type: String,
    default: null
  },
  href: {
    type: String,
    default: null
  },
  callback: {
    type: Function,
    default: null
  }
})

const handleClick = () => callback?.()
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') callback?.()
}
</script>

<template>
  <component :is="callback ? 'div' : 'a-link'"
    :href="callback ? undefined : href"
    :role="callback ? 'button' : undefined"
    :tabindex="callback ? 0 : undefined"
    class="ui-common-cta"
    @click="handleClick"
    @keydown="handleKeydown">
    <p class="--yellow">{{ label }}</p>
    <ui-arrow small />
  </component>
</template>

<style lang="scss" scoped>
.ui-common-cta {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;

  &:deep(.ui-arrow) {
    transition: transform 320ms var(--ease-out-circ);
  }

  @include hover {
    &:hover {
      text-decoration: underline;
      text-decoration-color: var(--yellow);
      text-underline-offset: 4px;

      &:deep(.ui-arrow) {
        transform: translate(2px, -2px);
      }
    }
  }
}
</style>

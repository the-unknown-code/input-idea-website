<script setup lang="ts">

const { callback, light } = defineProps({
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
  },
  small: {
    type: Boolean,
    default: false
  },
  light: {
    type: Boolean,
    default: false
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
    :class="['ui-common-cta', { light }]"
    @click="handleClick"
    @keydown="handleKeydown">
    <p :class="['--yellow', { small, light }]">{{ label }}</p>
    <ui-arrow small
      :color="light ? 'rgba(255, 255, 255, 0.8)' : undefined" />
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

  p {
    &.light {
      color: rgb(255 255 255 / 80%);
    }

    &.small {
      font-size: 14px;

      &.light {
        font-size: 12px;
      }
    }
  }

  &.light {
    @include hover {
      &:hover {
        text-decoration-color: rgb(255 255 255 / 80%);
      }
    }
  }
}
</style>

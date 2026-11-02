<template>
  <div class="ui-form-input">
    <input v-if="type !== 'textarea'"
      class="p-small"
      :type="type"
      :placeholder="placeholder" />
    <textarea v-else
      class="p-small"
      :placeholder="placeholder" />


  </div>
</template>

<script setup lang="ts">
defineProps({
  placeholder: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: false,
    default: 'text'
  }
})
</script>

<style lang="scss" scoped>
.ui-form-input {
  position: relative;
  width: 100%;
  color: var(--grey-600);
  border-bottom: 1px solid var(--grey-600);
  padding: 8px 0;

  input,
  textarea {
    width: 100%;
  }

  textarea {
    resize: none;
    height: 90px;
  }
}
</style>

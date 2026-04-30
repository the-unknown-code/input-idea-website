<template>
  <main class="page-training">
    <div class="layout-block">

    </div>
  </main>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
.page-training {
  position: relative;
  padding-top: var(--header-height);

  >div {
    display: flex;
    flex-direction: column;
    gap: var(--spacer-64);

    @include desktop {
      gap: var(--spacer-128);
    }
  }

  section {
    &:last-child {
      margin-bottom: var(--spacer-64);

      @include desktop {
        margin-bottom: var(--spacer-128);
      }
    }
  }


}
</style>

<template>
  <main class="page-why">
    <div class="layout-block">
      <layout-claim-hero />
      <layout-focus-text />
      <layout-focus-item />
      <layout-services />
      <layout-media-marquee />
      <layout-form />
    </div>
  </main>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
.page-why {
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

<template>
  <main class="page-portfolio">
    <div class="layout-block">
      <layout-claim-hero
        highlight="Ogni cliente rappresenta un input unico, una sfida che richiede progettualità su misura." />
      <layout-case-history />
      <layout-form />
    </div>
  </main>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
.page-portfolio {
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

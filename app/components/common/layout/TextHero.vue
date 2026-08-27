<script setup lang="ts"></script>

<template>

  <section class="layout-text-hero">
    <div class="media">
      <common-media src="https://picsum.photos/420/420?random=3"
        cover />
    </div>
    <h1 class="display header"><b>Marketing</b> Consulting</h1>
    <h2 class="p --yellow">Analisi, consulenza e strategia di digital marketing</h2>
  </section>

</template>

<style lang="scss" scoped>
.layout-text-hero {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacer-16);
  max-width: 960px;
  margin: 0 auto;
  text-align: center;

  .media {
    position: relative;
    width: 320px;
    aspect-ratio: 288 / 77;
    border-radius: var(--spacer-16);
    overflow: hidden;
  }

  h2 {
    margin-top: -8px;
  }
}
</style>

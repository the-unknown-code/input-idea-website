<script setup lang="ts"></script>

<template>
  <section class="layout-large-text">
    <div v-text-reveal
      class="display">
      <b>Analisi di mercato</b> e del contesto d’interesse Analisi target e individuazione delle <b>buyer personas</b>
      Analisi della
      <b>concorrenza</b> e delle strategie adottate <b>Analisi qualitativa</b> del sito Analisi dei <b>canali social</b>
      attivati Misurazione
      delle performance delle <b>campagne adv</b> passate <b>Valutazione</b> dei <b>budget</b> Identificazione dei
      <b>canali</b> di <b>comunicazione</b> da
      attivare
    </div>
  </section>
</template>

<style lang="scss" scoped>
.layout-large-text {
  position: relative;
  width: 100%;
  text-align: center;

  >div {
    color: var(--grey-20);

    @include mobile {
      font-size: 48px;
    }
  }
}
</style>

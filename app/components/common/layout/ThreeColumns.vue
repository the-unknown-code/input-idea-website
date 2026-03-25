<script setup lang="ts"></script>

<template>
  <section class="layout-three-columns">
    <div class="layout-three-columns__inner layout-grid">
      <div>
        <div class="display --yellow">L'arena </div>
        <p class="p-tiny --grey">In un ambiente altamente competitivo e in continua evoluzione come quello del marketing
          digitale, avere una
          visione chiara del proprio brand non è più un semplice valore aggiunto, ma il requisito fondamentale per
          costruire una presenza digitale di successo anche sul lungo termine.</p>
      </div>
      <div>
        <div class="display --yellow">Voce o Rumore?</div>
        <p class="p-tiny --grey">Spesso infatti le aziende si concentrano esclusivamente sull’azione immediata, ma
          l’azione senza visione è
          solo rumore nella rete. Per noi l’output di una strategia corretta è proprio questo: una voce autorevole che
          emerge dal coro, trasformando la confusione digitale in un messaggio nitido, potente e impossibile da
          ignorare.</p>
      </div>
      <div>
        <div class="display --yellow">Serve una Strategia</div>
        <p class="p-tiny --grey">Una prospettiva ben definita agisce come un filtro intelligente: è la condizione che
          orienta nella scelta
          delle decisioni migliori da adottare per il proprio business e incoraggia a superare le sfide quotidiane,
          trasformandole in opportunità di crescita concrete.</p>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.layout-three-columns {
  position: relative;
  width: 100%;

  &__inner {
    grid-template-columns: repeat(1, 1fr);

    @include desktop {
      grid-template-columns: repeat(3, 1fr);
    }

    >div {
      position: relative;
      background-color: var(--grey-10);
      padding: var(--spacer-16);
      border-radius: var(--spacer-16);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: var(--spacer-32);

      @include desktop {
        padding: var(--spacer-32);
      }


    }
  }
}
</style>

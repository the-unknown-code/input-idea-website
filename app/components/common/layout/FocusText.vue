<template>
  <section class="layout-focus-text">
    <div class="layout-grid">
      <div />
      <div>
        <div class="media">
          <common-media src="https://picsum.photos/800/800?random=4"
            cover />
        </div>
      </div>
      <div>
        <h1 class="display">L'<b>output</b> più efficace</h1>
        <p class="--grey-600"><b>Ogni cliente</b> è un input unico: un set di valori, obiettivi e sfide che richiede una
          risposta specifica. Non replichiamo modelli pronti, ma progettiamo un output su misura per trasformare il tuo
          potenziale in un risultato concreto.</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts"></script>


<style lang="scss" scoped>
.layout-focus-text {
  position: relative;

  .layout-grid {
    width: 100%;

    >div {
      position: relative;
      width: 100%;
      border-radius: 8px;
      overflow: hidden;
      grid-column: -1 / 1;

      &:nth-child(1) {
        background-color: var(--yellow);

        @include mobile {
          aspect-ratio: 10;
        }

        @include desktop {
          grid-column: span 1;
        }
      }

      &:nth-child(2) {

        @include mobile {
          aspect-ratio: 3;
        }


        @include desktop {
          grid-column: span 4;
        }
      }

      &:nth-child(3) {
        padding: 16px;
        background-color: var(--lightgrey);

        @include desktop {
          padding: 32px;
          grid-column: span 7;
        }
      }

    }

    .media {
      @include fill(absolute);
    }
  }

  p {
    margin-top: 16px;

    b {
      color: var(--grey);
    }
  }

}
</style>

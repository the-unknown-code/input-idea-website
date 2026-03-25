<script setup lang="ts"></script>

<template>
  <section class="layout-project-hero">
    <div class="media">
      <common-media src="https://picsum.photos/800/800?random=3"
        cover />
      <div class="content">
        <h1 class="p-tiny">TELESCOPIC HANDLERS</h1>
        <h2 class="p-big">L’azienda che ha sollevato la sua immagine di brand in tutto il mondo</h2>
      </div>
    </div>
    <div class="description">
      <p class="--grey">Magni Telescopic Handlers è una delle più importanti aziende produttrici nel mercato del
        sollevamento, con
        un’offerta di macchinari incentrata principalmente su performance e qualità. Fondata nel 2013, ha la sua sede
        principale a Castelfranco Emilia, nel cuore della Motor Valley, ed è presente in tutto il mondo con 8 filiali.
        <b>In Magni innovazione, design e sicurezza contraddistinguono</b> l’ampia gamma di macchine, con sollevatori
        telescopici fissi e rotativi, piattaforme aeree e una vasta scelta di accessori.
      </p>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.layout-project-hero {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--spacer-32);

  .media {
    position: relative;
    width: 100%;
    aspect-ratio: 3 / 2;
    border-radius: var(--spacer-16);
    overflow: hidden;

    @include desktop {
      aspect-ratio: 1250 / 480;
    }

    .content {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      padding: var(--spacer-16);
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: flex-start;
      gap: var(--spacer-8);
      z-index: 10;
      max-width: 860px;

      @include desktop {
        padding: var(--spacer-32);
      }

      h1 {
        position: relative;
        padding: var(--spacer-4) var(--spacer-8);
        background: var(--yellow);
        border-radius: var(--spacer-4);
        color: var(--darkgrey);
      }
    }

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(to bottom, transparent 0%, var(--black-50) 100%);
    }
  }

  .description {
    max-width: 1280px;
  }
}
</style>

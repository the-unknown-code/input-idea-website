<template>
  <section class="layout-text-list">
    <div class="layout-text-list__inner layout-grid">
      <div>
        <div v-text-reveal
          class="display">
          <b>STARTING</b> POINT
        </div>
        <div v-text-reveal
          class="p --grey">
          Magni TH si è affidato a Inputidea con l’obiettivo di sviluppare una brand identity forte e coerente, con
          contenuti corporate diversificati per le pagine social (LinkedIn, Facebook e Instagram) della sede principale
          e delle sue filiali internazionali. Oltre alla comunicazione multi-piattaforma, negli obiettivi di Magni
          rientrava uno “svecchiamento” dello stile comunicativo, soprattutto nel modo di rappresentare azienda e
          prodotti.
        </div>
      </div>
      <div ref="$content">
        <div class="item">
          <div class="display --yellow">0<b>1</b></div>
          <p class="p-tiny --grey">Difficoltà nel garantire una presenza coerente e globale del brand Magni</p>
        </div>
        <div class="item">
          <div class="display --yellow">0<b>2</b></div>
          <p class="p-tiny --grey">Nunc leo est, blandit eu consectetur sit amet, maximus ut urna. Mauris nec turpis non
            diam tristique aliquam non id nisl. Morbi at dui ullamcorper, sagittis risus at, feugiat nibh.</p>
        </div>
        <div class="item">
          <div class="display --yellow">0<b>3</b></div>
          <p class="p-tiny --grey">Praesent est ipsum, dapibus ac lorem vel, bibendum rutrum neque. Duis sagittis tellus
            sagittis ultrices vehicula. Cras purus quam, sollicitudin ut tempor vitae, tincidunt a augue. Quisque non
            elit vitae nisi lacinia venenatis. Praesent finibus mauris eros, nec tempor nisi blandit vitae. </p>
        </div>
      </div>
    </div>
  </section>
</template>


<script setup lang="ts">
import gsap from 'gsap/all';


const $content = ref<HTMLElement | null>(null);


const initialize = () => {
  if ($content.value) {
    const $items = $content.value.querySelectorAll('.item');

    $items.forEach((item) => {
      gsap.to(item, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: item,
          start: 'top 90%',
        },
      });
    });

  }
}

tryOnMounted(() => {
  initialize()
});
</script>

<style lang="scss" scoped>
.layout-text-list {
  position: relative;
  width: 100%;

  &__inner {
    grid-template-columns: repeat(1, 1fr);

    @include desktop {
      grid-template-columns: repeat(2, 1fr);
    }

    >div {
      display: flex;
      flex-direction: column;
      gap: var(--spacer-16);

      &:nth-child(2) {
        gap: var(--spacer-32);

        @include mobile {
          margin-top: var(--spacer-32);
        }

        @include desktop {
          align-items: flex-end;
          padding-left: var(--spacer-64);
        }
      }


    }
  }

  .item {
    position: relative;
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacer-16);
    max-width: 480px;
    opacity: 0;
    transform: translateY(80px);

    &:not(:last-child) {
      padding-bottom: var(--spacer-32);
      border-bottom: 1px solid var(--grey-20);
    }

    p {
      text-align: left;
    }
  }
}
</style>

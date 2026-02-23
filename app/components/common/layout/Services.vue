<template>
  <section class="layout-services">
    <div class="layout-services__inner layout-grid">
      <div>
        <h3 v-text-reveal
          class="h1">I nostri <b>Servizi</b></h3>
        <p v-text-reveal
          class="--grey"><b>Ogni azienda arriva da noi con un bagaglio unico: un’esigenza, un dato, un sogno nel
            cassetto
            o una sfida
            critica. </b>Per noi, questo è l’input. Siamo l’agenzia di comunicazione di Reggio Emilia che lavora come un
          sistema intelligente che ascolta, analizza e rielabora. In base a ciò che ci affidi, attiviamo le competenze
          necessarie per restituirti l’output più efficace: quel risultato concreto — che sia un’identità visiva, una
          strategia social o una campagna pubblicitaria — capace di parlare la lingua del tuo pubblico e generare
          valore.</p>
      </div>
      <div>
        <ul>
          <li v-for="service in SERVICES"
            ref="$items"
            :key="service.title">
            <a-link :href="service.link">
              <p class="p-big"> {{ service.title }}</p>
              <ui-arrow />
            </a-link>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import gsap from 'gsap/all';
import { GSAPEase } from '~/libs/constants/gsap';

const SERVICES = [
  {
    title: 'Copywriting & SEO',
    link: 'https://www.google.com'
  },
  {
    title: 'Brand Identity',
    link: 'https://www.google.com'
  },
  {
    title: 'Marketing Automation',
    link: 'https://www.google.com'
  },
  {
    title: 'Customer Software',
    link: 'https://www.google.com'
  },
  {
    title: 'Website & E-commerce',
    link: 'https://www.google.com'
  },

]

const $items = ref<HTMLLIElement[]>([]);


const initialize = () => {
  $items.value.forEach((item) => {
    gsap.to(item, {
      opacity: 1,
      y: 0,
      ease: GSAPEase.SLOW_IN_OUT,
      scrollTrigger: {
        trigger: item,
        start: 'top 95%',
        end: 'bottom 85%',
        scrub: 3,
      }
    });
  });
}

tryOnMounted(() => {
  initialize();
});

tryOnBeforeUnmount(() => {
  $items.value.forEach((item) => {
    gsap.killTweensOf(item);
  });
});
</script>


<style lang="scss" scoped>
.layout-services {
  &__inner {
    >div {
      grid-column: -1 / 1;

      &:nth-child(1) {
        p {
          margin-top: var(--spacer-16);
        }
      }

      @include desktop {
        &:nth-child(1) {
          grid-column: 2 / span 4;
        }

        &:nth-child(2) {
          grid-column: 7 / span 5;
        }
      }
    }
  }

  ul {
    display: flex;
    flex-direction: column;

    li {
      position: relative;
      width: 100%;
      padding: var(--spacer-8) 0;
      border-bottom: 1px solid var(--grey-20);
      opacity: 0;

      @include desktop {
        transform: translateY(80px);
      }

      &:deep(.a-div) {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: var(--spacer-16);
      }
    }
  }

}
</style>

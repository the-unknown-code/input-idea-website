<template>
  <section class="layout-focus-item">
    <h1 class="display">L'<b>Algoritmo</b> inputidea</h1>
    <div class="list">
      <div v-for="(item, index) in DATA"
        ref="$items"
        :key="index"
        class="layout-grid">
        <div>
          <h2 class="display --yellow"
            v-html="item.title" />
        </div>
        <div>
          <p v-html="item.description" />
        </div>
        <div v-show="isDesktop">
          <div class="display number --grey-600">0<b>{{ index + 1 }}</b></div>
        </div>
      </div>


    </div>
  </section>
</template>

<script setup lang="ts">
import { ScrollTrigger } from 'gsap/all'

const DATA = [
  {
    title: 'Sight',
    description: 'Partiamo da te, e da chi altro se no? Analizziamo ogni dettaglio per conoscere il mercato e i tuoi prodotti.'
  },
  {
    title: 'in <b>Depth</b>',
    description: 'Partiamo da te, e da chi altro se no? Analizziamo ogni dettaglio per conoscere il mercato e i tuoi prodotti.'
  },
  {
    title: 'Action',
    description: 'Partiamo da te, e da chi altro se no? Analizziamo ogni dettaglio per conoscere il mercato e i tuoi prodotti.'
  }
]

const { isDesktop } = useBreakpoints()
const $items = ref<HTMLElement[]>([])

const initialize = () => {
  ScrollTrigger.create({
    trigger: '.list',
    start: 'top 80%',
    end: 'bottom 20%',
    onUpdate: (self) => {
      const index = Math.floor(self.progress * $items.value.length)
      const clamped = Math.min(index, $items.value.length - 1)
      setActive($items.value[clamped] as HTMLElement)
    }
  })
}


const setActive = (item: HTMLElement) => {
  $items.value.forEach(el => el.classList.remove('is-active'))
  item.classList.add('is-active')
}

tryOnMounted(async () => {
  await nextTick()
  initialize()
})
</script>


<style lang="scss" scoped>
.layout-focus-item {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .list {
    width: 100%;
    max-width: 960px;
    display: flex;
    flex-direction: column;
    margin-top: 32px;
    gap: 32px;

    @include desktop {
      margin-top: 96px;
    }

    .layout-grid {
      position: relative;
      align-items: center;

      &::before {
        content: '';
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: calc(100% + 24px);
        height: calc(100% + 36px);
        border-radius: 32px;
        z-index: -1;
        transition: background-color 300ms var(--ease-out-circ);
        filter: drop-shadow(0px 0px 0px #00000055);

        @include desktop {
          width: calc(100% + 96px);
          height: calc(100% + 48px);
        }

      }

      .display {
        transition: all 300ms var(--ease-out-circ);
      }

      &.is-active {
        &::before {
          background-color: var(--yellow);
          filter: drop-shadow(0px 0px 20px #00000055);
        }

        .display:not(.number) {
          color: var(--darkgrey);
        }

        p {
          color: var(--darkgrey);
        }

        .display.number {
          opacity: .15;
        }
      }

      >div {
        grid-column: -1 / 1;
        text-wrap: balance;

        &:nth-child(1) {
          @include desktop {
            padding-right: 24px;
            text-align: right;
            grid-column: span 4;
          }
        }

        &:nth-child(2) {
          @include desktop {
            grid-column: span 6;
          }
        }

        &:nth-child(3) {
          @include desktop {
            grid-column: span 2;
            text-align: right;
          }
        }
      }
    }
  }
}
</style>

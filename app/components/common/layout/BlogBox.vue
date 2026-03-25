<template>
  <section class="layout-blog-box">
    <div class="layout-blog-box__inner layout-grid">
      <div class="content">
        <div class="title display">
          <b>Black box:</b><br />
          Input blog
        </div>
        <div class="p --grey">
          Il blog di Input Idea è un <b>laboratorio di pensiero aperto</b>. Abbiamo creato Black Box per dare forma ai
          nostri
          processi di analisi: qui raccogliamo gli input più interessanti della comunicazione contemporanea e li
          processiamo attraverso l’esperienza della nostra agenzia di comunicazione a Reggio Emilia. Il risultato è un
          flusso costante di contenuti pensati per chi non si accontenta della superficie, ma cerca l’essenza della
          strategia.
        </div>
        <a-link href="#">
          <div class="p cta">
            <span>Scopri tutti gli articoli</span>
            <ui-arrow />
          </div>
        </a-link>
      </div>
      <div>
        <ui-blog-card-item />
      </div>
      <div>
        <ui-blog-card-item />
      </div>
    </div>
  </section>
</template>


<script setup lang="ts"></script>

<style lang="scss" scoped>
.layout-blog-box {
  position: relative;
  background-color: var(--lightgrey);
  padding: var(--spacer-32);
  border-radius: var(--spacer-16);

  &__inner {
    position: relative;
    grid-template-columns: repeat(1, 1fr);

    @include desktop {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: var(--spacer-16);

    @include desktop {
      padding-right: var(--spacer-32);
    }

    .cta {
      position: relative;
      display: flex;
      align-items: center;
      gap: var(--spacer-8);
      margin-top: var(--spacer-32);

      &:deep(.ui-arrow) {
        transition: all 250ms var(--ease-in-out-quint);
      }

      @include hover {
        &:hover {
          span {
            color: var(--yellow);
          }

          &:deep(.ui-arrow) {
            transform: translate(2px, -2px)
          }
        }
      }
    }
  }

}
</style>

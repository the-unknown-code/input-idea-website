<script setup lang="ts"></script>

<template>
  <section class="layout-case-history">
    <h1 class="display">I <b>CLIENTI</b> CHE HANNO <b>SCELTO</b> LE NOSTRE MARKETING <b>SOLUTIONS</b></h1>
    <div class="filters">
      <p class="p-small active">strategy</p>
      <p class="p-small">brand identity</p>
      <p class="p-small">marketing</p>
      <p class="p-small">advertising</p>
      <p class="p-small">software</p>
    </div>
    <div class="list">
      <div v-for="item in 10"
        :key="item"
        class="layout-grid">
        <div>
          <div class="media">
            <common-media :src="`https://picsum.photos/400/400?random=${item}`"
              cover />
          </div>
        </div>
        <div>
          <p class="display --yellow">Autostile</p>
          <p class="p-small">Una comunicazione territoriale su misura</p>
        </div>
        <div>
          <ui-arrow />
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.layout-case-history {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 16px;


  .filters {
    position: relative;
    background-color: var(--lightgrey);
    border-radius: 16px;
    padding: 16px;
    display: flex;
    flex-direction: row;
    gap: 8px;
    color: var(--grey);
    cursor: pointer;

    p {
      &.active {
        color: var(--yellow);
      }
    }
  }

  .list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .layout-grid {
    position: relative;
    padding: 16px 16px;
    border-bottom: 1px solid var(--grey-600);
    border-radius: 16px;
    overflow: hidden;
    cursor: pointer;

    @include mobile {
      gap: 16px;
    }

    @include hover {
      &:hover {
        background-color: var(--yellow);

        .display,
        p {
          color: var(--darkgrey);
        }

        &:deep(.ui-arrow) {
          path {
            fill: var(--darkgrey);
          }
        }
      }
    }

    >div {
      grid-column: -1 / 1;
      align-items: center;


      &:deep(.ui-arrow) {
        width: 36px;

        svg {
          width: 100%;
          height: auto;
        }
      }

      &:nth-child(1) {
        @include desktop {
          grid-column: span 2;
        }
      }

      &:nth-child(2) {
        @include desktop {
          padding: 16px;
          grid-column: span 8;
        }
      }

      &:nth-child(3) {
        display: none;

        @include desktop {
          display: flex;
          justify-content: flex-end;
          grid-column: span 2;
        }
      }

      .media {
        position: relative;
        width: 100%;
        aspect-ratio: 4;
        border-radius: 16px;
        overflow: hidden;

        @include desktop {
          width: 100%;
          height: 100%;
          aspect-ratio: unset;
        }

      }
    }
  }
}
</style>

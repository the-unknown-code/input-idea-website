<template>
  <section class="layout-claim-hero">
    <div>
      <div>
        <div class="media">
          <common-media src="https://picsum.photos/800/800?random=3"
            cover />
        </div>
      </div>
      <div>
        <h1 class="display header">Il<b>Successo</b> Digitale è un <b>Progetto</b></h1>
        <p v-if="highlight"
          class="p-small highlight --yellow">{{ highlight }}</p>
      </div>
    </div>

    <p class="p-small --grey-600">Affidarsi alla web agency INPUTIDEA significa dare una direzione precisa alla propria
      presenza online. Analizziamo lo scenario digitale per fornirti gli strumenti e le strategie necessari a superare
      le sfide del mercato, garantendo una crescita costante e consapevole.</p>
  </section>
</template>


<script setup lang="ts">
defineProps({
  highlight: {
    type: String,
    required: false,
    default: null
  }
})
</script>

<style lang="scss" scoped>
.layout-claim-hero {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacer-16);
  max-width: 960px;
  margin: 0 auto;
  text-align: center;

  >div {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 24px;

    @include desktop {
      flex-direction: row;
    }

    >div {
      &:nth-child(1) {
        position: relative;
        border-radius: 12px;
        overflow: hidden;
        width: 100%;
        aspect-ratio: 4;

        @include desktop {
          width: 240px;
          height: auto;
        }

        .media {
          @include fill(absolute);
        }
      }
    }
  }

  h1 {
    text-align: left;
    text-wrap: balance;
    align-self: self-start;
  }

  p {

    &:not(.highlight) {
      margin-top: 32px;
      text-align: left;

      @include desktop {
        margin-top: 64px;
      }
    }

    &.highlight {
      text-align: left;
    }

  }
}
</style>

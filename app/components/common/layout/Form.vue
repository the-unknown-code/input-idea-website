<script setup lang="ts">
defineProps({
  blok: {
    type: Object,
    required: true,
  }
})

</script>

<template>
  <section class="layout-form">
    <div class="layout-grid">
      <div>
        <h1 class="display">
          <storyblok-richtext :content="blok.title[0].text"
            cleanup />
        </h1>
      </div>
      <div>
        <ui-form-input placeholder="Nome *" />
        <ui-form-input placeholder="Cognome *" />
        <ui-form-input placeholder="Telefono *"
          type="tel" />
        <ui-form-input placeholder="Email *"
          type="email" />
        <ui-form-input placeholder="Messaggio *"
          type="textarea" />

        <div class="consents">
          <label class="checkbox p-small --grey">
            <input type="checkbox" name="privacy" required />
            <span>Ho preso visione dell’informativa sulla privacy*</span>
          </label>
          <label class="checkbox p-small --grey">
            <input type="checkbox" name="marketing" />
            <span>Acconsento al trattamento dei dati per finalità di marketing</span>
          </label>
        </div>

        <div class="submit p-small --yellow">
          <b>Invia</b>
          <ui-arrow />
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.layout-form {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;

  .consents {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 12px;
  }

  .checkbox {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    cursor: pointer;

    input {
      appearance: none;
      flex: 0 0 auto;
      width: 20px;
      height: 20px;
      margin: 0;
      border: 1px solid var(--grey-600);
      border-radius: 5px;
      cursor: pointer;

      &:checked {
        border-color: var(--yellow);
        background-color: var(--yellow);

        &::after {
          display: block;
          width: 5px;
          height: 10px;
          margin: 2px auto;
          content: '';
          border: solid var(--darkgrey);
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }
      }
    }
  }

  .submit {
    position: relative;
    display: flex;
    flex-direction: row;
    gap: 8px;
    margin-top: 16px;
    font-weight: bold;
    cursor: pointer;

    &:deep(.ui-arrow) {
      width: 10px;
      transition: all 320ms var(--ease-out-circ);

      svg {
        width: 100%;
        height: auto;
      }
    }

    @include hover {
      &:hover {
        &:deep(.ui-arrow) {
          transform: translate(2px, -2px);
        }
      }
    }
  }

  .layout-grid {
    >div {
      grid-column: -1 / 1;

      @include desktop {
        grid-column: span 6;
      }

      &:nth-child(2) {
        display: flex;
        flex-direction: column;
        gap: 8px;

        @include mobile {
          margin-top: 32px;
        }
      }
    }
  }
}
</style>

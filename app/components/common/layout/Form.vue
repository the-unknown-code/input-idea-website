<script setup lang="ts"></script>

<template>
  <section class="layout-form">
    <div class="layout-grid">
      <div>
        <h1 class="display"><b>Richiedi</b> una consulenza</h1>
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

<template>
  <section class="home-hero">
    <client-only>
      <div class="home-hero__bg">
        <div v-for="i in 8"
          :key="i"
          class="home-hero__bg--item">
          <div />
        </div>
      </div>
    </client-only>
    <div v-show="isDesktop"
      class="home-hero__inner"
      role="h1"
      aria-label="Everything start with one Input">
      <div class="row row-1">
        <div>
          <span class="h1">Everything</span>
        </div>
        <div class="media">
          <div></div>
        </div>
        <div>
          <span class="h1">starts</span>
        </div>
      </div>
      <div class="row row-2">
        <div class="media">
          <div></div>
        </div>
        <div>
          <span class="h1">with one</span>
        </div>
        <div class="media empty">
          <span class="p --yellow">Costruiamo l'infrastruttura digitale che guida il tuo successo</span>
        </div>
      </div>
      <div class="row row-2">
        <div>
          <span class="h1 heavy">Input</span>
        </div>
        <div class="media">
          <div></div>
        </div>
      </div>
      <ui-common-cta label="Inizia un progetto"
        :callback="openChatBot" />
    </div>
    <div v-show="!isDesktop"
      class="home-hero__mobile">
      <h1>Everything <b>starts</b> with one <b>Input</b></h1>
      <div class="media">
        <div></div>
      </div>
      <ui-common-cta label="Inizia un progetto"
        :callback="openChatBot" />
    </div>
    <teleport to="body">
      <div v-if="isChatBotOpen"
        class="home-hero__chatbot-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Chatta con Input Idea"
        @click.self="closeChatBot">
        <button class="home-hero__chatbot-close"
          type="button"
          aria-label="Chiudi chatbot"
          @click="closeChatBot">×</button>
        <layout-ai-form :blok="chatBotBlok" />
      </div>
    </teleport>
  </section>
</template>

<script setup lang="ts">
const { isDesktop } = useBreakpoints();
const isChatBotOpen = ref(false)
const chatBotBlok = { title: [] }

const openChatBot = () => {
  isChatBotOpen.value = true
}

const closeChatBot = () => {
  isChatBotOpen.value = false
}

watch(isChatBotOpen, (isOpen) => {
  if (!import.meta.client) return
  document.body.style.overflow = isOpen ? 'hidden' : ''
})

onBeforeUnmount(() => {
  if (import.meta.client) document.body.style.overflow = ''
})
</script>


<style lang="scss" scoped>
.home-hero {
  position: relative;
  width: 100%;
  height: auto;

  @include desktop {
    padding: 0 var(--spacer-64);
  }

  &__chatbot-modal {
    position: fixed;
    inset: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 32px;
    background: rgb(0 0 0 / 55%);
    backdrop-filter: blur(12px);
    overflow-y: auto;

    @include mobile {
      padding: 16px;
    }
  }

  &__chatbot-close {
    position: fixed;
    top: 24px;
    right: 32px;
    z-index: 2;
    width: 40px;
    height: 40px;
    color: var(--white);
    font-size: 32px;
    line-height: 1;
    background: transparent;
    border: 0;
    cursor: pointer;

    @include mobile {
      top: 12px;
      right: 12px;
    }
  }

  &__chatbot-modal:deep(.layout-ai-form) {
    background-color: #2F2C2C;

    input,
    textarea {
      color: var(--white);

      &::placeholder {
        color: var(--white);
        opacity: .7;
      }
    }
  }

  &__bg {
    @include fill(absolute);
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    &::after {
      content: '';
      @include fill(absolute);
      background: linear-gradient(135deg, var(--darkgrey) 30%, transparent 160%);
    }

    &--item {
      position: relative;

      width: clamp(100%, 100% / 8, 100%);

      @for $i from 1 through 8 {
        &:nth-child(#{$i}) {
          >div {
            position: absolute;
            left: 0;
            width: calc(90% / 8 * #{$i});
            height: 100%;
            background: linear-gradient(180deg, var(--darkgrey) 0%, var(--grey-30) 100%);
          }

        }
      }

    }

  }

  &__mobile {
    position: relative;
    text-wrap: balance;
    height: calc(100dvh - var(--header-height));
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;

    &:deep(.ui-common-cta) {
      margin-top: 32px;
    }

    h1 {
      margin-top: var(--spacer-64);
      line-height: 1.25cap;
      text-align: center;
    }
  }

  &__inner {
    position: relative;
    height: 100%;
    min-height: calc(100dvh - var(--header-height));
    display: flex;
    flex-direction: column;
    padding: var(--spacer-64) 0;
    gap: var(--spacer-32);

    .row {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      white-space: nowrap;

      &.row-1 {
        >div {
          &:nth-child(1) {
            padding-right: var(--spacer-32);
          }

          &:nth-child(3) {
            padding-left: var(--spacer-32);
          }
        }
      }

      &.row-2 {
        >div {
          &:nth-child(1) {
            padding-right: var(--spacer-32);
          }
        }
      }

      span {
        display: block;
      }
    }

  }

  .media {
    position: relative;
    display: flex;
    align-self: stretch;
    align-items: center;
    width: 100%;
    height: auto;

    @include mobile {
      margin-inline: auto;
      max-width: 360px;
      aspect-ratio: 4;
      margin-top: var(--spacer-16);
    }

    &.empty {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;


      .p {
        position: relative;
        max-width: 400px;
        white-space: initial;
        text-wrap: balance;
        padding: 0 32px;
      }
    }

    &:not(.empty) {
      >div {
        @include fill(relative);
        width: 100%;
        height: 100%;
        background-color: var(--theme-contrast);
        border-radius: var(--spacer-16);
      }
    }

  }

}
</style>

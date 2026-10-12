<script setup lang="ts">
const props = defineProps({
  blok: {
    type: Object,
    required: true,
  },
});

const curriculumName = ref('');
const customCurriculumName = ref('');
const activePosition = ref(0);

const positions = computed(() => props.blok?.list ?? []);

const stackDepth = (index: number) => {
  const positionCount = positions.value.length;
  return positionCount
    ? (index - activePosition.value + positionCount) % positionCount
    : 0;
};

const stackScale = (index: number) => 1 - stackDepth(index) * 0.05;
const stackOffset = (index: number) =>
  `${(positions.value.length - stackDepth(index) - 1) * 40}px`;

const setActivePosition = (index: number) => {
  activePosition.value = index;
  curriculumName.value = '';
};

const updateCurriculum = (event: Event) => {
  const input = event.target as HTMLInputElement;
  curriculumName.value = input.files?.[0]?.name ?? '';
};

const updateCustomCurriculum = (event: Event) => {
  const input = event.target as HTMLInputElement;
  customCurriculumName.value = input.files?.[0]?.name ?? '';
};

watch(
  positions,
  items => {
    if (activePosition.value >= items.length) activePosition.value = 0;
  },
  { immediate: true }
);
</script>

<template>
  <section class="layout-open-position">
    <h3>
      <storyblok-richtext :content="props.blok.title[0].text"
        cleanup />
    </h3>
    <div class="layout-open-position__list"
      :style="{ '--stack-height': `${(positions.length - 1) * 40}px` }">
      <article v-for="(position, index) in positions"
        :key="position._uid"
        class="open-position"
        :class="{ 'is-active': index === activePosition }"
        :style="{
          '--stack-depth': stackDepth(Number(index)),
          '--stack-scale': stackScale(Number(index)),
          '--stack-offset': stackOffset(Number(index)),
        }">
        <div class="open-position__content layout-grid">
          <div>
            <p class="title p-big --yellow">{{ position.title }}</p>

            <div class="list-wrapper">
              <div v-for="knowledge in position.knowledges"
                :key="knowledge._uid"
                class="list">
                <p class="--yellow">{{ knowledge.title }}</p>
                <ul>
                  <li v-for="item in knowledge.list"
                    :key="item._uid">
                    <ui-arrow />
                    <p class="p --grey">{{ item.description }}</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div>
            <div class="form">
              <p class="form__title p --yellow">Entra a far parte del team</p>

              <div class="form__fields">
                <ui-form-input placeholder="Nome*" />
                <ui-form-input placeholder="Cognome*" />
                <ui-form-input placeholder="Email*"
                  type="email" />
                <ui-form-input placeholder="Telefono*"
                  type="tel" />

                <label class="form__file-input">
                  <span class="p-small">{{
                    curriculumName || 'Curriculum'
                    }}</span>
                  <input type="file"
                    accept=".pdf,.doc,.docx"
                    @change="updateCurriculum" />
                  <svg viewBox="0 0 24 24"
                    aria-hidden="true">
                    <path d="M12 3v11m0 0 4-4m-4 4-4-4M4 15v5h16v-5" />
                  </svg>
                </label>

                <div class="form__consents">
                  <label class="form__checkbox p-small --grey">
                    <input type="checkbox" />
                    <span>Ho preso visione dell’informativa sulla privacy*</span>
                  </label>
                  <label class="form__checkbox p-small --grey">
                    <input type="checkbox" />
                    <span>Acconsento al trattamento dei dati per finalità di
                      marketing</span>
                  </label>
                </div>

                <button class="submit p --yellow"
                  type="button">
                  <b>Invia la tua candidatura</b>
                  <ui-arrow />
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>

    <div class="layout-open-position__pagination"
      role="tablist"
      aria-label="Posizioni aperte">
      <button v-for="(position, index) in positions"
        :key="position._uid"
        :class="{ 'is-active': index === activePosition }"
        type="button"
        role="tab"
        :aria-selected="index === activePosition"
        :aria-label="`Mostra la posizione ${position.title}`"
        @click="setActivePosition(Number(index))" />
    </div>

    <section class="custom-form">
      <div class="custom-form__content layout-grid">
        <div class="custom-form__intro">
          <h3>
            <storyblok-richtext :content="props.blok.custom_form_title[0].text"
              cleanup />
          </h3>
          <p class="p --grey">
            <storyblok-richtext :content="props.blok.custom_form_description[0].text"
              cleanup />
          </p>
        </div>

        <div class="form custom-form__panel">
          <div class="form__fields custom-form__fields">
            <ui-form-input placeholder="Nome*" />
            <ui-form-input placeholder="Cognome*" />
            <ui-form-input placeholder="Email*"
              type="email" />
            <ui-form-input placeholder="Telefono*"
              type="tel" />
            <ui-form-input class="custom-form__message"
              placeholder="Messaggio" />

            <label class="form__file-input custom-form__file-input">
              <span class="p-small">{{
                customCurriculumName || 'Curriculum'
                }}</span>
              <input type="file"
                accept=".pdf,.doc,.docx"
                @change="updateCustomCurriculum" />
              <svg viewBox="0 0 24 24"
                aria-hidden="true">
                <path d="M12 3v11m0 0 4-4m-4 4-4-4M4 15v5h16v-5" />
              </svg>
            </label>

            <div class="form__consents custom-form__consents">
              <label class="form__checkbox p-small --grey">
                <input type="checkbox" />
                <span>Ho preso visione dell’informativa sulla privacy*</span>
              </label>
              <label class="form__checkbox p-small --grey">
                <input type="checkbox" />
                <span>Acconsento al trattamento dei dati per finalità di
                  marketing</span>
              </label>
            </div>

            <button class="submit p --yellow"
              type="button">
              <b>Candidati</b>
              <ui-arrow />
            </button>
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<style lang="scss" scoped>
.layout-open-position {
  position: relative;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;

  h3 {
    margin: 0 auto;
    text-align: center;
  }

  &__list {
    position: relative;
    display: grid;
    padding-bottom: 32px;
    margin-top: 64px;

    @include desktop {
      padding-bottom: var(--stack-height);
    }
  }

  &__pagination {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 44px;

    button {
      width: 12px;
      height: 6px;
      padding: 0;
      background-color: var(--white);
      border: 0;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.25s var(--ease-in-out-circ);

      &.is-active {
        width: 32px;
        background-color: var(--yellow);
      }
    }
  }

  @include mobile {
    &__list {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding-bottom: 0;
    }

    &__pagination {
      display: none;
    }
  }

  .custom-form {
    width: 100%;
    margin-top: 96px;

    @include desktop {
      margin-top: 128px;
    }

    &__content {
      row-gap: 48px;

      >div {
        grid-column: -1 / 1;

        @include desktop {
          &:first-child {
            grid-column: span 4;
          }

          &:last-child {
            grid-column: span 8;
          }
        }
      }
    }

    &__intro {
      display: flex;
      flex-direction: column;
      gap: 40px;

      h3 {
        margin: 0;
        text-align: left;
      }
    }

    &__panel {
      min-height: 100%;
      border-color: var(--yellow);
    }

    &__fields {
      display: grid !important;
      grid-template-columns: 1fr;
      gap: 24px 28px !important;

      @include desktop {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    &__message,
    &__file-input,
    &__consents,
    .submit {
      @include desktop {
        grid-column: 1 / -1;
      }
    }

    &__consents {
      @include desktop {
        flex-direction: row;
        gap: 28px;

        .form__checkbox {
          flex: 1 1 0;
        }
      }
    }
  }

  .open-position {
    position: relative;
    grid-area: 1 / 1;
    padding: 32px;
    background-color: #444;
    border-radius: 16px;
    overflow: hidden;
    pointer-events: none;
    transform: translateY(var(--stack-offset)) scale(var(--stack-scale));
    transform-origin: top center;
    transition: transform 600ms var(--ease-out-circ), opacity 320ms ease;
    z-index: calc(10 - var(--stack-depth));

    &::after {
      position: absolute;
      inset: 0;
      z-index: 2;
      content: '';
      background: linear-gradient(to bottom, transparent 0, #000 200px);
      opacity: 1;
      pointer-events: none;
      transition: opacity 600ms var(--ease-out-circ);
    }

    &.is-active {
      z-index: 20;
      pointer-events: auto;

      &::after {
        opacity: 0;
      }
    }

    @include mobile {
      z-index: auto;
      pointer-events: auto;
      transform: none;

      &::after {
        opacity: 0;
      }
    }

    .title {
      position: relative;
      margin-bottom: 32px;
    }

    &__content {
      @include mobile {
        row-gap: 32px;
      }

      >div {
        grid-column: -1 / 1;

        @include desktop {
          &:nth-child(1) {
            grid-column: span 7;

            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }

          &:nth-child(2) {
            grid-column: span 5;
          }
        }
      }
    }
  }

  .list-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 64px;

    &:deep(.ui-arrow) {
      position: relative;
      width: 8px;
      transform: translateY(-1px);

      svg {
        width: 100%;
        height: auto;
      }
    }

    .list {
      ul {
        margin-top: 12px;

        li {
          display: flex;
          align-items: center;
          gap: 12px;
        }
      }
    }
  }

  .form {
    padding: 40px 28px;
    border: 1px solid var(--grey-600);
    border-radius: 28px;

    @include desktop {
      padding: 56px;
    }

    &__title {
      margin-bottom: 48px;
      text-align: center;
    }

    &__fields {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    &__file-input {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-height: 48px;
      padding: 8px 20px;
      color: var(--grey-600);
      border: 1px dashed var(--grey-600);
      border-radius: 16px;
      cursor: pointer;

      input {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }

      svg {
        flex: 0 0 auto;
        width: 28px;
        height: 28px;
        fill: none;
        stroke: currentColor;
        stroke-linecap: square;
        stroke-linejoin: miter;
        stroke-width: 1;
      }
    }

    &__consents {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: 12px;
    }

    &__checkbox {
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
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: max-content;
      max-width: 100%;
      padding: 0;
      margin: 32px auto 0;
      color: var(--yellow);
      text-decoration: underline;
      text-decoration-thickness: 1px;
      text-underline-offset: 7px;
      font-weight: bold;
      background: transparent;
      border: 0;
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
  }
}
</style>

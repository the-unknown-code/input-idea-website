<script setup lang="ts">
type ChatOption = {
  label: string
  value: string
}

type ConversationStep = {
  message: string
  options: ChatOption[]
}

const calendlyUrl = 'https://calendly.com/'

const flows: Record<string, ConversationStep> = {
  brand: {
    message: 'Un brand forte e ben posizionato è la base di tutto. A che punto ti trovi con il tuo progetto?',
    options: [
      { label: 'Parto da zero', value: 'brand' },
      { label: 'Ho un brand ma va svecchiato', value: 'brand' },
      { label: 'Voglio superare i miei competitor', value: 'brand' },
    ],
  },
  sales: {
    message: 'Capito! Puntiamo ai risultati. Qual è il tuo canale di acquisizione principale al momento?',
    options: [
      { label: 'Faccio già Ads ma rendono poco', value: 'sales' },
      { label: 'Lavoro solo con agenti e commerciali', value: 'sales' },
      { label: 'Parto da zero', value: 'sales' },
    ],
  },
  website: {
    message: 'Hai già un sito web che desideri rinnovare o devi crearlo da zero?',
    options: [
      { label: 'E-commerce', value: 'website' },
      { label: 'Sito vetrina aziendale', value: 'website' },
      { label: 'Restyling strutturale e grafico', value: 'website' },
    ],
  },
  gdpr: {
    message: 'Dati puliti e dormire sonni tranquilli con la privacy: ottima priorità. Qual è l’urgenza maggiore in questo momento?',
    options: [
      { label: 'Setup Tag Manager e tracciamenti', value: 'gdpr' },
      { label: 'Banner Cookie e Privacy Policy', value: 'gdpr' },
      { label: 'Un check-up generale', value: 'gdpr' },
    ],
  },
}

const initialStep: ConversationStep = {
  message: 'Ciao! 👋 Benvenuto in Input Idea. Facciamo due chiacchiere veloci. Di cosa hai bisogno in questo momento per il tuo business?',
  options: [
    { label: 'Posizionare o rilanciare il mio brand', value: 'brand' },
    { label: 'Voglio aumentare vendite e contatti qualificati', value: 'sales' },
    { label: 'Voglio realizzare un nuovo sito web', value: 'website' },
    { label: 'Ho problemi con tracciamenti, cookie e GDPR', value: 'gdpr' },
    { label: 'Altro / Volevo solo conoscervi', value: 'other' },
  ],
}

const genericContactMessage = 'Perfetto, è esattamente il nostro pane quotidiano. Per poterti proporre una strategia su misura, lasciaci un tuo recapito. Ti contatteremo a breve! Come preferisci procedere?'
const contactMessages: Record<string, string> = {
  sales: 'Capito. Analizzare i dati e mappare le opportunità è il primo passo per sbloccare le vendite. Per tempi e costi facciamo una rapida chiacchierata. Come preferisci procedere?',
  website: 'Ottimo. Dietro un bel sito c’è sempre un’architettura solida. Per darti un’idea precisa di tempi e costi, la cosa migliore è fare una chiacchierata esplorativa. Come preferisci procedere?',
  gdpr: 'Nessun problema, possiamo intervenire in modo chirurgico. Lasciaci un contatto e un nostro tecnico specializzato ti scriverà per fissare un rapido audit. Come preferisci procedere?',
}

const step = ref<'initial' | 'detail' | 'other' | 'contact' | 'email' | 'complete'>('initial')
const selectedFlow = ref('')
const freeMessage = ref('')
const contact = reactive({ firstName: '', lastName: '', email: '' })
const canGoBack = computed(() => step.value !== 'initial' && step.value !== 'complete')

const currentStep = computed<ConversationStep>((): any => {
  if (step.value === 'initial') return initialStep
  if (step.value === 'detail') return flows[selectedFlow.value]
  if (step.value === 'contact') {
    return {
      message: contactMessages[selectedFlow.value] ?? genericContactMessage,
      options: [
        { label: 'Ti lascio la mia email', value: 'email' },
        { label: 'Prenoto una call', value: 'call' },
      ],
    }
  }
  return { message: '', options: [] }
})

function selectOption(option: ChatOption) {
  if (step.value === 'initial') {
    if (option.value === 'other') {
      step.value = 'other'
      return
    }

    selectedFlow.value = option.value
    step.value = 'detail'
    return
  }

  if (step.value === 'detail') {
    step.value = 'contact'
    return
  }

  if (option.value === 'email') step.value = 'email'
  if (option.value === 'call') window.open(calendlyUrl, '_blank', 'noopener,noreferrer')
}

function submitMessage() {
  if (!freeMessage.value.trim()) return
  selectedFlow.value = 'other'
  step.value = 'contact'
}

function submitContact() {
  if (!contact.firstName || !contact.lastName || !contact.email) return
  step.value = 'complete'
}

function goBack() {
  if (step.value === 'detail' || step.value === 'other') {
    step.value = 'initial'
    selectedFlow.value = ''
    return
  }

  if (step.value === 'contact') {
    step.value = selectedFlow.value === 'other' ? 'other' : 'detail'
    return
  }

  if (step.value === 'email') step.value = 'contact'
}

function restart() {
  step.value = 'initial'
  selectedFlow.value = ''
  freeMessage.value = ''
  Object.assign(contact, { firstName: '', lastName: '', email: '' })
}
</script>

<template>
  <section class="layout-ai-form"
    aria-label="Assistente Input Idea">
    <div class="layout-ai-form__content">
      <button v-if="canGoBack"
        class="back-button p-tiny --grey"
        type="button"
        aria-label="Torna alla domanda precedente"
        @click="goBack">← Indietro</button>

      <template v-if="step === 'complete'">
        <p class="title --yellow">Ricevuto! A prestissimo. 🚀</p>
        <button class="button p-tiny --grey"
          type="button"
          @click="restart">Ricomincia</button>
      </template>

      <template v-else-if="step === 'other'">
        <p class="title --yellow">Ricambiamo volentieri il saluto! 👋 Se hai una richiesta particolare, vuoi esplorare i
          nostri servizi o semplicemente approfondire, scrivici pure un messaggio qui sotto.</p>
        <form class="chat-form"
          @submit.prevent="submitMessage">
          <label class="sr-only"
            for="ai-form-message">Il tuo messaggio</label>
          <textarea id="ai-form-message"
            v-model="freeMessage"
            class="p-tiny"
            placeholder="Scrivi qui il tuo messaggio"
            required />
          <button class="button p-tiny --grey"
            type="submit">Continua</button>
        </form>
      </template>

      <template v-else-if="step === 'email'">
        <p class="title --yellow">Lasciaci i tuoi contatti e ti scriveremo a breve.</p>
        <form class="chat-form"
          @submit.prevent="submitContact">
          <label class="sr-only"
            for="ai-form-first-name">Nome</label>
          <input id="ai-form-first-name"
            v-model.trim="contact.firstName"
            class="p-tiny"
            type="text"
            placeholder="Nome"
            autocomplete="given-name"
            required>
          <label class="sr-only"
            for="ai-form-last-name">Cognome</label>
          <input id="ai-form-last-name"
            v-model.trim="contact.lastName"
            class="p-tiny"
            type="text"
            placeholder="Cognome"
            autocomplete="family-name"
            required>
          <label class="sr-only"
            for="ai-form-email">Email aziendale</label>
          <input id="ai-form-email"
            v-model.trim="contact.email"
            class="p-tiny"
            type="email"
            placeholder="Email aziendale"
            autocomplete="email"
            required>
          <button class="button p-tiny --grey"
            type="submit">Invia i miei dati</button>
        </form>
      </template>

      <template v-else>
        <p class="title --yellow">{{ currentStep.message }}</p>
        <div class="options"
          role="group"
          aria-label="Scegli una risposta">
          <button v-for="option in currentStep.options"
            :key="option.label"
            class="button p-tiny --grey"
            type="button"
            @click="selectOption(option)">
            {{ option.label }}
          </button>
        </div>
      </template>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.layout-ai-form {
  position: relative;
  width: 100%;
  max-width: 1280px;
  border: 1px solid var(--grey-30);
  padding: 64px;
  border-radius: 16px;
  margin: 0 auto;
  display: flex;
  justify-content: center;

  &__content {
    width: 100%;
    max-width: 760px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 32px;
  }

  .title {
    text-align: center;
  }

  .options,
  .chat-form {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 12px;
  }

  .chat-form {
    width: min(100%, 480px);
  }

  input,
  textarea {
    width: 100%;
    border: 1px solid var(--grey-30);
    border-radius: 8px;
    padding: 12px;
  }

  textarea {
    min-height: 120px;
    resize: vertical;
  }

  .button {
    border: 1px solid var(--grey-30);
    border-radius: 16px;
    padding: 8px 12px;
    display: inline-flex;
    text-align: left;
    transition: color .2s ease, border-color .2s ease;

    &:hover,
    &:focus-visible {
      border-color: var(--yellow);
      color: var(--yellow);
    }
  }

  .back-button {
    align-self: flex-start;
    cursor: pointer;
    transition: color .2s ease;

    &:hover,
    &:focus-visible {
      color: var(--yellow);
    }
  }

  .sr-only {
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

  @media (max-width: 767px) {
    padding: 32px 20px;
  }
}
</style>

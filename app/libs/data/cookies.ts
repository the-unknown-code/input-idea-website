/**
 * Cookie declaration shown in the consent dialog ("Dettagli" tab).
 * Keep it in sync with what the site really sets: when GTM/Analytics, Maps
 * or any other third-party script is added, list its provider and cookies here
 * (a cookie scan of the live site is the reliable source).
 */
import type { ConsentCategory } from '~/libs/consent';

export type CookieInfo = { name: string; description: string; duration: string; type: string };
export type CookieProvider = { name: string; url?: string; cookies: CookieInfo[] };
export type CookieCategoryInfo = {
	key: ConsentCategory;
	label: string;
	description: string;
	providers: CookieProvider[];
};

export const COOKIE_CATEGORIES: CookieCategoryInfo[] = [
	{
		key: 'necessary',
		label: 'Necessari',
		description:
			'I cookie necessari contribuiscono a rendere fruibile il sito web abilitandone funzionalità di base quali la navigazione sulle pagine e l’accesso alle aree protette del sito. Il sito web non è in grado di funzionare correttamente senza questi cookie.',
		providers: [
			{
				name: 'Input Idea',
				url: '/privacy-policy',
				cookies: [
					{
						name: 'ii_consent',
						description: 'Memorizza lo stato del consenso ai cookie dell’utente per il dominio corrente',
						duration: '1 anno',
						type: 'Cookie HTTP',
					},
				],
			},
		],
	},
	{
		key: 'preferences',
		label: 'Preferenze',
		description:
			'I cookie di preferenza consentono a un sito web di ricordare le informazioni che influenzano il modo in cui il sito si comporta o si presenta, come la lingua preferita o la regione in cui ti trovi.',
		providers: [],
	},
	{
		key: 'statistics',
		label: 'Statistiche',
		description:
			'I cookie statistici aiutano i proprietari del sito web a capire come i visitatori interagiscono con i siti raccogliendo e trasmettendo informazioni in forma anonima.',
		providers: [],
	},
	{
		key: 'marketing',
		label: 'Marketing',
		description:
			'I cookie per il marketing vengono utilizzati per monitorare i visitatori nei siti web. L’intento è quello di visualizzare annunci pertinenti e coinvolgenti per il singolo utente e quindi più apprezzabili per editori e inserzionisti terzi.',
		providers: [],
	},
];

export const CONSENT_INTRO = {
	title: 'Questo sito web utilizza i cookie',
	text: 'Utilizziamo i cookie per personalizzare contenuti ed annunci, per fornire funzionalità dei social media e per analizzare il nostro traffico. Condividiamo inoltre informazioni sul modo in cui utilizzi il nostro sito con i nostri partner che si occupano di analisi dei dati web, pubblicità e social media, i quali potrebbero combinarle con altre informazioni che hai fornito loro o che hanno raccolto dal tuo utilizzo dei loro servizi.',
};

export const COOKIE_ABOUT = [
	'I cookie sono piccoli file di testo che possono essere utilizzati dai siti web per rendere più efficiente l’esperienza per l’utente.',
	'La legge afferma che possiamo memorizzare i cookie sul tuo dispositivo se sono strettamente necessari per il funzionamento di questo sito. Per tutti gli altri tipi di cookie abbiamo bisogno del tuo consenso.',
	'Questo sito utilizza diversi tipi di cookie. Alcuni cookie sono collocati da servizi di terzi che compaiono sulle nostre pagine.',
	'In qualsiasi momento è possibile modificare o revocare il proprio consenso dalla Dichiarazione dei cookie sul nostro sito web.',
	'Scopri di più su chi siamo, come puoi contattarci e come trattiamo i dati personali nella nostra Informativa sulla privacy.',
	'Specifica l’ID del tuo consenso e la data di quando ci hai contattati per quanto riguarda il tuo consenso.',
];

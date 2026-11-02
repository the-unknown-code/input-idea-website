declare const getMedia:(b:any)=>any;declare function computed<T>(f:()=>T):{value:T};declare function ref<T>(v:T):{value:T};declare function useIntervalFn(...a:any[]):any;declare function onMounted(f:any):void;declare function defineProps(p:any):any;declare const storyblokFormat:any;


type Stat = { prefix: string; value: string; suffix: string; label: any };

const props = defineProps({
  blok: {
    type: Object,
    required: false,
    default: () => ({
      values: [
        { title: '+30%', description: 'Lorem ipsum dolor' },
        { title: '+55%', description: 'Lorem ipsum dolor' },
      ],
      carousel: [],
    }),
  },
});

// AdvancedText fields arrive as [{ text: <richtext doc> }]
const richOf = (field: any) => (Array.isArray(field) ? field[0]?.text : field);
const isRich = (field: any) => !!field && typeof field === 'object';
// true when a richtext doc (or string) has any actual text
const hasText = (node: any): boolean =>
  typeof node === 'string' ? node.trim().length > 0 : !!node && (!!node.text?.trim() || (node.content ?? []).some(hasText));

const description = computed(() => (hasText(richOf(props.blok.description)) ? props.blok.description : null));

// "+30%" -> prefix "+", value "30", suffix "%"
const splitValue = (raw: string = '') => {
  const m = String(raw).trim().match(/^([^\d]*)([\d.,]+)(.*)$/);
  return m ? { prefix: m[1], value: m[2], suffix: m[3] } : { prefix: '', value: String(raw), suffix: '' };
};

// typed list helper: `cond ? any[] : []` is a union (any[] | never[]) and breaks .map/.filter overloads
const listOf = (field: unknown): any[] => (Array.isArray(field) ? field : []);

const stats = computed<Stat[]>(() =>
  listOf(props.blok.values).map((item): Stat => {
    const desc = richOf(item.description);
    const label = richOf(item.label);
    return {
      ...splitValue(item.title),
      // label under the number: description, else label (skip empty docs)
      label: hasText(desc) ? desc : hasText(label) ? label : null,
    };
  })
);

const media = computed<{ src: string }[]>(() =>
  listOf(props.blok.carousel)
    .map((item): string | undefined => getMedia(item)?.image?.src ?? item?.filename)
    .filter((src): src is string => !!src)
    .map(src => ({ src }))
);

// stats: auto-rotate every 4s (client only, so SSR and hydration match)
const activeStat = ref(0);
const { pause, resume } = useIntervalFn(
  () => (activeStat.value = (activeStat.value + 1) % Math.max(1, stats.value.length)),
  4000,
  { immediate: false }
);
onMounted(() => stats.value.length > 1 && resume());
const selectStat = (i: number) => {
  activeStat.value = i;
  pause();
  resume(); // restart the timer after a manual pick
};

// photos
const activeMedia = ref(0);
const $track = ref<HTMLElement | null>(null);
const selectMedia = (i: number) => {
  const count = media.value.length;
  if (!count) return;
  activeMedia.value = (i + count) % count;
  // center the active thumbnail without scrolling the page
  const track = $track.value;
  const thumb = track?.children.item(activeMedia.value) as HTMLElement | null;
  if (track && thumb) {
    track.scrollTo({ left: thumb.offsetLeft - (track.clientWidth - thumb.offsetWidth) / 2, behavior: 'smooth' });
  }
};

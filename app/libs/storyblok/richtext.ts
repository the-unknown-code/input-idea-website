import { BlockTypes, richTextResolver, type StoryblokRichTextNode } from '@storyblok/richtext';

export type StoryblokRichtextDocument = Parameters<
    ReturnType<typeof richTextResolver>['render']
>[0];

export type StoryblokRichtextOptions = Parameters<typeof richTextResolver>[0];

/** Storyblok can pass asset object in attrs.src; extract URL for img tag */
function imageUrl(attrs: Record<string, unknown> | undefined): string {
    if (!attrs?.src) return '';
    const src = attrs.src;
    if (typeof src === 'string') return src;
    if (src && typeof src === 'object' && 'filename' in src && typeof (src as { filename?: string }).filename === 'string') {
        return (src as { filename: string }).filename;
    }
    return '';
}

const defaultResolver = richTextResolver({

    //@ts-expect-error TODO
    resolvers: {
        [BlockTypes.IMAGE]: (node: { attrs?: Record<string, unknown> }) => {
            const attrs = node.attrs ?? {};
            const src = imageUrl(attrs);
            const alt = typeof attrs.alt === 'string' ? attrs.alt : '';
            const title = typeof attrs.title === 'string' ? attrs.title : '';
            if (!src) return '';
            const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
            return `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}"${titleAttr} />`;
        },
    },
});

function escapeHtml(s: string): string {
    return s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

export function isRichtextDocument(doc: unknown): doc is StoryblokRichtextDocument {
    return (
        doc != null &&
        typeof doc === 'object' &&
        'type' in doc &&
        (doc as { type?: string }).type === 'doc'
    );
}

/**
 * Renders a Storyblok richtext document to HTML.
 * Returns '' when content is null/undefined or not a valid richtext doc.
 */
export function renderStoryblokRichtext(
    doc: StoryblokRichtextDocument | null | undefined,
    options?: StoryblokRichtextOptions,
    cleanup?: boolean,
): string {
    if (doc == null || !isRichtextDocument(doc)) {
        return '';
    }
    try {
        const resolver = options ? richTextResolver(options) : defaultResolver;
        let html = resolver.render(doc as StoryblokRichTextNode<string>);
        if (cleanup) {
            html = cleanupHtml(html as string);
        }
        return html as string;
    } catch {
        return '';
    }
}

export function useStoryblokRichtext(options?: StoryblokRichtextOptions) {
    const resolver = options ? richTextResolver(options) : defaultResolver;
    const render = (doc: StoryblokRichtextDocument | null | undefined): string =>
        doc == null ? '' : resolver.render(doc) as string
    return { render, renderRichText: render };
}


export const cleanupHtml = (html: string) => {

    if (!html) return html;

    let out = html;

    // 0. Unwrap outer wrapper spans
    out = out.replace(/^<span[^>]*>([\s\S]*)<\/span>$/gi, '$1').trim();
    out = out.replace(/^<span[^>]*>([\s\S]*)<\/span>$/gi, '$1').trim();

    // 1. Normalize strong / b (strip attributes)
    out = out.replace(/<(strong|b)[^>]*>/gi, '<$1>');

    // 2. Convert block-level tags to <br> (except <p> which becomes <div>)
    out = out.replace(/<\/?(div|section|article|header|footer|li)[^>]*>/gi, '<br>');
    out = out.replace(/<p[^>]*>/gi, '<div>');
    out = out.replace(/<\/p>/gi, '</div>');

    // 3. Normalize <br> variants
    out = out.replace(/<br\s*\/?>/gi, '<br>');

    // 4. Remove all remaining tags EXCEPT strong, b, br, div
    out = out.replace(/<(?!\/?(strong|b|br|div)\b)[^>]+>/gi, '');

    // 5. Remove empty strong / b (run twice to catch nested empties)
    out = out.replace(/<(strong|b)>\s*<\/\1>/gi, '');
    out = out.replace(/<(strong|b)>\s*<\/\1>/gi, '');

    // 6. Collapse adjacent strong / b tags
    out = out.replace(/<\/(strong|b)>\s*<\1>/gi, '');

    // 7. Collapse multiple <br>
    out = out.replace(/(<br>\s*){2,}/gi, '<br>');

    // 8. Trim leading/trailing <br>
    out = out.replace(/^(<br>\s*)+|(<br>\s*)+$/gi, '');

    return out;
}
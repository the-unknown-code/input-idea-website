import { renderRichText, type StoryblokRichTextInput } from '@storyblok/richtext';
import sanitizeHtml from 'sanitize-html';

export const renderHTML = (
    doc: StoryblokRichTextInput,
    allowedTags: string[] = ['p', 'a', 'b', 'u', 'i', 'ul', 'ol', 'li', 'br', 'strike', 'code'],
) => {
    if (!doc) return '';

    // plain strings (e.g. component defaults) aren't richtext docs: renderRichText would throw
    const html = typeof doc === 'string' ? doc : renderRichText(doc);

    return sanitizeHtml(html, {
        allowedTags,
        allowedAttributes: {
            a: ['href', 'title', 'target', 'rel'],
        },
        allowedSchemes: ['http', 'https', 'mailto'],
    });
};

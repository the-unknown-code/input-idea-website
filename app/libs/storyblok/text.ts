import { renderRichText, type StoryblokRichTextInput } from '@storyblok/richtext';
import sanitizeHtml from 'sanitize-html';

export const renderHTML = (
    doc: StoryblokRichTextInput,
    allowedTags: string[] = ['p', 'a', 'b', 'u', 'i', 'ul', 'ol', 'li', 'br'],
) => {
    if (!doc) return '';

    return sanitizeHtml(renderRichText(doc), {
        allowedTags,
        allowedAttributes: {
            a: ['href', 'title', 'target', 'rel'],
        },
        allowedSchemes: ['http', 'https', 'mailto'],
    });
};
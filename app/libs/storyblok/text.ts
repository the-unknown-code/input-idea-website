import { renderRichText, type StoryblokRichTextInput } from '@storyblok/richtext';
import sanitizeHtml from 'sanitize-html';

export const renderHTML = (
    doc: StoryblokRichTextInput,
    allowedTags: string[] = ['p', 'a', 'b', 'u', 'i', 'ul', 'ol', 'li', 'br', 'strike', 'code', 'span'],
) => {
    if (!doc) return '';

    return sanitizeHtml(renderRichText(doc), {
        allowedTags,
        allowedAttributes: {
            a: ['href', 'title', 'target', 'rel'],
            span: ['style'],
        },
        allowedStyles: {
            span: {
                color: [
                    /^#[0-9a-f]{3,8}$/i,
                    /^rgba?\([\d.,%\s]+\)$/i,
                    /^hsla?\([\d.,%\s]+\)$/i,
                    /^[a-z]+$/i,
                ],
            },
        },
        allowedSchemes: ['http', 'https', 'mailto'],
    });
};

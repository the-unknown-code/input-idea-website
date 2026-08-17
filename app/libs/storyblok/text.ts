/**
 * @description Utility for rendering Storyblok Rich Text content into sanitized HTML.
 * Supports configurable allowed HTML tags and uses DOMPurify to prevent XSS.
 *
 * @author Andrea Giuffrida
 */

import { renderRichText, type StoryblokRichTextInput } from '@storyblok/richtext';
import DOMPurify from 'isomorphic-dompurify';

export const renderHTML = (doc: StoryblokRichTextInput, allowedTags: string[] = ['b', 'strong']) => {
    if (!doc) return '';
    const html = renderRichText(doc);
    const sanitized = DOMPurify.sanitize(html, { ALLOWED_TAGS: allowedTags });
    return sanitized;
};

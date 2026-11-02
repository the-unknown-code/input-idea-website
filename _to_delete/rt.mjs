import { renderRichText } from '@storyblok/richtext';
import sanitizeHtml from 'sanitize-html';
const doc = {type:'doc',content:[{type:'paragraph',content:[{text:'Grazie a questa ',type:'text'},{type:'hard_break'},{text:'Questo bold',type:'text',marks:[{type:'bold'}]}]}]};
const raw = renderRichText(doc);
console.log('RAW', raw);
console.log('SAN', sanitizeHtml(raw,{allowedTags:['p','b','strong','br','i','a']}));
const title = {type:'doc',content:[{type:'paragraph',content:[{text:'I ',type:'text'},{text:'Risultati',type:'text',marks:[{type:'bold'}]}]}]};
console.log('TITLE', sanitizeHtml(renderRichText(title),{allowedTags:['b','strong','br','pre','code','strike']}));

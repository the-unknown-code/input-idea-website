import * as sass from 'sass';
import { pathToFileURL } from 'node:url';
const root = process.cwd();
const f = process.argv[2];
try {
  const r = sass.compileString(`@use "${root}/app/assets/utils/functions.scss" as *; @use "${root}/app/assets/utils/typography.scss" as *;\n@use "${f}";`, { url: pathToFileURL(root + '/x.scss'), functions: { 'get($keys)': () => sass.sassNull, 'getColors()': () => sass.sassNull, 'getThemes()': () => sass.sassNull } });
  console.log('OK', r.css.length, (r.css.match(/\.h1/g)||[]).length);
} catch (e) { console.log('ERR', e.message.slice(0,400)); }

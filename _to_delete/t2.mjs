import * as sass from 'sass';
import { pathToFileURL } from 'node:url';
const root = process.cwd();
const vals = { 'typography.minVW': 960, 'typography.baseVW': 1440, 'typography.maxVW': 1920 };
const get = ([k]) => { const key = k.text ?? String(k); return key in vals ? new sass.SassNumber(vals[key]) : sass.sassNull; };
const opts = { url: pathToFileURL(root + '/x.scss'), logger: sass.Logger.silent, functions: { 'get($keys)': get, 'getColors()': () => sass.sassNull, 'getThemes()': () => sass.sassNull } };
const inj = `@use "${root}/app/assets/utils/functions.scss" as *; @use "${root}/app/assets/utils/typography.scss" as *;\n`;
for (const [name, src] of [['injected-only', inj], ['classes', inj + `@use "${root}/app/assets/utils/typography-classes.scss";`]]) {
  try { const r = sass.compileString(src, opts); console.log(name, 'OK bytes', r.css.length); }
  catch (e) { console.log(name, 'ERR', e.message.slice(0, 300)); }
}

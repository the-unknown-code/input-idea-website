import * as sass from 'sass';
import { isQuoted } from './utils.ts';
import { OrderedMap } from 'immutable';

const toSass = (value: any) => {
	if (value instanceof sass.Value) {
		return value;
	} else if (value === null || value === undefined) {
		return sass.sassNull;
	} else if (typeof value === 'boolean') {
		return value ? sass.sassTrue : sass.sassFalse;
	} else if (typeof value === 'number') {
		return new sass.SassNumber(value);
	} else if (typeof value === 'string') {
		const valueIsQuoted = isQuoted(value);

		return new sass.SassString(value, {
			quotes: valueIsQuoted,
		});
	} else if (typeof value === 'object') {
		if (Array.isArray(value)) {
			const sassList: any = value.map(value => toSass(value));
			return new sass.SassList(sassList);
		} else {
			const sassMap: any = OrderedMap(value).mapEntries(([key, val]) => [
				new sass.SassString(String(key), { quotes: true }),
				toSass(val),
			]);
			return new sass.SassMap(sassMap);
		}
	}

	return sass.sassNull;
};

export { toSass };

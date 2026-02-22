// @ts-expect-error: No types for 'gsap/all'
import gsap from 'gsap/all';

const isQuoted = (str: string): boolean => /^['"].*['"]$/.test(str);

const generateShades = (colors: Record<string, string>) => {
	const result = {};

	for (const [key, value] of Object.entries(colors)) {
		(result as Record<string, any>)[key] = value;

		for (let i = 0; i <= 19; i++) {
			const split: any = gsap.utils.splitColor(value as string);
			const rgb: any = split.toString().replaceAll(',', ' ');
			const alpha: any = Math.round((((i / 20) * 0xff) / 255) * 100);

			(result as Record<string, any>)[`${key}-${i * 5}`] = `rgb(${rgb} / ${alpha}%)`;
		}
	}

	return result;
};

export { isQuoted, generateShades };
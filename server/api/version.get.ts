import { readFileSync } from 'fs';
import { join } from 'path';

export default defineEventHandler(() => {
	try {
		const packageJsonPath = join(process.cwd(), 'package.json');
		const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
		return packageJson.version || packageJson.name || '1.0.0';
	} catch (error) {
		return 'Unknown';
	}
});


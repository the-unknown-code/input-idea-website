import { execSync } from 'child_process';

export default defineEventHandler(() => {
	try {
		const branch = execSync('git rev-parse --abbrev-ref HEAD', {
			encoding: 'utf-8',
		}).trim();
		return branch;
	} catch (error) {
		return 'Unknown';
	}
});


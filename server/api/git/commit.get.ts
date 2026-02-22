import { execSync } from 'child_process';

export default defineEventHandler(() => {
	try {
		const commit = execSync('git rev-parse --short HEAD', {
			encoding: 'utf-8',
		}).trim();
		return commit;
	} catch (error) {
		return 'Unknown';
	}
});


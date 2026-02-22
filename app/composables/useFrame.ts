/**
 * useFrame composable
 * -------------------
 * This composable registers a callback with Tempus on component mount
 * and automatically unsubscribes on unmount.
 *
 * - `callback`: function to be executed on every Tempus frame
 * - `priority`: optional priority (higher runs earlier), default = 0
 *
 * Example:
 * ```ts
 * useFrame((time) => {
 *   // do something every frame
 * }, 1);
 * ```
 */

import Tempus from 'tempus';

export const useFrame = (
	callback: (time: number, delta: number) => void,
	priority: number = 0
) => {
	let unsubscribe: (() => void) | undefined;

	onMounted(() => {
		if (callback) {
			unsubscribe = Tempus.add(callback, { priority });
		}
	});

	onBeforeUnmount(() => unsubscribe?.());
};

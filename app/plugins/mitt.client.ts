import mitt from 'mitt';

export default defineNuxtPlugin(() => {
	const emitter = mitt();

	return {
		provide: {
			e: emitter,
			on: emitter.on,
			off: emitter.off,
			emit: emitter.emit,
		},
	};
});

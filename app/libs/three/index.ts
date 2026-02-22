import Tempus, { type TempusCallback } from 'tempus';
import SF3Renderer from './@core/Renderer';
import SF3Viewport from './@core/Viewport';
import type { WebGLRendererParameters } from 'three';
import SF3ViewManager from './@view/Manager';

export default class SF3Application {
	#canRender: boolean = false;
	#rafCancelFn: any;
	#renderFn: TempusCallback;

	#renderer: SF3Renderer;
	#viewport: SF3Viewport;
	#manager: SF3ViewManager;

	constructor(options: Partial<WebGLRendererParameters> = {}) {
		this.#renderer = SF3Renderer.getInstance(options);
		this.#renderFn = this.#render.bind(this);

		this.#viewport = SF3Viewport.getInstance();
		this.#renderer = SF3Renderer.getInstance(options);
		this.#manager = SF3ViewManager.getInstance();

		this.resize();
	}

	resize() {
		this.#renderer.resize();
		this.#manager.resize();
	}

	#render(time: number, dt: number) {
		if (!this.#canRender) return;

		this.#viewport.render(time, dt);
		this.#manager.render(time, dt);
		this.#renderer.render(time, dt);
	}

	start() {
		this.#canRender = true;
		this.#rafCancelFn = Tempus.add(this.#renderFn, { priority: -1 });
	}

	stop() {
		this.#canRender = false;
		this.#rafCancelFn?.();
	}

	pause() {
		this.#canRender = false;
	}

	resume() {
		this.#canRender = true;
	}

	get domElement(): HTMLCanvasElement {
		return this.#renderer.domElement;
	}
}

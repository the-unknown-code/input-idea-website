import { WebGLRenderer, type WebGLRendererParameters } from 'three';
import { EffectComposer } from 'postprocessing';
import SF3Viewport from './Viewport';
import SF3ViewManager from '../@view/Manager';

export default class SF3Renderer {
	static instance: SF3Renderer;

	#r: WebGLRenderer;
	#c: EffectComposer;

	#viewport: SF3Viewport;
	#manager: SF3ViewManager;

	static getInstance(options: Partial<WebGLRendererParameters> = {}) {
		if (!SF3Renderer.instance) {
			SF3Renderer.instance = new SF3Renderer(options);
		}
		return SF3Renderer.instance;
	}

	constructor(options: Partial<WebGLRendererParameters>) {
		this.#viewport = SF3Viewport.getInstance();
		this.#manager = SF3ViewManager.getInstance();

		this.#r = new WebGLRenderer(options);
		this.#c = new EffectComposer(this.#r);

		this.#r.setPixelRatio(window.devicePixelRatio);
	}

	resize() {
		const { width, height } = this.#viewport;
		this.#r.setSize(width, height);
		this.#c.setSize(width, height);
	}

	render(_time: number, _dt: number) {
		const { scene, camera } = this.#manager.activeScene;
		this.#r.render(scene, camera);

		// this.#r.render(time, dt);
		// console.log(time, dt);
	}

	get domElement(): HTMLCanvasElement {
		return this.#r.domElement;
	}
}

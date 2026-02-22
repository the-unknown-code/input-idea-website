import { PerspectiveCamera, Scene } from 'three';
import SF3Viewport from '../../@core/Viewport';

export default class SF3AbstractScene {
	#scene: Scene;
	#camera: PerspectiveCamera;
	#viewport: SF3Viewport;

	constructor() {
		this.#viewport = SF3Viewport.getInstance();

		this.#scene = new Scene();
		this.#camera = new PerspectiveCamera(75, 1, 0.1, 1000);
		this.#camera.position.z = 10;
	}

	render(_time: number, _dt: number) {}

	resize() {
		this.#camera.aspect = this.#viewport.width / this.#viewport.height;
		this.#camera.updateProjectionMatrix();
	}

	get scene(): Scene {
		return this.#scene;
	}

	get camera(): PerspectiveCamera {
		return this.#camera;
	}
}

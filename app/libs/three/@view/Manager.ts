import type { PerspectiveCamera, Scene } from 'three';
import type SF3AbstractScene from './scenes/AbstractScene';
import SF3TestScene from './scenes/Test';

export default class SF3ViewManager {
	static instance: SF3ViewManager;

	#currentIndex: number = 0;
	#scenes: SF3AbstractScene[] = [];

	static getInstance() {
		if (!SF3ViewManager.instance) {
			SF3ViewManager.instance = new SF3ViewManager();
		}
		return SF3ViewManager.instance;
	}

	constructor() {
		this.loadScenes();
	}

	loadScenes() {
		const testScene = new SF3TestScene();
		this.#scenes.push(testScene);
	}

	render(_time: number, _dt: number) {
		this.#scenes.forEach((scene: SF3AbstractScene) => {
			scene.render(_time, _dt);
		});
	}

	resize() {
		this.#scenes.forEach((scene: SF3AbstractScene) => {
			scene.resize();
		});
	}

	get activeScene(): { scene: Scene; camera: PerspectiveCamera } {
		return {
			scene: this.#scenes[this.#currentIndex]!.scene,
			camera: this.#scenes[this.#currentIndex]!.camera,
		};
	}
}

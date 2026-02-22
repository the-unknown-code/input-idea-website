import { Mesh, MeshNormalMaterial, SphereGeometry } from 'three';
import SF3AbstractScene from '../AbstractScene';

export default class SF3TestScene extends SF3AbstractScene {
	#sphere: Mesh;

	constructor() {
		super();

		this.#sphere = new Mesh(
			new SphereGeometry(3, 12, 6),
			new MeshNormalMaterial({ flatShading: true })
		);
		this.scene.add(this.#sphere);
	}

	override render(_time: number, _dt: number) {
		super.render(_time, _dt);

		this.#sphere.rotation.y += _dt * 0.001;
	}
}

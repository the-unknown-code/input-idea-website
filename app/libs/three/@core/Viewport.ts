import { Vector2 } from 'three';
import { lerp } from '~/libs/common/math';

export default class SF3Viewport {
	static instance: SF3Viewport;

	#width: Ref<number>;
	#height: Ref<number>;
	#x: Ref<number>;
	#y: Ref<number>;

	#mouse: Vector2 = new Vector2(0, 0);

	static getInstance() {
		if (!SF3Viewport.instance) {
			SF3Viewport.instance = new SF3Viewport();
		}
		return SF3Viewport.instance;
	}

	constructor() {
		const { width, height } = useWindowSize();
		const { x, y } = useMouse();

		this.#width = width;
		this.#height = height;
		this.#x = x;
		this.#y = y;
	}

	render(time: number, dt: number) {
		const deltaSec = dt * 0.001;
		const lerpMouse = 1 - Math.exp(-6 * deltaSec);

		const nx: number = (this.#x.value / this.#width.value) * 2 - 1;
		const ny: number = (this.#y.value / this.#height.value) * 2 - 1;

		const lx: number = lerp(this.#mouse.x, nx, lerpMouse);
		const ly: number = lerp(this.#mouse.y, ny, lerpMouse);
		this.#mouse.set(lx, ly);
	}

	get mouse(): Vector2 {
		return this.#mouse;
	}

	get width(): number {
		return this.#width.value;
	}

	get height(): number {
		return this.#height.value;
	}
}

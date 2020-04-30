import Bubble from '../assets/resources/ui/talking-balloon.png';

export class Bubbles {
	static preload(scene) {
		scene.load.image('bubble', Bubble);
	}

	static render(scene, message) {
		const m = 8;

		const txt = scene.add.text(m, m, message, {
			fontFamily: 'cube-cavern',
			fontSize: '18px',
			color: 0xFF00FF,
		});

		const dlg = scene.add.nineslice(
			0, 0, // this is the starting x/y location
			txt.width + 2 * m, txt.height + 2 * m, // the width and height of your object
			'bubble', // a key to an already loaded image
			m, // the width and height to offset for a corner slice
			m, // (optional) pixels to offset when computing the safe usage area
		);

		scene.children.bringToTop(this.dlg);
		scene.children.bringToTop(txt);

		const container = scene.add.container();

		container.add(dlg);
		container.add(txt);

		container.width = dlg.width;
		container.height = dlg.height;

		return container;
	}
}

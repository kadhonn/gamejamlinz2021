import {GameScene, SCALE} from "../../scenes/gameScene";

export function setupInternet(scene: GameScene, x: number) {
    const theInternet = scene.physics.add.staticSprite(700 + x, 450, 'theInternet')
        .setScale(SCALE + 1)
        .refreshBody();
    theInternet.anims.create({
        key: 'alive',
        frames: scene.anims.generateFrameNumbers('theInternet', {start: 0, end: 1}),
        frameRate: 4,
        repeat: -1,
    });
    theInternet.anims.create({
        key: 'dying',
        frames: scene.anims.generateFrameNumbers('theInternet', {start: 2, end: 3}),
        frameRate: 8,
        repeat: -1,
    });
    theInternet.anims.create({
        key: 'dead',
        frames: scene.anims.generateFrameNumbers('theInternet', {start: 4, end: 4}),
        frameRate: 1,
        repeat: -1,
    });
    theInternet.anims.play('alive');

}
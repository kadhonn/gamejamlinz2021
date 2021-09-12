import {GameScene, ROOM_WIDTH} from "../../scenes/gameScene";

export function setupErrorPC(scene: GameScene, x: number) {
    const errorPc = scene.physics.add.staticSprite(400 + x, 450, 'pcError').setScale(4);
    errorPc.anims.create({
        key: 'blink',
        frames: scene.anims.generateFrameNumbers('pcError', {start: 0, end: 1}),
        frameRate: 8,
        repeat: -1,
    });
    errorPc.anims.play('blink');
    scene.obstacles.add(errorPc);
}
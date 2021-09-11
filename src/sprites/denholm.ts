import {GameScene} from "../scenes/gameScene";

export function setupDenholm(scene: GameScene) {
    const denholm = scene.physics.add.staticSprite(1000, 450, 'denholm').setScale(4);
    denholm.anims.create({
        key: 'talk',
        frames: scene.anims.generateFrameNumbers('denholm', {start: 0, end: 1}),
        frameRate: 8,
        repeat: -1,
    });
    denholm.anims.play('talk');
    scene.obstacles.add(denholm);
}
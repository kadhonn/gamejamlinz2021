import {GameScene} from "../../scenes/gameScene";

export function setupDenHolm(scene: GameScene, roomNr: number) {
    const denHolm = scene.physics.add.staticSprite(roomNr * 800, 450, 'denHolm').setScale(4);
    denHolm.anims.create({
        key: 'talk',
        frames: scene.anims.generateFrameNumbers('denHolm', {start: 0, end: 1}),
        frameRate: 8,
        repeat: -1,
    });
    denHolm.anims.play('talk');
    scene.obstacles.add(denHolm);
}
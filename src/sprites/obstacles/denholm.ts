import {GameScene, ROOM_WIDTH} from "../../scenes/gameScene";

export function setupDenholm(scene: GameScene, x: number) {
    const denholm = scene.physics.add.staticSprite(400 + x, 450, 'denholm').setScale(4);
    denholm.setBodySize(denholm.width * 2 * 4, denholm.height, true)

    denholm.anims.create({
        key: 'talk',
        frames: scene.anims.generateFrameNumbers('denholm', { start: 0, end: 1 }),
        frameRate: 8,
        repeat: -1,
    });
    denholm.anims.create({
        key: 'bag',
        frames: scene.anims.generateFrameNumbers('denholm', { start: 2, end: 3 }),
        frameRate: 8,
        repeat: -1,
    })

    denholm.anims.play('talk');

    scene.physics.add.collider(scene.roy.sprite, denholm, () => {
        const bubble = scene.createSpeechBubble(400 + x, 270, 120, 80, 'Bla Bla Bla')
    });

    scene.obstacles.add(denholm);
}
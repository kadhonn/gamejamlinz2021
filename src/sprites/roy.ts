import { GameScene } from "../scenes/gameScene";

export function setupRoy(scene: GameScene): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody {
    const roy = scene.physics.add.sprite(100, 480, 'roy').setScale(4).setDepth(-2);
    roy.setCollideWorldBounds(true);
    roy.body.setAllowGravity(false);

    roy.anims.create({
        key: 'right',
        frames: scene.anims.generateFrameNumbers('roy', { start: 3, end: 4 }),
        frameRate: 8,
        repeat: -1
    });

    roy.anims.create({
        key: 'shrug',
        frames: scene.anims.generateFrameNumbers('roy', { start: 0, end: 1 }),
        frameRate: 8,
        repeat: -1,
    });

    roy.anims.play('right', true);
    scene.physics.add.collider(roy, scene.obstacles, () => {
        roy.anims.play('shrug', true);
    });

    return roy;
}
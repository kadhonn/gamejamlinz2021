import { GameScene } from "../scenes/gameScene";

export function setupJen(scene: GameScene): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody {
    const jen = scene.physics.add.sprite(400, 320, 'jen').setScale(2).setDepth(2);
    jen.body.setAllowGravity(false);
    jen.anims.create({
        key: 'cry',
        frames: scene.anims.generateFrameNumbers('jen', { start: 0, end: 3 }),
        frameRate: 4,
        repeat: -1
    });

    jen.anims.create({
        key: 'left',
        frames: [{ key: 'jen', frame: 6 }],
        frameRate: 20
    });

    jen.anims.create({
        key: 'right',
        frames: [{ key: 'jen', frame: 7 }],
        frameRate: 20
    });

    return jen;
}
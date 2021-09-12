import { GameScene } from "../scenes/gameScene";

export function setupJen(scene: GameScene): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody {
    const jen = scene.physics.add.sprite(400, 320, 'jen').setScale(2).setDepth(2).refreshBody();
    jen.body.setAllowGravity(false);
    jen.anims.create({
        key: 'cry',
        frames: scene.anims.generateFrameNumbers('jen', { start: 0, end: 3 }),
        frameRate: 4,
        repeat: -1
    });

    jen.anims.create({
        key: 'talk',
        frames: scene.anims.generateFrameNumbers('jen', { start: 4, end: 5 }),
        frameRate: 4,
        repeat: -1
    });

    jen.anims.create({
        key: 'left',
        frames: [{ key: 'jen', frame: 7 }],
        frameRate: 20
    });

    jen.anims.create({
        key: 'right',
        frames: [{ key: 'jen', frame: 8 }],
        frameRate: 20
    });

    return jen;
}

export function updateFollower(scene: GameScene) {
    let screenFollowerX = scene.jen.x - scene.cameras.main.scrollX;
    let screenFollowerY = scene.jen.y - scene.cameras.main.scrollY;

    let xOffset = 0;
    if (scene.input.activePointer.x > screenFollowerX) {
        xOffset = -20;
        scene.jen.anims.play("right", true);
    } else {
        xOffset = 20;
        scene.jen.anims.play("left", true)
    }

    let deltaX = ((scene.input.activePointer.x + xOffset) - screenFollowerX);
    let deltaY = ((scene.input.activePointer.y + 30) - screenFollowerY);

    scene.jen.setVelocity(deltaX * 5, deltaY * 5)
}
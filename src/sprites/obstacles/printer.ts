import {GameScene, ROOM_WIDTH, SCALE} from "../../scenes/gameScene";

export function setupPrinter(scene: GameScene, x: number) {
    const printer = scene.physics.add.staticSprite(400 + x, 450, 'printer').setScale(SCALE);
    printer.anims.create({
        key: 'standard',
        frames: scene.anims.generateFrameNumbers('printer', {start: 0, end: 0}),
        frameRate: 8,
        repeat: -1,
    });

    printer.anims.create({
        key: 'burn',
        frames: scene.anims.generateFrameNumbers('printer', {start: 1, end: 3}),
        frameRate: 8,
        repeat: -1,
    });

    printer.anims.create({
        key: 'burn_down',
        frames: scene.anims.generateFrameNumbers('printer', {start: 4, end: 10}),
        frameRate: 8,
        repeat: 0,
    });

    printer.anims.create({
        key: 'gone',
        frames: scene.anims.generateFrameNumbers('printer', {start: 11, end: 12}),
        frameRate: 8,
        repeat: -1,
    });

    printer.anims.play('burn');
    scene.obstacles.add(printer);

    //
}
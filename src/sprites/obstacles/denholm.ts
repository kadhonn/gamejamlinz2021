import {GameScene, ROOM_WIDTH, SCALE} from "../../scenes/gameScene";

export function setupDenholm(scene: GameScene, x: number) {
    const denholm = scene.physics.add.staticSprite(400 + x, 450, 'denholm').setScale(SCALE);
    denholm.setBodySize(denholm.width * 2 * 4, denholm.height, true)

    denholm.anims.create({
        key: 'talk',
        frames: scene.anims.generateFrameNumbers('denholm', {start: 0, end: 1}),
        frameRate: 8,
        repeat: -1,
    });
    denholm.anims.create({
        key: 'bag',
        frames: scene.anims.generateFrameNumbers('denholm', {start: 2, end: 3}),
        frameRate: 8,
        repeat: -1,
    })

    denholm.anims.play('talk');

    let wearsPaperbag = false;
    scene.physics.add.collider(scene.player, denholm,
        () => {
            scene.player.anims.play('shrug', true);
            scene.createSpeechBubble(400 + x, 270, 120, 80, 'Bla Bla Bla');
        },
        () => {
            return !wearsPaperbag;
        });

    const paperbag = scene.physics.add.sprite(400 + roomNr * ROOM_WIDTH + 500, 400, 'paperbag')
        .setScale(SCALE)
        .setInteractive();
    paperbag.body.setAllowGravity(false);

    scene.input.setDraggable(paperbag)
    scene.input.on('drag', function (pointer, gameObject, dragX, dragY) {
        gameObject.x = dragX;
        gameObject.y = dragY;
    });

    const goalArea = scene.physics.add.sprite(410 + roomNr * ROOM_WIDTH, 400, 'paperbag')
        .setVisible(false)
        .setScale(SCALE);
    goalArea.body.setAllowGravity(false);

    scene.physics.add.overlap(goalArea, paperbag, () => {
        wearsPaperbag = true;
        paperbag.destroy();
        goalArea.destroy();
        denholm.anims.play('bag', true);
    });
}
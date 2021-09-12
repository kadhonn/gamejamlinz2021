import {GameScene, SCALE} from "../../scenes/gameScene";
import Sprite = Phaser.GameObjects.Sprite;

let wearsPaperbag = false;

export function setupDenholm(scene: GameScene, x: number) {
    const denholm = scene.physics.add.staticSprite(1000 + x, 450, 'denholm').setScale(SCALE);
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

    scene.physics.add.collider(scene.player, denholm,
        () => {
            scene.player.anims.play('shrug', true);
            scene.createSpeechBubble(denholm.x, 270, 120, 80, 'Bla Bla Bla');
        },
        () => {
            return !wearsPaperbag;
        });

    setupAvailableTools(scene, denholm);
}

function setupAvailableTools(scene: GameScene, denholm: Sprite) {
    const goalArea = scene.physics.add.sprite(denholm.x + 10, 400, 'paperbag')
        .setVisible(false)
        .setScale(SCALE);
    goalArea.body.setAllowGravity(false);

    const paperbag = setupTool(scene, denholm.x - 500, 'paperbag', () => {
        wearsPaperbag = true;
        paperbag.destroy();
        denholm.anims.play('bag', true);
    }, goalArea);

    setupTool(scene, denholm.x - 400, 'hammer', () => {
        scene.createSpeechBubble(denholm.x, 270, 120, 80, 'This is not a violent game!');
    }, goalArea);

    setupTool(scene, denholm.x - 300, 'choco', () => {
        scene.createSpeechBubble(denholm.x, 270, 120, 80, 'I gotta watch my figure!');
    }, goalArea);

    setupTool(scene, denholm.x - 200, 'money', () => {
        scene.createSpeechBubble(denholm.x, 270, 120, 80, 'What am I supposed to do with these peanuts');
    }, goalArea);
}

function setupTool(scene: GameScene, x: number, texture: string, onCollision: any, goalArea: Sprite) {
    scene.add.text(x - 20, 330, texture, {align: 'left', fontSize: '25', fontFamily: 'Mono'});

    const tool = scene.physics.add.sprite(x, 400, texture)
        .setScale(SCALE)
        .setInteractive();
    tool.body.setAllowGravity(false);

    scene.input.setDraggable(tool)
    scene.input.on('drag', function (pointer, gameObject, dragX, dragY) {
        gameObject.x = dragX;
        gameObject.y = dragY;
    });

    scene.physics.add.overlap(goalArea, tool, onCollision);
    return tool;
}

import { GameScene, SCALE } from "../../scenes/gameScene";
import { RoyState } from "../roy";
import { SpeechBubble } from "../speechBubble";
import Sprite = Phaser.GameObjects.Sprite;

let wearsPaperbag = false;
let denholmSpeechBubble: SpeechBubble

export function setupDenholm(scene: GameScene, x: number) {
    const denholm = scene.physics.add.staticSprite(1000 + x, 450, 'denholm').setScale(SCALE);
    denholm.setBodySize(denholm.width * 2 * SCALE, denholm.height, true) // to make roy stop a little before denholm

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

    scene.physics.add.collider(scene.roy.sprite, denholm,
        () => {
            console.log('Roy colliding with denham');
            scene.roy.updateState(RoyState.shrug)
            updateDenholmSpeechBubble('Bla Bla Bla', scene, denholm);
        },
        () => {
            return !wearsPaperbag;
        });

    setupAvailableTools(scene, denholm);
    scene.setupJenSaysTrigger(x, "Oh no, if the boss starts talking to Roy he will never stop! I need to distract him!");
    
    return denholm;
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
        updateDenholmSpeechBubble('Who has turned off the light?', scene, denholm)
        scene.roy.updateState(RoyState.walk)
    }, goalArea);

    setupTool(scene, denholm.x - 400, 'hammer', () => {
        if (!wearsPaperbag) {
            updateDenholmSpeechBubble('This is not a violent game!', scene, denholm)
        }
    }, goalArea);

    setupTool(scene, denholm.x - 300, 'choco', () => {
        if (!wearsPaperbag) {
            updateDenholmSpeechBubble('I gotta watch my figure!', scene, denholm);
        }
    }, goalArea);

    setupTool(scene, denholm.x - 200, 'money', () => {
        if (!wearsPaperbag) {
            updateDenholmSpeechBubble('What am I supposed to do with these peanuts', scene, denholm);
        }
    }, goalArea);
}

function setupTool(scene: GameScene, x: number, texture: string, onCollision: any, goalArea: Sprite) {
    scene.add.text(x - 20, 330, texture, { align: 'left', fontSize: '25', fontFamily: 'Mono' });

    const tool = scene.physics.add.sprite(x, 400, texture)
        .setScale(SCALE)
        .setInteractive();
    tool.body.setAllowGravity(false);

    scene.input.setDraggable(tool)
    scene.physics.add.overlap(goalArea, tool, onCollision);
    return tool;
}

export function updateDenholmSpeechBubble(speech: string, scene: GameScene, denholm: Sprite) {
    if (denholmSpeechBubble) {
        denholmSpeechBubble.destroy()
    }
    denholmSpeechBubble = scene.createSpeechBubble(denholm.x, 270, 120, 80, speech);
}

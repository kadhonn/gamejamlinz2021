import {GameScene, SCALE} from "../../scenes/gameScene";
import TimerEvent = Phaser.Time.TimerEvent;

export function setupInternet(scene: GameScene, x: number) {
    const moss = scene.physics.add.staticSprite(800 + x, 465, 'moss')
        .setScale(SCALE)
        .refreshBody();

    const theInternet = scene.physics.add.staticSprite(700 + x, 450, 'theInternet')
        .setScale(SCALE + 1)
        .refreshBody();
    theInternet.anims.create({
        key: 'alive',
        frames: scene.anims.generateFrameNumbers('theInternet', {start: 0, end: 1}),
        frameRate: 4,
        repeat: -1,
    });
    theInternet.anims.create({
        key: 'dying',
        frames: scene.anims.generateFrameNumbers('theInternet', {start: 2, end: 3}),
        frameRate: 8,
        repeat: -1,
    });
    theInternet.anims.create({
        key: 'dead',
        frames: scene.anims.generateFrameNumbers('theInternet', {start: 4, end: 4}),
        frameRate: 1,
        repeat: -1,
    });
    theInternet.anims.play('alive');

    scene.physics.add.collider(theInternet, scene.roy.sprite, () => {
        scene.roy.sayAndChill('Looks like we need to protect the internet again', 2000);
        scene.time.addEvent(new TimerEvent({
            repeat: -1,
            loop: true,
            delay: 400,
            callback: () => {
                generateElement(scene, x)
            }
        }))
    });

    scene.setupJenSaysTrigger(x, "We need to keep the internet up to date! Features should go in, but neither bugs no viruses must pass!");
}

const features = [];
const bugs = [];

function generateElement(scene: GameScene, xStart: number) {
    const xPosition = xStart + 200 + Math.random() * 1000;
    const type = getRandomType();

    const element = scene.physics.add.sprite(xPosition, -20, type)
        .setScale(SCALE)
        .setVelocity(-50 + Math.random() * 100, 100)
        .refreshBody();
    element.body.setAllowGravity(false);

    if (type === 'bug' || type === 'bug2' || type === 'virus') {
        bugs.push(element)
    } else {
        features.push(element);
    }
}

function getRandomType() {
    const type = Math.ceil(Math.random() * 6);
    if (type === 1) {
        return 'bug';
    } else if (type === 2) {
        return 'bug2';
    } else if (type === 3) {
        return 'virus';
    } else if (type === 4) {
        return 'butterfly';
    } else if (type === 5) {
        return 'butterfly2';
    } else if (type === 6) {
        return 'butterfly3';
    }
}

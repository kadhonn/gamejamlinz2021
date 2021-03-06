import { GameScene, SCALE } from "../../scenes/gameScene";
import TimerEvent = Phaser.Time.TimerEvent;
import Sprite = Phaser.GameObjects.Sprite;

let bugsCaughtText;
let bugsLostText;
let featuresText;
let theInternet: Sprite;
let SPAWN_BUGS = true;
let DYING= false;

export function setupInternet(scene: GameScene, x: number) {
    const moss = scene.physics.add.staticSprite(800 + x, 465, 'moss')
        .setScale(SCALE)
        .refreshBody();

    bugsLostText = scene.add.text(x + 200, 170, 'bugs gotten: 0', { fontSize: '32px' });
    featuresText = scene.add.text(x + 200, 200, 'features: 0', { fontSize: '32px' });

    theInternet = scene.physics.add.staticSprite(700 + x, 450, 'theInternet')
        .setScale(SCALE + 1)
        .refreshBody();
    theInternet.anims.create({
        key: 'alive',
        frames: scene.anims.generateFrameNumbers('theInternet', { start: 0, end: 1 }),
        frameRate: 4,
        repeat: -1,
    });
    theInternet.anims.create({
        key: 'dying',
        frames: scene.anims.generateFrameNumbers('theInternet', { start: 2, end: 3 }),
        frameRate: 8,
        repeat: -1,
    });
    theInternet.anims.create({
        key: 'dead',
        frames: scene.anims.generateFrameNumbers('theInternet', { start: 4, end: 4 }),
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
let bugsReceived = 0;
let featuresCaught = 0;

function generateElement(scene: GameScene, xStart: number) {
    const xPosition = xStart + 200 + Math.random() * 1000;
    const type = getRandomType();

    if (SPAWN_BUGS) {

        const element = scene.physics.add.sprite(xPosition, -20, type)
            .setScale(SCALE)
            .setVelocity(-50 + Math.random() * 100, 100)
            .setInteractive()
            .refreshBody();
        element.body.setAllowGravity(false);

        if (type === 'bug' || type === 'bug2' || type === 'virus') {
            bugs.push(element)
            element.once('pointerup', (pointer) => {
                // bugsAvoided++;
                // bugsCaughtText.setText(`bugs caught: ${bugsAvoided}`);
                console.log("catched a bug!");
                const index = bugs.indexOf((bug) => bug === element);
                bugs.splice(index, 1);
                element.destroy();
            });
        } else {
            features.push(element);
            element.once('pointerup', (pointer) => {
                // featuresCaught++;
                // featuresText.setText(`features: ${featuresCaught}`);
                console.log("added a feature!");
                const index = features.indexOf((feature) => feature === element);
                features.splice(index, 1);
                element.destroy();
            });
        }

        scene.time.addEvent(new TimerEvent({
            delay: 500,
            repeat: -1,
            loop: true,
            callback: () => {
                for (const idx in bugs) {
                    if (bugs[idx].y > 600) {
                        bugsReceived++;
                        bugsLostText.setText(`bugs gotten: ${bugsReceived}`);
                        bugs[idx].destroy();
                        bugs.splice(Number(idx), 1);
                    }
                }
                for (const idx in features) {
                    if (features[idx].y > 600) {
                        featuresCaught++;
                        featuresText.setText(`features: ${featuresCaught}`);
                        features[idx].destroy();
                        features.splice(Number(idx), 1);
                    }
                }
                if (bugsReceived > featuresCaught && !DYING) {
                    DYING = true;
                    theInternet.anims.play('dying')

                    scene.time.addEvent(new TimerEvent({
                        delay: 2000, callback: () => {
                            SPAWN_BUGS = false;
                            theInternet.anims.play('dead')
                            scene.roy.say("NOOOOOO OOOOOOO OOOOOOO", 20000);

                        }
                    }));
                }
            }
        }))
    }
}

function getRandomType() {
    const type = Math.ceil(Math.random() * 20);
    if (type >= 4 && type <= 10) {
        return 'bug';
    } else if (type >= 11 && type <= 14) {
        return 'bug2';
    } else if (type >= 15 && type <= 19) {
        return 'virus';
    } else if (type === 1) {
        return 'butterfly';
    } else if (type === 2) {
        return 'butterfly2';
    } else if (type === 3 || type === 20) {
        return 'butterfly3';
    }
}

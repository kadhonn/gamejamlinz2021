import {GameScene, SCALE} from "../../scenes/gameScene";
import {RoyState} from "../roy";
import TimerEvent = Phaser.Time.TimerEvent;

const LINE_HEIGHT = 6;
const LINE_WIDTH = 40;
const LINE_DISTANCE = 12;
let choices = [];
let timers = [];

function drawSingleProgress(scene: GameScene, canvas: any, progress: number, goal: number) {
    canvas.clear();
    for (let i = 0; i < 10; i++) {
        if (progress <= i) {
            canvas.fillStyle(0x333333, 1);
        } else {
            canvas.fillStyle(0x999999, 1);
        }

        if (i === goal) {
            canvas.lineStyle(4, 0x00ff00, 1);
            canvas.strokeRect(0, (10 - i) * LINE_DISTANCE, LINE_WIDTH, LINE_HEIGHT);
        } else {
            canvas.lineStyle(4, 0x000000, 1);
            canvas.strokeRect(0, (10 - i) * LINE_DISTANCE, LINE_WIDTH, LINE_HEIGHT);
        }
        canvas.fillRect(0, (10 - i) * LINE_DISTANCE, LINE_WIDTH, LINE_HEIGHT);
    }
}

function drawProgress(scene: GameScene, xStart: number, yStart: number) {
    const goal = Math.floor(Math.random() * 10);
    let progress = 0;
    const area = scene.add.graphics({x: xStart, y: yStart})
    const loop = new TimerEvent({
        delay: 200 + Math.random() * 50,
        repeat: -1,
        loop: true,
        callback: () => {
            if (progress < 10) {
                progress++;
            } else {
                progress = 0;
            }
            drawSingleProgress(scene, area, progress, goal);
        }
    });
    timers.push(loop);
    scene.time.addEvent(loop);
    return () => {
        const diff = Math.abs(goal - progress);
        loop.paused = true;

        if (diff === 0) {
            choices.push(50);
        } else if (diff === 1 || diff === 10) {
            choices.push(30);
        } else if (diff === 2 || diff === 9) {
            choices.push(10);
        } else if (diff === 3 || diff === 7) {
            choices.push(-10);
        } else if (diff === 4 || diff === 6) {
            choices.push(-30);
        } else {
            choices.push(-50);
        }
        handleChoiceUpdate(scene);
    };
}

function drawScale(scene: GameScene, x: number, label: string) {
    scene.createText(x, 240, label);
    const stopLoop = drawProgress(scene, x, 250);
    scene.createButton(x, 220, 'CHOOSE', stopLoop);
}

function drawScales(scene: GameScene, x: number) {
    scene.roy.updateState(RoyState.chill)
    choices = [];
    drawScale(scene, 900 + x, 'COFFEE');
    drawScale(scene, 900 + x + 70, 'SUGAR');
    drawScale(scene, 900 + x + 140, 'MILK');
}

let coffeeAccepted = false;
function handleChoiceUpdate(scene: GameScene) {
    if (choices.length >= 3) {
        const score = choices.map((it) => it * 0.33).reduce((a, b) => a + b, 0);
        if (score < 0) {
            scene.roy.say('This is disgusting, try again!', 2000);
            scene.jen.sprite.anims.play('cry', false);
            choices = [];
            for (let singleTimer of timers) {
                singleTimer.paused = false;
            }
        } else {
            scene.roy.say('Great thanks Jen!', 2000);
            scene.time.addEvent(new TimerEvent({
                delay: 2000, callback: () => scene.increaseSpeed(score)
            }))
            coffeeAccepted = true;
        }
    }
}

export function setupCoffeeMachine(scene: GameScene, x: number) {
    const entryArea = scene.physics.add.staticSprite(x + 300, 450, 'paperbag')
        .setScale(SCALE)
        .refreshBody()
        .setVisible(false);
    let entryAnimation = false;
    scene.physics.add.collider(scene.roy.sprite, entryArea,
        () => {
            if (!entryAnimation) {
                entryAnimation = true;
                scene.roy.say('Jen, could you make me a coffee?', 2000);
                drawScales(scene, x);
            }
        },
        () => {
            return !entryAnimation;
        })

    const coffeeTable = scene.physics.add.staticSprite(1000 + x, 450, 'coffeeTable')
        .setScale(SCALE + 1)
        .refreshBody();
    coffeeTable.anims.create({
        key: 'brew',
        frames: scene.anims.generateFrameNumbers('coffeeTable', {start: 0, end: 1}),
        frameRate: 16,
        repeat: -1,
    });
    coffeeTable.anims.play('brew');

    scene.physics.add.collider(scene.roy.sprite, coffeeTable,
        () => {
            console.log('roy colliding with coffee machine');
        },
        () => {
            return !coffeeAccepted;
        });

    scene.setupJenSaysTrigger(x, "Roy can never choose which coffee to make... if I make the correct one maybe he will go faster?");
}

import {GameScene, ROOM_WIDTH, SCALE} from "../../scenes/gameScene";
import TimerEvent = Phaser.Time.TimerEvent;

const LINE_HEIGHT = 6;
const LINE_WIDTH = 40;
const LINE_DISTANCE = 12;
const choices = [];

function drawSingleProgress(scene: GameScene, xStart: number, yStart: number, progress: number, goal: number) {
    const line = scene.add.graphics({x: xStart, y: yStart});
    for (let i = 0; i < 10; i++) {
        if (progress <= i) {
            line.fillStyle(0x333333, 1);
        } else {
            line.fillStyle(0x999999, 1);
        }

        if (i === goal) {
            line.lineStyle(4, 0x00ff00, 1);
            line.strokeRect(0, (10 - i) * LINE_DISTANCE, LINE_WIDTH, LINE_HEIGHT);
        } else {
            line.lineStyle(4, 0x000000, 1);
            line.strokeRect(0, (10 - i) * LINE_DISTANCE, LINE_WIDTH, LINE_HEIGHT);
        }
        line.fillRect(0, (10 - i) * LINE_DISTANCE, LINE_WIDTH, LINE_HEIGHT);
    }
}

function drawProgress(scene: GameScene, xStart: number, yStart: number) {
    const goal = Math.floor(Math.random() * 10);
    let progress = 0;
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
            drawSingleProgress(scene, xStart, yStart, progress, goal);
        }
    });
    scene.time.addEvent(loop);
    return () => {
        const diff = Math.abs(goal - progress);
        loop.reset({loop: false});
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
    };
}

function drawScale(scene: GameScene, x: number, label: string) {
    scene.createText(x, 240, label);
    const stopLoop = drawProgress(scene, x, 250);
    scene.createButton(x, 220, 'CHOOSE', stopLoop);
}

export function setupCoffeeMachine(scene: GameScene, roomNr: number) {
    const coffeeTable = scene.physics.add.staticSprite(1000 + roomNr * ROOM_WIDTH, 450, 'coffeeTable').setScale(SCALE + 1).refreshBody();
    coffeeTable.anims.create({
        key: 'brew',
        frames: scene.anims.generateFrameNumbers('coffeeTable', {start: 0, end: 1}),
        frameRate: 16,
        repeat: -1,
    });
    coffeeTable.anims.play('brew');

    let drawingStarted = false;
    let speedIncreaseApplied = false;
        scene.physics.add.collider(scene.player, coffeeTable,
        () => {
            if (!drawingStarted) {
                scene.player.anims.play('chill', true);
                drawScale(scene, 900 + roomNr * ROOM_WIDTH, 'COFFEE');
                drawScale(scene, 900 + roomNr * ROOM_WIDTH + 70, 'SUGAR');
                drawScale(scene, 900 + roomNr * ROOM_WIDTH + 140, 'MILK');
                drawingStarted = true;
            }
        },
        () => {
            if (choices.length >= 3 && !speedIncreaseApplied) {
                scene.player.anims.play('right', true);
                scene.increaseSpeed(choices.map((it) => it * 0.33).reduce((a, b) => a + b, 0));
                speedIncreaseApplied = true;
            }
            return choices.length < 3;
        });

}

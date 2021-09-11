import {GameScene} from "../../scenes/gameScene";

export function setupCoffeeMachine(scene: GameScene, roomNr: number) {
    const coffeeTable = scene.physics.add.staticSprite(400 + roomNr * 800, 450, 'coffeeTable').setScale(5).refreshBody();
    coffeeTable.anims.create({
        key: 'brew',
        frames: scene.anims.generateFrameNumbers('coffeeTable', {start: 0, end: 1}),
        frameRate: 16,
        repeat: -1,
    });
    coffeeTable.anims.play('brew');
    scene.obstacles.add(coffeeTable);

    scene.physics.add.overlap(scene.player, coffeeTable, () => {
       // TODO start coffee challenge game
    });

}
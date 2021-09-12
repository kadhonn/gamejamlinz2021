import { GameScene, ROOM_WIDTH, SCALE } from "../../scenes/gameScene";

export function setupPrinterRoom(scene: GameScene, x:number) {
    const printer = new Printer(scene, x);
}

class Printer {

    scene: GameScene;
    printerSprite: Phaser.Types.Physics.Arcade.SpriteWithStaticBody;
    fireExtinguisherSprite: Phaser.Types.Physics.Arcade.SpriteWithStaticBody;
    fireExtinguisherSpraySprite: Phaser.Types.Physics.Arcade.SpriteWithStaticBody;

    constructor(scene: GameScene, x: number) {
        this.scene = scene;

        this.printerSprite = this.setupPrinter(scene, x);
        this.fireExtinguisherSprite = this.setupFireExtinguisher(scene, x);
        this.fireExtinguisherSpraySprite = this.setupFireExtinguisherSpray(scene, x);
        this.fireExtinguisherSpraySprite.setVisible(false)
    }

    setupPrinter(scene: GameScene, x: number) {
        const printerSprite = scene.physics.add.staticSprite(1000 + x, 450, 'printer').setScale(SCALE);
        printerSprite.anims.create({
            key: 'standard',
            frames: scene.anims.generateFrameNumbers('printer', { start: 0, end: 0 }),
            frameRate: 8,
            repeat: -1,
        });

        printerSprite.anims.create({
            key: 'burn',
            frames: scene.anims.generateFrameNumbers('printer', { start: 1, end: 3 }),
            frameRate: 8,
            repeat: -1,
        });

        printerSprite.anims.create({
            key: 'burn_down',
            frames: scene.anims.generateFrameNumbers('printer', { start: 4, end: 10 }),
            frameRate: 8,
            repeat: 0,
        });

        printerSprite.anims.create({
            key: 'gone',
            frames: scene.anims.generateFrameNumbers('printer', { start: 11, end: 12 }),
            frameRate: 8,
            repeat: -1,
        });

        printerSprite.anims.play('burn');
        
        return printerSprite;
    }

    setupFireExtinguisher(scene: GameScene, x: number) {
        const fireExtinguisherSprite = scene.physics.add.staticSprite(400 + x, 450, 'fireExtinguisher').setScale(SCALE);
        return fireExtinguisherSprite;
    }
    
    setupFireExtinguisherSpray(scene: GameScene, x: number) {
        const fireExtinguisherSpraySprite = scene.physics.add.staticSprite(400 + x, 450, 'fireExtinguisherSpray').setScale(SCALE);

        fireExtinguisherSpraySprite.anims.create({
            key: 'spray',
            frames: scene.anims.generateFrameNumbers('fireExtinguisherSpray', { start: 0, end: 2 }),
            frameRate: 8,
            repeat: -1,
        });

        fireExtinguisherSpraySprite.anims.play('spray');
        
        return fireExtinguisherSpraySprite;
    }
}
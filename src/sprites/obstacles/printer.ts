import { GameScene, ROOM_WIDTH, SCALE } from "../../scenes/gameScene";
import Sprite = Phaser.GameObjects.Sprite;

export function setupPrinterRoom(scene: GameScene, x: number) {
    const printer = new Printer(scene, x);
}

const SPRAY_X_OFFSET = 52;
const SPRAY_Y_OFFSET = -30;
let STARTED_EXTINGUISHING = false;

class Printer {

    scene: GameScene;
    printerSprite: Phaser.Types.Physics.Arcade.SpriteWithStaticBody;
    fireExtinguisherSprite: Phaser.Types.Physics.Arcade.SpriteWithStaticBody;
    fireExtinguisherSpraySprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

    constructor(scene: GameScene, x: number) {
        this.scene = scene;

        this.printerSprite = this.setupPrinter(scene, x);
        this.fireExtinguisherSpraySprite = this.setupFireExtinguisherSpray(scene, x);
        this.fireExtinguisherSpraySprite.setVisible(false)
        this.fireExtinguisherSprite = this.setupFireExtinguisher(scene, x, this.fireExtinguisherSpraySprite);

        scene.physics.add.collider(this.printerSprite, this.fireExtinguisherSpraySprite,
            () => {
                console.log('Extinguishing fire!');
                STARTED_EXTINGUISHING = true
                this.printerSprite.anims.play('burn_down');
                this.printerSprite.once('animationcomplete', function () {
                    this.anims.play('gone');
                }, this.printerSprite);
            },
            () => {
                return !STARTED_EXTINGUISHING
            }
        );
    }

    setupPrinter(scene: GameScene, x: number) {
        const printerSprite = scene.physics.add.staticSprite(1000 + x, 450, 'printer').setScale(SCALE);
        printerSprite.refreshBody()

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
            frameRate: 4,
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

    setupFireExtinguisher(scene: GameScene, x: number, fireExtinguisherSpraySprite: Sprite) {
        const fireExtinguisherSprite = scene.physics.add.staticSprite(400 + x, 450, 'fireExtinguisher').setScale(SCALE);
        fireExtinguisherSprite.refreshBody()
        fireExtinguisherSprite.setInteractive();

        scene.input.setDraggable(fireExtinguisherSprite)

        scene.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            if (gameObject == fireExtinguisherSprite) {
                fireExtinguisherSpraySprite.x = dragX + SPRAY_X_OFFSET
                fireExtinguisherSpraySprite.y = dragY + SPRAY_Y_OFFSET
            }
        });
        scene.input.on('dragstart', function (pointer, gameObject) {
            if (gameObject == fireExtinguisherSprite) {
                fireExtinguisherSpraySprite.setVisible(true)
            }
        });
        scene.input.on('dragend', function (pointer, gameObject) {
            if (gameObject == fireExtinguisherSprite) {
                fireExtinguisherSpraySprite.setVisible(false)
            }
        });

        return fireExtinguisherSprite;
    }

    setupFireExtinguisherSpray(scene: GameScene, x: number) {
        const fireExtinguisherSpraySprite = scene.physics.add.sprite(400 + x + SPRAY_X_OFFSET, 450 + SPRAY_Y_OFFSET, 'fireExtinguisherSpray').setScale(SCALE);
        fireExtinguisherSpraySprite.refreshBody()
        fireExtinguisherSpraySprite.body.setAllowGravity(false);

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
import { Scene } from "phaser";
import { setupErrorPC, updateError } from "../sprites/obstacles/error";
import { setupDenholm } from "../sprites/obstacles/denholm";
import { setupCoffeeMachine } from "../sprites/obstacles/coffeeMachine";
import { setupJen, updateFollower } from "../sprites/jen";
import { Roy, setupRoy } from "../sprites/roy";
import { SpeechBubble } from "../sprites/speechBubble";
import { createButton } from "../sprites/button";
import { setupPrinterRoom } from "../sprites/obstacles/printer";

export const ROOM_WIDTH = 1400;
export const ROOM_HEIGHT = 600;
export const ROOM_COUNT = 4;
export const BASE_SPEED = 150;

export const SCALE = 4;

export class GameScene extends Scene {

    roy: Roy
    jen: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    obstacles: Phaser.Physics.Arcade.StaticGroup;
    gameOver = false;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    speed = BASE_SPEED;
    currentCameraRoom = 0;

    createButton = createButton

    preload() {
        this.load.image('moss', 'assets/moss.jpg');
        this.load.image('room1', 'assets/room1_400x300.png');
        this.load.image('paperbag', 'assets/paperbag_11x13.png');
        this.load.image('hammer', 'assets/hammer.png');
        this.load.image('money', 'assets/money.png');
        this.load.image('choco', 'assets/choco.png');
        this.load.spritesheet('roy', 'assets/roy_20x39.png', { frameWidth: 20, frameHeight: 39 });
        this.load.spritesheet('jen', 'assets/jen_25x51.png', { frameWidth: 25, frameHeight: 51 });
        this.load.spritesheet('denholm', 'assets/denholm_33x50.png', { frameWidth: 33, frameHeight: 50 });
        this.load.spritesheet('postit', 'assets/postit_5x5.png', { frameWidth: 5, frameHeight: 5 });
        this.load.spritesheet('theInternet', 'assets/the_internet_17x14.png', { frameWidth: 17, frameHeight: 14 });
        this.load.spritesheet('pcError', 'assets/pc_error_40x38.png', { frameWidth: 40, frameHeight: 38 });
        this.load.spritesheet('coffeeTable', 'assets/coffee_table_40x38.png', { frameWidth: 40, frameHeight: 38 });
        this.load.spritesheet('printer', 'assets/printer_28x40.png', { frameWidth: 28, frameHeight: 40 });
        this.load.image('fireExtinguisher', 'assets/fire_extinguisher_13x21.png');
        this.load.spritesheet('fireExtinguisherSpray', 'assets/fire_extinguisher_spray_12x12.png', { frameWidth: 12, frameHeight: 12 });
    }

    create() {
        this.obstacles = this.physics.add.staticGroup();
        this.cursors = this.input.keyboard.createCursorKeys();

        this.roy = new Roy(this);
        this.jen = setupJen(this);

        this.roy.say('Please Jen, help me get through the office', 2000);

        let x = 0;
        x = this.addRoom(x);
        setupPrinterRoom(this, x);
        x = this.addRoom(x);
        setupDenholm(this, x);
        x = this.addRoom(x);
        setupErrorPC(this, x);
        x = this.addRoom(x);
        setupCoffeeMachine(this, x);
        x = this.addRoom(x);

        this.physics.world.setBounds(0, 0, x, ROOM_HEIGHT)

        this.cameras.main.scrollX = 0;
    }

    update() {
        if (this.gameOver) {
            return;
        }

        updateFollower(this);
        updateError(this);
        this.updateCamera();
    }

    addRoom(x: number, roomWidth = ROOM_WIDTH) {
        let imageName = 'room1';
        let imageWidth = 400;
        let imageHeight = 300;
        let scale = ROOM_HEIGHT / imageHeight;
        let doorOffsetLeft = 22;
        let roomMiddleTileStart = 100;
        let roomMiddleTileEnd = 300;
        let doorOffsetRight = imageWidth - 22;

        this.add.image(x, ROOM_HEIGHT / 2, imageName).setCrop(0, 0, doorOffsetLeft, imageHeight).setScale(scale).setDepth(-1).setDisplayOrigin(0, imageHeight / 2);
        this.add.image(x + doorOffsetLeft * scale, ROOM_HEIGHT / 2, imageName).setCrop(doorOffsetLeft, 0, roomMiddleTileStart, imageHeight).setScale(scale).setDepth(-10).setDisplayOrigin(doorOffsetLeft, imageHeight / 2);


        for (let i = roomMiddleTileStart * scale; i < roomWidth - (imageWidth - roomMiddleTileEnd) * scale; i += (roomMiddleTileEnd - roomMiddleTileStart) * scale) {
            this.add.image(x + i, ROOM_HEIGHT / 2, imageName).setCrop(roomMiddleTileStart, 0, roomMiddleTileEnd - roomMiddleTileStart, imageHeight).setScale(scale).setDepth(-10).setDisplayOrigin(roomMiddleTileStart, imageHeight / 2);
        }

        this.add.image(x + roomWidth - (imageWidth - doorOffsetRight) * scale, ROOM_HEIGHT / 2, imageName).setCrop(roomMiddleTileEnd, 0, doorOffsetRight - roomMiddleTileEnd, imageHeight).setScale(scale).setDepth(-10).setDisplayOrigin(doorOffsetRight, imageHeight / 2);
        this.add.image(x + roomWidth, ROOM_HEIGHT / 2, imageName).setCrop(doorOffsetRight, 0, imageWidth - doorOffsetRight, imageHeight).setScale(scale).setDepth(-1).setDisplayOrigin(imageWidth, imageHeight / 2);

        return x + roomWidth;
    }

    createText(x: number, y: number, text: string) {
        this.add.text(x, y, text, { fontFamily: 'Monaco', fontSize: '40', color: '#000000', align: 'center' });
    }

    increaseSpeed(deltaSpeed: number) {
        console.log("increase speed by " + deltaSpeed);
        this.roy.increaseSpeedBy(deltaSpeed);
        this.time.addEvent({
            delay: 3000,
            callback: () => {
                this.roy.resetSpeed();
            }
        })
    }

    createSpeechBubble(x: number, y: number, width: number, height: number, quote: string) {
        return new SpeechBubble(this, x, y, width, height, quote)
    }

    updateCamera() {
        if (this.roy.sprite.x > (this.currentCameraRoom + 1) * ROOM_WIDTH) {
            this.currentCameraRoom++;
            let newX = this.currentCameraRoom * ROOM_WIDTH + ROOM_WIDTH / 2;
            this.cameras.main.pan(newX, ROOM_HEIGHT / 2, 600, "Sine");
        }
    }
}


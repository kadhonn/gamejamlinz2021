import { Scene } from "phaser";
import { setupErrorPC } from "../sprites/obstacles/error";
import { setupDenholm } from "../sprites/obstacles/denholm";
import { setupCoffeeMachine } from "../sprites/obstacles/coffeeMachine";
import { setupJen } from "../sprites/jen";
import { setupRoy } from "../sprites/roy";
import { createSpeechBubble } from "../sprites/speechBubble";
import {createButton} from "../sprites/button";

export const ROOM_WIDTH = 1400;
export const ROOM_HEIGHT = 600;
export const ROOM_COUNT = 4;
export const BASE_SPEED = 150;

export const SCALE = 4;

export class GameScene extends Scene {

    player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    jen: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    obstacles: Phaser.Physics.Arcade.StaticGroup;
    gameOver = false;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    speed = BASE_SPEED;

    createSpeechBubble = createSpeechBubble
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
    }

    create() {
        this.physics.world.setBounds(0, 0, ROOM_WIDTH * ROOM_COUNT, ROOM_HEIGHT)


        this.obstacles = this.physics.add.staticGroup();
        this.cursors = this.input.keyboard.createCursorKeys();

        this.player = setupRoy(this);
        this.jen = setupJen(this);

        let x = 0;
        x = this.addRoom(x);
        setupDenholm(this, x);
        x = this.addRoom(x);
        setupErrorPC(this, x);
        x = this.addRoom(x);
        setupCoffeeMachine(this, x);
        x = this.addRoom(x);

    }

    update() {
        if (this.gameOver) {
            return;
        }
        this.player.setVelocityX(this.speed);

        let oldCameraScrollX = this.cameras.main.scrollX;
        this.cameras.main.scrollX = this.player.x - 200;
        this.jen.x += this.cameras.main.scrollX - oldCameraScrollX;

        this.updateFollower();
    }

    updateFollower() {
        let screenFollowerX = this.jen.x - this.cameras.main.scrollX;
        let screenFollowerY = this.jen.y - this.cameras.main.scrollY;

        let xOffset = 0;
        if (this.input.activePointer.x > screenFollowerX) {
            xOffset = -20;
            this.jen.anims.play("right", true);
        } else {
            this.jen.anims.play("left", true)
            xOffset = 20;
        }

        let deltaX = ((this.input.activePointer.x + xOffset) - screenFollowerX) / 10;
        let deltaY = ((this.input.activePointer.y + 30) - screenFollowerY) / 10;

        this.jen.x = screenFollowerX + deltaX + this.cameras.main.scrollX;
        this.jen.y = screenFollowerY + deltaY + this.cameras.main.scrollY;
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
        this.add.text(x, y, text, { fontFamily: 'Monaco', fontSize: '40', color: '#000000', align: 'center'});
    }

    increaseSpeed(deltaSpeed: number) {
        console.log("increase speed by " + deltaSpeed);
        this.speed += deltaSpeed;
        this.time.addEvent({
            delay: 3000,
            callback: () => {
                this.speed = BASE_SPEED;
            }
        })
    }

}


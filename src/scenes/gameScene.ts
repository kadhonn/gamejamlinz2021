import { Scene } from "phaser";
import { setupErrorPC } from "../sprites/obstacles/error";
import { setupDenholm } from "../sprites/obstacles/denholm";
import { setupCoffeeMachine } from "../sprites/obstacles/coffeeMachine";
import { setupJen } from "../sprites/jen";
import { setupRoy } from "../sprites/roy";


export class GameScene extends Scene {

    player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    jen: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    obstacles: Phaser.Physics.Arcade.StaticGroup;
    gameOver = false;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;

    preload() {
        this.load.image('moss', 'assets/moss.jpg');
        this.load.image('room1', 'assets/room1_400x300.png');
        this.load.spritesheet('roy', 'assets/roy_20x39.png', { frameWidth: 20, frameHeight: 39 });
        this.load.spritesheet('jen', 'assets/jen_25x51.png', { frameWidth: 25, frameHeight: 51 });
        this.load.spritesheet('denholm', 'assets/denholm_33x50.png', {frameWidth: 33, frameHeight: 50});
        this.load.spritesheet('postit', 'assets/postit_5x5.png', { frameWidth: 5, frameHeight: 5 });
        this.load.spritesheet('theInternet', 'assets/the_internet_17x14.png', { frameWidth: 17, frameHeight: 14 });
        this.load.spritesheet('pcError', 'assets/pc_error_40x38.png', { frameWidth: 40, frameHeight: 38 });
        this.load.spritesheet('coffeeTable', 'assets/coffee_table_40x38.png', { frameWidth: 40, frameHeight: 38 });
    }

    create() {
        this.physics.world.setBounds(0, 0, 2400, 600)

        for (let i = 0; i < 10; i++) {
            this.addRoom(i);
        }

        this.obstacles = this.physics.add.staticGroup();
        this.cursors = this.input.keyboard.createCursorKeys();

        this.player = setupRoy(this);
        this.jen = setupJen(this);

        setupDenholm(this, 3);
        setupErrorPC(this, 2);
        setupCoffeeMachine(this, 1);

    }

    update() {
        if (this.gameOver) {
            return;
        }
        this.player.setVelocityX(150);

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

    addRoom(i: number) {
        let x = i * 800;
        let imageWidth = 400;
        let doorOffsetLeft = 22;
        let doorOffsetRight = 22;
        this.add.image(x, 300, 'room1').setCrop(0, 0, doorOffsetLeft, 300).setScale(2).setDepth(-1).setOrigin(0, 0.5);
        this.add.image(x + 400, 300, 'room1').setCrop(doorOffsetLeft, 0, imageWidth - doorOffsetRight, 300).setScale(2).setDepth(-10).setOrigin(0.5, 0.5);
        this.add.image(x + 800, 300, 'room1').setCrop(imageWidth - doorOffsetRight, 0, imageWidth, 300).setScale(2).setDepth(-1).setOrigin(1, 0.5);
    }
}


import {Scene} from "phaser";
import {setupErrorPC} from "../sprites/obstacles/error";
import {setupDenholm} from "../sprites/obstacles/denholm";
import {setupCoffeeMachine} from "../sprites/obstacles/coffeeMachine";

export class GameScene extends Scene {

    player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    follower: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    obstacles: Phaser.Physics.Arcade.StaticGroup;
    gameOver = false;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;

    preload() {
        this.load.image('moss', 'assets/moss.jpg');
        this.load.image('room1', 'assets/room1_400x300.png');
        this.load.spritesheet('roy', 'assets/roy_20x39.png', { frameWidth: 20, frameHeight: 39 });
        this.load.spritesheet('jen', 'assets/jen_25x51.png', { frameWidth: 25, frameHeight: 51 });
        this.load.spritesheet('denholm', 'assets/denholm_33x50.png', {frameWidth: 33, frameHeight: 50});
        this.load.spritesheet('pc_error', 'assets/pc_error_40x38.png', {frameWidth: 40, frameHeight: 38});
        this.load.spritesheet('postit', 'assets/postit_5x5.png', {frameWidth: 5, frameHeight: 5});
        this.load.spritesheet('theInternet', 'assets/the_internet_17x14.png', {frameWidth: 17, frameHeight: 14});
        this.load.spritesheet('pcError', 'assets/pc_error_40x38.png', {frameWidth: 40, frameHeight: 38});
        this.load.spritesheet('coffeeTable', 'assets/coffee_table_40x38.png', {frameWidth: 40, frameHeight: 38});
    }

    create() {
        this.physics.world.setBounds(0, 0, 2400, 600)

        for (let i = 0; i < 10; i++) {
            this.addRoom(i);
        }

        this.obstacles = this.physics.add.staticGroup();
        setupDenholm(this, 3);
        setupErrorPC(this, 2);
        setupCoffeeMachine(this, 1);

        // ROY SETUP
        this.player = this.physics.add.sprite(100, 480, 'roy').setScale(4).setDepth(-2);
        this.player.setCollideWorldBounds(true);
        this.player.body.setAllowGravity(false);

        this.player.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('roy', { start: 3, end: 4 }),
            frameRate: 8,
            repeat: -1
        });

        this.player.anims.create({
            key: 'shrug',
            frames: this.anims.generateFrameNumbers('roy', { start: 0, end: 1 }),
            frameRate: 8,
            repeat: -1,
        });

        this.player.anims.play('right', true);
        this.physics.add.collider(this.player, this.obstacles, () => {
            this.player.anims.play('shrug', true);
        });

        // JEN SETUP
        this.follower = this.physics.add.sprite(400, 320, 'jen').setScale(2).setDepth(2);
        this.follower.body.setAllowGravity(false);
        this.follower.anims.create({
            key: 'cry',
            frames: this.anims.generateFrameNumbers('jen', { start: 0, end: 3 }),
            frameRate: 4,
            repeat: -1
        });

        this.follower.anims.create({
            key: 'left',
            frames: [{ key: 'jen', frame: 6 }],
            frameRate: 20
        });

        this.follower.anims.create({
            key: 'right',
            frames: [{ key: 'jen', frame: 7 }],
            frameRate: 20
        });

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    addRoom(i: number) {
        let x = i * 800;
        let offset = 22;
        this.add.image(x, 300, 'room1').setCrop(0, 0, offset, 300).setScale(2).setDepth(-1).setOrigin(0, 0.5);
        this.add.image(x + 400, 300, 'room1').setCrop(offset, 0, 400 - offset, 300).setScale(2).setDepth(-10).setOrigin(0.5, 0.5);
        this.add.image(x + 800, 300, 'room1').setCrop(400 - offset, 0, 400, 300).setScale(2).setDepth(-1).setOrigin(1, 0.5);
    }

    update() {
        if (this.gameOver) {
            return;
        }
        this.player.setVelocityX(150);

        let oldCameraScrollX = this.cameras.main.scrollX;
        this.cameras.main.scrollX = this.player.x - 200;
        this.follower.x += this.cameras.main.scrollX - oldCameraScrollX;

        this.updateFollower();
    }

    updateFollower() {
        let screenFollowerX = this.follower.x - this.cameras.main.scrollX;
        let screenFollowerY = this.follower.y - this.cameras.main.scrollY;

        let xOffset = 0;
        if (this.input.activePointer.x > screenFollowerX) {
            xOffset = -20;
            this.follower.anims.play("right", true);
        } else {
            this.follower.anims.play("left", true)
            xOffset = 20;
        }

        let deltaX = ((this.input.activePointer.x + xOffset) - screenFollowerX) / 10;
        let deltaY = ((this.input.activePointer.y + 30) - screenFollowerY) / 10;

        this.follower.x = screenFollowerX + deltaX + this.cameras.main.scrollX;
        this.follower.y = screenFollowerY + deltaY + this.cameras.main.scrollY;
    }
}


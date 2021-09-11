import {Scene} from "phaser";

export class GameScene extends Scene {

    player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    follower: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    platforms: Phaser.Physics.Arcade.StaticGroup;
    gameOver = false;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;

    preload() {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.spritesheet('roy', 'assets/roy_20x39.png', {frameWidth: 20, frameHeight: 39});
        this.load.spritesheet('jen', 'assets/jen_25x51.png', {frameWidth: 25, frameHeight: 51});
    }

    create() {
        this.physics.world.setBounds(0, 0, 2400, 600)

        for (let i = 0; i < 10; i++) {
            this.add.image(i * 800, 300, 'sky');
        }

        this.platforms = this.physics.add.staticGroup();
        for (let i = 0; i < 10; i++) {
            this.platforms.create(400 + i * 800, 568, 'ground').setScale(2).refreshBody();
        }
        this.platforms.create(600, 400, 'ground');
        this.platforms.create(50, 250, 'ground');
        this.platforms.create(750, 220, 'ground');

        // ROY SETUP

        this.player = this.physics.add.sprite(100, 450, 'roy').setScale(4);
        this.player.setCollideWorldBounds(true);

        this.player.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('roy', {start: 3, end: 4}),
            frameRate: 8,
            repeat: -1
        });

        this.player.anims.create({
            key: 'shrug',
            frames: this.anims.generateFrameNumbers('roy', {start: 0, end: 2}),
            frameRate: 8,
            repeat: -1,
        });

        this.physics.add.collider(this.player, this.platforms);

        // JEN SETUP
        this.follower = this.physics.add.sprite(400, 320, 'jen').setScale(2);
        this.follower.body.setAllowGravity(false);
        this.follower.anims.create({
            key: 'cry',
            frames: this.anims.generateFrameNumbers('jen', {start: 0, end: 3}),
            frameRate: 4,
            repeat: -1
        });

        this.follower.anims.create({
            key: 'left',
            frames: [{key: 'jen', frame: 6}],
            frameRate: 20
        });

        this.follower.anims.create({
            key: 'right',
            frames: [{key: 'jen', frame: 7}],
            frameRate: 20
        });

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        if (this.gameOver) {
            return;
        }
        this.player.setVelocityX(150);
        this.player.anims.play('right', true);

        let oldCameraScrollX = this.cameras.main.scrollX;
        this.cameras.main.scrollX = this.player.x - 200;
        this.follower.x += this.cameras.main.scrollX - oldCameraScrollX;

        this.updateFollower();
    }

    updateFollower() {
        let screenFollowerX = this.follower.x - this.cameras.main.scrollX;
        let screenFollowerY = this.follower.y - this.cameras.main.scrollY;

        let deltaX = (this.input.activePointer.x - screenFollowerX) / 10;
        let deltaY = (this.input.activePointer.y - screenFollowerY) / 10;

        if (this.cursors.down.isDown) {
            this.follower.anims.play("cry", true);
        } else if (deltaX > 0) {
            this.follower.anims.play("right", true);
        } else {
            this.follower.anims.play("left", true)
        }

        this.follower.x = screenFollowerX + deltaX + this.cameras.main.scrollX;
        this.follower.y = screenFollowerY + deltaY + this.cameras.main.scrollY;
    }
}


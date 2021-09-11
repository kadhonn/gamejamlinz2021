import { Scene } from "phaser";

export class GameScene extends Scene {

    player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    platforms: Phaser.Physics.Arcade.StaticGroup;
    gameOver = false;


    preload() {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('moss', 'assets/moss.jpg');
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

        this.player = this.physics.add.sprite(100, 450, 'moss');

        this.player.setCollideWorldBounds(true);

        this.physics.add.collider(this.player, this.platforms);
    }

    update() {
        if (this.gameOver) {
            return;
        }
        this.player.setVelocityX(150);
        this.cameras.main.scrollX = this.player.x - 200;
    }

}
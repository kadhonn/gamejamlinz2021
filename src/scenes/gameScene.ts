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
        //  A simple background for our game
        this.add.tileSprite(400, 300, 0, 0, 'sky');

        //  The platforms group contains the ground and the 2 ledges we can jump on
        this.platforms = this.physics.add.staticGroup();

        //  Here we create the ground.
        //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();

        //  Now let's create some ledges
        this.platforms.create(600, 400, 'ground');
        this.platforms.create(50, 250, 'ground');
        this.platforms.create(750, 220, 'ground');

        // The player and its settings
        this.player = this.physics.add.sprite(100, 450, 'moss');

        //  Player physics properties. Give the little guy a slight bounce.
        this.player.setCollideWorldBounds(true);

        //  Collide the player and the stars with the platforms
        this.physics.add.collider(this.player, this.platforms)
    }

    update() {
        if (this.gameOver) {
            return;
        }
        this.player.setVelocityX(140);
        this.cameras.main.scrollX = this.player.x - 200;
    }

}
import Phaser from "phaser";
import { GameScene } from "./scenes/gameScene";
import { StartScene } from "./scenes/startScene";

var config = {
    type: Phaser.AUTO,
    width: 1400,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    }
};

var game = new Phaser.Game(config);
game.scene.add("start", StartScene);
game.scene.add("game", GameScene);
game.scene.run("start");
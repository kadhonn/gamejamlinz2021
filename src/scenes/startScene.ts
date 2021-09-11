import { Scene } from "phaser";

export class StartScene extends Scene {

    scoreText;

    create() {
        this.scoreText = this.add.text(300, 200, 'score: 0', { fontSize: '32px', color: '#FFFFFF' });
        this.scoreText.setInteractive();
        this.scoreText.setText("Start");

        this.scoreText.on('pointerup', function (pointer) {
            this.scene.game.scene.run("game");
        });
    }
}
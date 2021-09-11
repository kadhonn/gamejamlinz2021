import { Scene } from "phaser";

export class StartScene extends Scene {

    create() {
        let scoreText = this.add.text(300, 200, 'score: 0', { fontSize: '32px', color: '#FFFFFF' });
        scoreText.setInteractive();
        scoreText.setText("Start");

        scoreText.on('pointerup', function () {
            this.scene.game.scene.start("game");
            this.scene.game.scene.stop("start");
        });
    }
}
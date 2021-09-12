import { GameScene } from "../scenes/gameScene";
import { SpeechBubble } from "./speechBubble";

export class Jen {

    scene: GameScene;
    sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    speechBubble: SpeechBubble = null;

    constructor(scene: GameScene) {
        this.scene = scene;
        this.sprite = scene.physics.add.sprite(400, 320, 'jen').setScale(2).setDepth(2).refreshBody();
        this.sprite.body.setAllowGravity(false);
        this.sprite.anims.create({
            key: 'cry',
            frames: scene.anims.generateFrameNumbers('jen', { start: 0, end: 3 }),
            frameRate: 4,
            repeat: -1
        });

        this.sprite.anims.create({
            key: 'talk',
            frames: scene.anims.generateFrameNumbers('jen', { start: 4, end: 5 }),
            frameRate: 4,
            repeat: -1
        });

        this.sprite.anims.create({
            key: 'left',
            frames: [{ key: 'jen', frame: 7 }],
            frameRate: 20
        });

        this.sprite.anims.create({
            key: 'right',
            frames: [{ key: 'jen', frame: 8 }],
            frameRate: 20
        });
    }

    update() {
        const scene = this.scene;
        const sprite = this.sprite;
        let screenFollowerX = sprite.x - scene.cameras.main.scrollX;
        let screenFollowerY = sprite.y - scene.cameras.main.scrollY;

        let xOffset = 0;
        if (scene.input.activePointer.x > screenFollowerX) {
            xOffset = -20;
            sprite.anims.play("right", true);
        } else {
            xOffset = 20;
            sprite.anims.play("left", true)
        }

        let deltaX = ((scene.input.activePointer.x + xOffset) - screenFollowerX);
        let deltaY = ((scene.input.activePointer.y + 30) - screenFollowerY);

        sprite.setVelocity(deltaX * 5, deltaY * 5)

        this.updateSpeechBubble();
    }

    say(quote: string, duration: number) {
        if (this.speechBubble == null) {
            this.speechBubble = new SpeechBubble(this.scene, this.sprite.x, this.sprite.y, 200, 140, quote);
            this.updateSpeechBubble();
            this.scene.time.addEvent(new Phaser.Time.TimerEvent({
                delay: duration,
                callback: () => {
                    this.removeSpeechBubble();
                }
            }));
        }
    }

    updateSpeechBubble() {
        if (this.speechBubble != null) {
            this.speechBubble.updatePosition(this.sprite.x - 20, this.sprite.y - 230);
        }
    }

    removeSpeechBubble() {
        this.speechBubble.destroy();
        this.speechBubble = null;
    }
}
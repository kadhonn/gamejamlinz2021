import { BASE_SPEED, GameScene, SCALE } from "../scenes/gameScene";

export enum RoyState {
    walk = 'walk',
    chill = 'chill',
    shrug = 'shrug',
    talk = 'talk'
}

export class Roy {
    scene: GameScene;
    sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

    constructor(scene: GameScene) {
        this.scene = scene;
        this.sprite = setupRoy(scene)

        this.updateState(RoyState.walk)
        scene.physics.add.collider(this.sprite, scene.obstacles, () => {
            this.updateState(RoyState.shrug)
        });
    }

    say(speech: string, duration: number) {
        const xPos = this.sprite.x
        const yPos = 300
        
        this.updateState(RoyState.talk)
        const bubble = this.scene.createSpeechBubble(xPos, yPos, 120, 80, speech)

        this.scene.time.addEvent({
            delay: duration,
            callback: () => {
                this.updateState(RoyState.walk)
                bubble.destroy()
            }
        })
    }

    sayAndChill(speech: string, duration: number) {
        const xPos = this.sprite.x
        const yPos = 300

        this.updateState(RoyState.talk)
        const bubble = this.scene.createSpeechBubble(xPos, yPos, 120, 80, speech)

        this.scene.time.addEvent({
            delay: duration,
            callback: () => {
                this.updateState(RoyState.chill)
                bubble.destroy()
            }
        })
    }

    increaseSpeedBy(deltaSpeed: number) {
        this.updateSpeed(BASE_SPEED + deltaSpeed)
    }

    resetSpeed() {
        this.updateSpeed(BASE_SPEED)
    }

    updateSpeed(newSpeed: number) {
        this.sprite.setVelocityX(newSpeed)
    }

    updateState(state: RoyState) {
        switch (state) {
            case RoyState.chill:
                this.sprite.anims.play('chill', true)
                this.updateSpeed(0)
                break;
            case RoyState.walk:
                this.sprite.anims.play('walk', true)
                this.resetSpeed()
                break;
            case RoyState.shrug:
                this.sprite.anims.play('shrug', true)
                this.updateSpeed(0)
                break;
            case RoyState.talk:
                this.sprite.anims.play('talk', true)
                this.updateSpeed(0)
                break;
            default:
                this.sprite.anims.play('shrug', true)
        }
    }
}

export function setupRoy(scene: GameScene): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody {
    const roySprite = scene.physics.add.sprite(700, 480, 'roy').setScale(SCALE).setDepth(2).refreshBody();

    roySprite.setCollideWorldBounds(true);
    roySprite.body.setAllowGravity(false);

    roySprite.anims.create({
        key: 'walk',
        frames: scene.anims.generateFrameNumbers('roy', { start: 3, end: 4 }),
        frameRate: 8,
        repeat: -1
    });

    roySprite.anims.create({
        key: 'chill',
        frames: scene.anims.generateFrameNumbers('roy', { start: 2, end: 2 }),
        frameRate: 1,
        repeat: -1,
    });

    roySprite.anims.create({
        key: 'shrug',
        frames: scene.anims.generateFrameNumbers('roy', { start: 0, end: 1 }),
        frameRate: 8,
        repeat: -1,
    });

    roySprite.anims.create({
        key: 'talk',
        frames: scene.anims.generateFrameNumbers('roy', { frames: [0, 5] }),
        frameRate: 8,
        repeat: -1,
    });

    return roySprite;
}
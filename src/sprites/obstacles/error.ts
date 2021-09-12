import { GameScene, ROOM_HEIGHT, ROOM_WIDTH, SCALE } from "../../scenes/gameScene";
import { RoyState } from "../roy";

const BORDER = 100;

let postitsGroup: Phaser.Physics.Arcade.Group;
let errorPc: Phaser.Types.Physics.Arcade.SpriteWithStaticBody;
let monitor: Phaser.Types.Physics.Arcade.SpriteWithStaticBody;
let gameDone = false;
let colliders: Phaser.Physics.Arcade.Collider[] = [];

export function setupErrorPC(scene: GameScene, x: number) {
    errorPc = scene.physics.add.staticSprite(900 + x, 450, 'pcError').setScale(SCALE).refreshBody();
    errorPc.anims.create({
        key: 'blink',
        frames: scene.anims.generateFrameNumbers('pcError', { start: 0, end: 1 }),
        frameRate: 8,
        repeat: -1,
    });
    errorPc.anims.play('blink');
    monitor = scene.physics.add.staticSprite(900 + x, 410, 'pcError').setDisplaySize(80,30).setVisible(false).refreshBody();


    let postits = [];
    for (let i = 0; i < 3; i++) {
        let postit = scene.physics.add.sprite(x + Phaser.Math.Between(500, 700) + i * 200, Phaser.Math.Between(150, 300), 'postit', i)
            .setScale(6)
            .setRotation(Phaser.Math.Between(0, 10))
            .refreshBody();
        postit.setCircle(3);
        postits.push(postit);
    }
    postitsGroup = scene.physics.add.group({
        allowRotation: true,
        allowGravity: false,
        collideWorldBounds: true,
        customBoundsRectangle: new Phaser.Geom.Rectangle(x + BORDER, 0 + BORDER, ROOM_WIDTH - BORDER * 2, ROOM_HEIGHT - BORDER * 2),
        dragX: 500,
        dragY: 500,
        bounceX: 0.5,
        bounceY: 0.5,
    });
    postitsGroup.addMultiple(postits);

    colliders.push(scene.physics.add.collider(scene.jen, postitsGroup));
    colliders.push(scene.physics.add.collider(postitsGroup, postitsGroup));

    colliders.push(scene.physics.add.collider(scene.roy.sprite, errorPc,
        () => {
            scene.roy.updateState(RoyState.shrug);
        }));
}

export function updateError(scene: GameScene) {
    if (gameDone || postitsGroup.children.size == 0) {
        return;
    }
    let allIn = true;
    for (let child of postitsGroup.children.entries) {
        let postit = child as Phaser.Types.Physics.Arcade.SpriteWithStaticBody;
        if (!scene.physics.overlap(postit, monitor)) {
            allIn = false;
            postit.setTint();
        }else{
            postit.setTint(0x666666);
        }
    }
    if (allIn) {
        gameDone = true;
        cleanup();
        scene.roy.updateState(RoyState.walk);
    }
}

function cleanup() {
    for (let child of postitsGroup.children.entries) {
        let postit = child as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
        postit.setActive(false);
        postit.setVelocity(0);
        postit.setImmovable(true);
    }
    for (let collider of colliders) {
        collider.destroy();
    }
}

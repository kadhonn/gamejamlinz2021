import { GameScene } from "../scenes/gameScene";

export class SpeechBubble {

    bubble: Phaser.GameObjects.Graphics;
    text: Phaser.GameObjects.Text;
    width: number;
    height: number;

    constructor(scene: GameScene, x: number, y: number, width: number, height: number, quote: string) {
        this.width = width;
        this.height = height;
        const bubbleWidth = width;
        const bubbleHeight = height;
        const bubblePadding = 10;
        const arrowHeight = bubbleHeight / 4;
    
        this.bubble = scene.add.graphics({ x: x, y: y });
        this.bubble.setDepth(11);
    
        //  Bubble shadow
        this.bubble.fillStyle(0x222222, 0.5);
        this.bubble.fillRoundedRect(6, 6, bubbleWidth, bubbleHeight, 16);
    
        //  Bubble color
        this.bubble.fillStyle(0xffffff, 1);
    
        //  Bubble outline line style
        this.bubble.lineStyle(4, 0x565656, 1);
    
        //  Bubble shape and outline
        this.bubble.strokeRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16);
        this.bubble.fillRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16);
    
        //  Calculate arrow coordinates
        var point1X = Math.floor(bubbleWidth / 7);
        var point1Y = bubbleHeight;
        var point2X = Math.floor((bubbleWidth / 7) * 2);
        var point2Y = bubbleHeight;
        var point3X = Math.floor(bubbleWidth / 7);
        var point3Y = Math.floor(bubbleHeight + arrowHeight);
    
        //  Bubble arrow shadow
        this.bubble.lineStyle(4, 0x222222, 0.5);
        this.bubble.lineBetween(point2X - 1, point2Y + 6, point3X + 2, point3Y);
    
        //  Bubble arrow fill
        this.bubble.fillTriangle(point1X, point1Y, point2X, point2Y, point3X, point3Y);
        this.bubble.lineStyle(2, 0x565656, 1);
        this.bubble.lineBetween(point2X, point2Y, point3X, point3Y);
        this.bubble.lineBetween(point1X, point1Y, point3X, point3Y);
    
        this.text =  scene.add.text(0, 0, quote, { fontFamily: 'Arial', fontSize: 'medium', color: '#000000', align: 'center', wordWrap: { width: bubbleWidth - (bubblePadding * 2) } });
        this.text.setDepth(12);

        this.updatePosition(x, y);
    }

    updatePosition(x: number, y: number) {
        this.bubble.setPosition(x, y);
        const textBounds = this.text.getBounds();
        this.text.setPosition(this.bubble.x + (this.width / 2) - (textBounds.width / 2), this.bubble.y + (this.height / 2) - (textBounds.height / 2));
    }

    destroy() {
        this.bubble.destroy()
        this.text.destroy()
    }
}
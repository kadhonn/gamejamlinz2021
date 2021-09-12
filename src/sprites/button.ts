export function createButton(x: number, y: number, quote: string, onClick: any) {

    this.clickButton = this.add.text(x, y, quote, { fill: '#0f0' })
        .setInteractive()
        .on('pointerdown', onClick)
        .on('pointerover', () => this.clickButton.setStyle({ fill: '#fff'}) )
        .on('pointerout', () => this.clickButton.setStyle({ fill: '#0f0' }) );

}

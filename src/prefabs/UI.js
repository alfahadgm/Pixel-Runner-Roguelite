class UI {
    constructor(scene) {
        this.scene = scene;
        this.waveText = null;

        const screenWidth = this.scene.scale.width;
        this.timerText = this.setupText(screenWidth / 2, 10, '0:00', '24px', '#ffffff');
        this.timerText.setOrigin(0.5, 0); // Center the text horizontally
    }

    displayWave(waveNumber) {
        const waveDisplayString = `Wave ${waveNumber + 1}`;  // +1 since waves start at 1, not 0.

        if (this.waveText) {
            this.waveText.setText(waveDisplayString);
        } else {
            const xPosition = this.scene.scale.width - 10;
            // Using setupText to create the text
            this.waveText = this.setupText(xPosition, 10, waveDisplayString, '24px', '#ffffff', 'right');
            this.waveText.setOrigin(1, 0);
        }
    }

    // Update the timer's display
    updateTimerDisplay() {
        const minutes = Math.floor(this.scene.totalTime / 60);
        const seconds = Math.floor(this.scene.totalTime) % 60;
        this.timerText.setText(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    }

    setupText(x, y, text, fontSize = '16px', fill = '#fff', align = 'center') { // Default align to 'center'
        return this.scene.add.text(x, y, text, {
            fontSize: fontSize,
            fill: fill,
            align: align
        }).setScrollFactor(0).setDepth(1000);
    }
}
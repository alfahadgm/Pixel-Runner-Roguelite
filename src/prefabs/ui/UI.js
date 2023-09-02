class UI {
    constructor(scene) {
        this.scene = scene;
        this.hero = this.scene.hero; // Assuming the hero is stored in the scene
        this.waveText = null;
        this.weaponNameText = null;
        this.weaponStatsTexts = [];
        const screenWidth = this.scene.scale.width;
        this.timerText = this.setupText(screenWidth / 2, 10, '0:00', '24px', '#ffffff');
        this.timerText.setOrigin(0.5, 0); // Center the text horizontally

        // Initialize Hero's UI
        this.initializeHeroUI();
    }

    initializeHeroUI() {
        const baseY = this.scene.sys.game.config.height - 20; // 20px from bottom

        this.healthText = this.setupText(10, baseY, `Health: ${this.hero.heroStats.health}`);
        this.armorText = this.setupText(200, baseY, `Armor: ${this.hero.heroStats.armor}`);
        this.shieldText = this.setupText(400, baseY, `Shield: ${this.hero.heroStats.shield} / ${this.hero.heroStats.maxshield}`);
        this.speedText = this.setupText(600, baseY, `Speed: ${this.hero.heroStats.movementSpeed}`);
        this.xpText = this.setupText(10, baseY-20, `XP: ${this.hero.heroStats.xp}/${this.hero.heroStats.xpThresholds[this.hero.heroStats.level - 1]}`);
        this.levelText = this.setupText(200, baseY-20, `Level: ${this.hero.heroStats.level}`);
        this.coinsText = this.setupText(400, baseY-20, `Coins: ${this.hero.heroStats.coins}`);
        this.ammoText = this.setupText(600, baseY-20, `Ammo: ${this.hero.currentWeapon.weaponStats.currentMagazine} / ${this.hero.currentWeapon.weaponStats.totalAmmo}`);
    }

    updateHeroUI() {
        this.healthText.setText(`Health: ${Math.round(this.hero.heroStats.health)}  / ${Math.round(this.hero.heroStats.maxhealth)}`);
        this.armorText.setText(`Armor: ${Math.round(this.hero.heroStats.armor)}`);
        this.shieldText.setText(`Shield: ${Math.round(this.hero.heroStats.shield)}  / ${Math.round(this.hero.heroStats.maxshield)}`);
        this.speedText.setText(`Speed: ${Math.round(this.hero.heroStats.movementSpeed * 100) / 100}`);
        this.xpText.setText(`XP: ${Math.round(this.hero.heroStats.xp)}/${Math.round(this.hero.heroStats.xpThresholds[this.hero.heroStats.level - 1])}`);
        this.levelText.setText(`Level: ${Math.round(this.hero.heroStats.level)}`);
        this.coinsText.setText(`Coins: ${Math.round(this.hero.heroStats.coins)}`);
        this.ammoText.setText(`Ammo: ${Math.round(this.hero.currentWeapon.weaponStats.currentMagazine)} / ${Math.round(this.hero.currentWeapon.weaponStats.totalAmmo)}`);
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

    // UI CLASS SETUP TEXT
    setupText(x, y, text, fontSize = '12px', fill = '#fff', align = 'center', fontFamily = 'PixelAE' ) { // Default align to 'center'
        return this.scene.add.text(x, y, text, {
            fontFamily: fontFamily,
            fontSize: fontSize,
            fill: fill,
            align: align
        }).setScrollFactor(0).setDepth(4).setStroke('#b4b4b4', 3);;
    }
}
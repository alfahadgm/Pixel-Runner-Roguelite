class Upgrades {
    constructor(scene, hero) {
        this.scene = scene;
        this.hero = hero;
        this.heroOptions = ['Max Health', 'Add 1 Armor', 'Max Shield', 'Extra Movement Speed'];
        this.upgradePanel = null;
        this.weaponShopPanel = null;
        this.resumeButton = null;
        this.tintedBackground = null;
        this.isUpgradeMenuActive = false;
    }

    createTintedBackground() {
        const cam = this.scene.cameras.main;
    
        if (!this.tintedBackground) {
            this.tintedBackground = this.scene.add.graphics({ fillStyle: { color: 0x000000, alpha: 0.7 } }).setScrollFactor(0).setDepth(5);
        }
        
        this.updateTintedBackgroundSizeAndPosition(cam);
        this.tintedBackground.visible = true;  // Ensure the tintedBackground is visible
    }
    
    updateTintedBackgroundSizeAndPosition(cam) {
        this.tintedBackground.clear();
        this.tintedBackground.fillRect(0, 0, cam.width, cam.height);  // Drawing from (0, 0)
    }
    

    hideTintedBackground() {
        if (this.tintedBackground) {
            this.tintedBackground.visible = false;
        }
    }

    showUpgrades() {
        this.isUpgradeMenuActive = true;
        this.createTintedBackground();
    
        if (this.upgradePanel) {
            this.upgradePanel.clear(true, true);
        }

        this.createUpgradePanel();
    }

    createUpgradePanel() {
        const cam = this.scene.cameras.main;
    
        const centerX = cam.scrollX + cam.width / 2;
        const centerY = cam.scrollY + cam.height / 2;
    
        const randomOptions = Phaser.Utils.Array.Shuffle(this.heroOptions).slice(0, 3);
        this.upgradePanel = this.scene.add.group();
    
        randomOptions.forEach((option, index) => {
            const btnX = centerX;
            const btnY = centerY - (randomOptions.length - 1) * 50 + index * 100;
            const btn = this.scene.add.sprite(btnX, btnY, 'upgradeBtn').setInteractive().setDepth(6);
            const text = this.scene.add.text(btnX, btnY, option).setOrigin(0.5).setDepth(6);
    
            btn.on('pointerdown', () => {
                this.applyHeroUpgrade(option);
                this.hideUpgrades();
            });
    
            this.upgradePanel.add(btn);
            this.upgradePanel.add(text);
        });
    }
    
    createWeaponShopPanel() {
        const cam = this.scene.cameras.main;
    
        // Define initial starting position.
        const spacing = 20;
        const centeredX = cam.scrollX + cam.width / 2;  // Center of the camera.
    
        this.weaponShopPanel = this.scene.add.group();
        const weaponText = this.scene.add.text(centeredX, cam.scrollY + spacing, 'Weapon Shop', { fontSize: '32px' }).setOrigin(0.5).setDepth(6);  // Doubled font size and set the origin to center the text.
        this.weaponShopPanel.add(weaponText);
    
        // Define Resume button properties.
        const resumeFontSize = '32px';
        const resumePadding = 50;  // Padding from the bottom.

        let startX = cam.scrollX + 10;  // Padding from the left.
        let startY = cam.scrollY + weaponText.height + 2 * spacing;  // Below the Weapon Shop text.
    
        let currentX = startX;
        let currentY = startY;
    
    
        const attributes = [
            { name: 'Damage', property: 'damage', cost: 100, costModifier: 1.2, modificationType: 'percentage', modificationValue: 10 },
            { name: 'Bullet Speed', property: 'bulletSpeed', cost: 80, costModifier: 1.2, modificationType: 'percentage', modificationValue: 10 },
            { name: 'Critical Chance', property: 'criticalChance', cost: 120, costModifier: 1.25, modificationType: 'percentage', modificationValue: 5 },
            { name: 'Critical Damage', property: 'criticalDamage', cost: 150, costModifier: 1.3, modificationType: 'percentage', modificationValue: 15 },
            { name: 'Max Range', property: 'maxRange', cost: 70, costModifier: 1.2, modificationType: 'value', modificationValue: 5 },
            { name: 'Cooldown', property: 'cooldown', cost: 60, costModifier: 1.15, modificationType: 'percentage', modificationValue: -10 },
            { name: 'Magazine Size', property: 'magazineSize', cost: 90, costModifier: 1.25, modificationType: 'value', modificationValue: 2 },
            { name: 'Total Ammo', property: 'totalAmmo', cost: 50, costModifier: 1.0, modificationType: 'value', modificationValue: 10 },
            { name: 'Reload Time', property: 'reloadTime', cost: 85, costModifier: 1.2, modificationType: 'percentage', modificationValue: -10 },
            { name: 'Bullet Penetration', property: 'penetration', cost: 95, costModifier: 1.3, modificationType: 'percentage', modificationValue: 10 }
        ];
    
        attributes.forEach((attr, index) => {
            if (index === (attributes.length / 2)) {  // Assuming there are even number of attributes.
                currentX += cam.width / 2;
                currentY = startY;
            }
    
            let text = this.scene.add.text(currentX, currentY, `${attr.name}: ${this.hero.currentWeapon.weaponStats[attr.property]}`, { fontSize: '16px' }).setDepth(6);
            this.weaponShopPanel.add(text);
            currentY += text.height;
        
            let buttonText = attr.property === 'totalAmmo' 
                ? `Buy Ammo for ${attr.cost} coins`
                : `Increase ${attr.name} by ${attr.modificationValue}${attr.modificationType === 'percentage' ? '%' : ''} \n ${attr.cost} coins`;
        
            // Reduced font size to '8px' and changed color to 'blue' for the button.
            let button = this.scene.add.text(currentX, currentY, buttonText, { fontSize: '12px', fill: '#FF5733' }).setInteractive().setDepth(6);
        
            button.on('pointerdown', () => {
                // Check if hero has enough coins
                if (this.hero.heroStats.coins >= attr.cost) {
                    if (attr.modificationType === 'value') {
                        this.hero.currentWeapon.weaponStats.modifyAttributeByValue(attr.property, attr.modificationValue);
                    } else if (attr.modificationType === 'percentage') {
                        this.hero.currentWeapon.weaponStats.modifyAttributeByPercentage(attr.property, attr.modificationValue);
                    }
                    
                    // Deduct coins from hero
                    this.hero.heroStats.coins -= attr.cost;
            
                    text.setText(`${attr.name}: ${this.hero.currentWeapon.weaponStats[attr.property]}`).setDepth(6);
                    attr.cost *= attr.costModifier;
            
                    // Update the text of the button with new cost
                    button.setText(attr.property === 'totalAmmo'
                        ? `Buy Ammo for ${attr.cost.toFixed(2)} coins`
                        : `Increase ${attr.name} by ${attr.modificationValue}${attr.modificationType === 'percentage' ? '%' : ''} for ${attr.cost.toFixed(2)} coins`);
                } else {
                    // Not enough coins
                    const insufficientFundsText = this.scene.add.text(this.scene.input.x, this.scene.input.y, 'Not enough coins', { fontSize: '12px', fill: '#FF0000' }).setDepth(6);
                    
                    // Remove the text after 1 second
                    this.scene.time.delayedCall(1000, () => {
                        insufficientFundsText.destroy();
                    });
                }
            });
    
            this.weaponShopPanel.add(button);
            currentY += spacing;
    
            // Reset columnY and switch to the other column when halfway through attributes
            if (index === (attributes.length / 2) - 1) {
                currentY = cam.scrollY + cam.height / 4;
            }
        });

    // Calculate the position for the Resume button
    let resumeButtonX = centeredX;
    let resumeButtonY = cam.scrollY + cam.height - resumePadding;  // Place it above the padding from the bottom

    // Create the Resume button
    let resumeButton = this.scene.add.text(resumeButtonX, resumeButtonY, 'Resume', { fontSize: resumeFontSize, fill: '#FF5733' })
        .setOrigin(0.5)  // Center the text
        .setInteractive()
        .setDepth(6);
    this.weaponShopPanel.add(resumeButton);

    // Handle button interactivity
    resumeButton.on('pointerdown', () => {
        if (this.weaponShopPanel) {
            this.weaponShopPanel.clear(true, true);
            this.weaponShopPanel = null;
        }
        
        this.scene.resumeGame();
        resumeButton.destroy();
        this.isUpgradeMenuActive = false;
        this.hideTintedBackground();
    });
}
    


    applyHeroUpgrade(option) {
        const heroStats = this.hero.heroStats;
        switch (option) {
            case 'Max Health':
                heroStats.modifyAttributeByValue('maxhealth', 20); // Example value
                break;
            case 'Add 1 Armor':
                heroStats.modifyAttributeByValue('armor', 1);
                break;
            case 'Max Shield':
                heroStats.modifyAttributeByValue('maxshield', 10); // Example value
                break;
            case 'Extra Movement Speed':
                heroStats.modifyAttributeByPercentage('movementSpeed', 10); // Increase by 10%
                break;
        }
        this.hideUpgrades();
    }

    hideUpgrades() {
        if (this.upgradePanel) {
            this.upgradePanel.clear(true, true);
            this.upgradePanel = null;
        }
    
        if (!this.weaponShopPanel) {
            this.createWeaponShopPanel();
        }

        this.weaponShopPanel.visible = true;
    }
    update() {
        if (this.isUpgradeMenuActive) {
            const cam = this.scene.cameras.main;
            this.updateTintedBackgroundSizeAndPosition(cam); // Adjust the tintedBackground position and size
        }
    }
}
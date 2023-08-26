class Upgrades {
    constructor(scene, hero) {
        this.scene = scene;
        this.hero = hero;
        this.heroOptions = ['Max Health', 'Add 1 Armor', 'Max Shield', 'Extra Movement Speed'];
        this.upgradePanel = null;
        this.weaponShopPanel = null;
        this.resumeButton = null;
    }

    showUpgrades() {
        if (!this.upgradePanel) {
            this.createUpgradePanel();
        }

        this.upgradePanel.visible = true;
    }

    hideUpgrades() {
        this.upgradePanel.visible = false;

        if (!this.weaponShopPanel) {
            this.createWeaponShopPanel();
        }

        if (!this.resumeButton) {
            this.createResumeButton();
        }

        this.weaponShopPanel.visible = true;
        this.resumeButton.visible = true;
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
    
            const btn = this.scene.add.sprite(btnX, btnY, 'upgradeBtn').setInteractive();
            const text = this.scene.add.text(btnX, btnY, option).setOrigin(0.5);
    
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
    
        let centerX = cam.scrollX + cam.width / 2;
        let centerY = cam.scrollY + cam.height / 4; // Starting position
        const spacing = 40;
    
        this.weaponShopPanel = this.scene.add.group();
        const weaponText = this.scene.add.text(centerX, centerY - spacing, 'Weapon Shop').setOrigin(0.5);
        this.weaponShopPanel.add(weaponText);
    
        const attributes = [
            { name: 'Damage', property: 'damage', cost: 100, costModifier: 1.2, modificationType: 'percentage', modificationValue: 10 },
            { name: 'Bullet Speed', property: 'bulletSpeed', cost: 80, costModifier: 1.2, modificationType: 'percentage', modificationValue: 10 },
            { name: 'Critical Chance', property: 'criticalChance', cost: 120, costModifier: 1.25, modificationType: 'percentage', modificationValue: 5 },
            { name: 'Critical Damage', property: 'criticalDamage', cost: 150, costModifier: 1.3, modificationType: 'percentage', modificationValue: 15 },
            { name: 'Max Range', property: 'maxRange', cost: 70, costModifier: 1.2, modificationType: 'value', modificationValue: 5 },
            { name: 'Cooldown', property: 'cooldown', cost: 60, costModifier: 1.15, modificationType: 'percentage', modificationValue: -10 },
            { name: 'Magazine Size', property: 'magazineSize', cost: 90, costModifier: 1.25, modificationType: 'value', modificationValue: 2 },
            { name: 'Total Ammo', property: 'totalAmmo', cost: 50, costModifier: 1.1, modificationType: 'value', modificationValue: 10 },
            { name: 'Reload Time', property: 'reloadTime', cost: 85, costModifier: 1.2, modificationType: 'percentage', modificationValue: -10 },
            { name: 'Bullet Penetration', property: 'penetration', cost: 95, costModifier: 1.3, modificationType: 'percentage', modificationValue: 10 }
        ];
    
        attributes.forEach(attr => {
            let text = this.scene.add.text(centerX, centerY, `${attr.name}: ${this.hero.currentWeapon.weaponStats[attr.property]}`).setOrigin(0.5);
            this.weaponShopPanel.add(text);
            centerY += spacing;
    
            if (attr.property === 'totalAmmo') {
                let buyAmmoButton = this.scene.add.text(centerX, centerY, `Buy Ammo for ${attr.cost} coins`).setInteractive();
                buyAmmoButton.on('pointerdown', () => {
                    if (attr.modificationType === 'value') {
                        this.hero.currentWeapon.weaponStats.modifyAttributeByValue(attr.property, attr.modificationValue);
                    } else if (attr.modificationType === 'percentage') {
                        this.hero.currentWeapon.weaponStats.modifyAttributeByPercentage(attr.property, attr.modificationValue);
                    }
                    text.setText(`${attr.name}: ${this.hero.currentWeapon.weaponStats[attr.property]}`);
                    attr.cost *= attr.costModifier;
                    buyAmmoButton.setText(`Buy Ammo for ${attr.cost.toFixed(2)} coins`);
                });
                this.weaponShopPanel.add(buyAmmoButton);
                centerY += spacing;
            } else {
                let buttonText = `Increase ${attr.name} by ${attr.modificationValue}${attr.modificationType === 'percentage' ? '%' : ''} for ${attr.cost} coins`;
                let increaseAttributeButton = this.scene.add.text(centerX, centerY, buttonText).setInteractive();
                increaseAttributeButton.on('pointerdown', () => {
                    if (attr.modificationType === 'value') {
                        this.hero.currentWeapon.weaponStats.modifyAttributeByValue(attr.property, attr.modificationValue);
                    } else if (attr.modificationType === 'percentage') {
                        this.hero.currentWeapon.weaponStats.modifyAttributeByPercentage(attr.property, attr.modificationValue);
                    }
                    text.setText(`${attr.name}: ${this.hero.currentWeapon.weaponStats[attr.property]}`);
                    attr.cost *= attr.costModifier;
                    increaseAttributeButton.setText(`Increase ${attr.name} by ${attr.modificationValue}${attr.modificationType === 'percentage' ? '%' : ''} for ${attr.cost.toFixed(2)} coins`);
                });
                this.weaponShopPanel.add(increaseAttributeButton);
                centerY += spacing;
            }
        });
    
        this.resumeButton = this.scene.add.text(centerX, cam.scrollY + cam.height - spacing, 'Resume').setInteractive();
        this.resumeButton.on('pointerdown', () => {
            this.weaponShopPanel.clear(true, true);
            this.resumeButton.destroy();
        });
        this.weaponShopPanel.add(this.resumeButton);
    }
    
    
    
    createResumeButton() {
        const cam = this.scene.cameras.main;
    
        const centerX = cam.scrollX + cam.width / 2;
        const bottomY = cam.scrollY + cam.height - 50;
    
        this.resumeButton = this.scene.add.sprite(centerX, bottomY, 'resumeBtn').setInteractive();
    
        this.resumeButton.on('pointerdown', () => {
            this.weaponShopPanel.visible = false;
            this.resumeButton.visible = false;
            this.scene.resumeGame();
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
        this.upgradePanel.clear(true, true);
        if (!this.weaponShopPanel) {
            this.createWeaponShopPanel();
        }
        this.weaponShopPanel.visible = true;
    }
}

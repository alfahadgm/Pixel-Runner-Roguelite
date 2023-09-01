class Upgrades {
    constructor(scene, hero) {
        this.scene = scene;
        this.hero = hero;
        this.weaponUpgradeAttributes = [
            { name: 'Damage', property: 'damage', cost: 100, costModifier: 1.5, modificationType: 'value', modificationValue: 5, displayType: 'normal' },
          //  { name: 'Bullet Speed', property: 'bulletSpeed', cost: 80, costModifier: 1.5, modificationType: 'value', modificationValue: 25, displayFormat: 'km/s' },
            { name: 'Crit Chance', property: 'criticalChance', cost: 120, costModifier: 1.5, modificationType: 'value', modificationValue: 0.02, displayFormat: 'percentage' },
            { name: 'Crit Damage', property: 'criticalDamage', cost: 140, costModifier: 1.5, modificationType: 'value', modificationValue: 0.1, displayFormat: 'percentage' },
            { name: 'Range', property: 'maxRange', cost: 80, costModifier: 1.5, modificationType: 'value', modificationValue: 15, displayType: 'normal' },
            { name: 'FireRate', property: 'cooldown', cost: 70, costModifier: 1.5, modificationType: 'value', modificationValue: -5, displayFormat: 'seconds' },
            { name: 'Magazine', property: 'magazineSize', cost: 95, costModifier: 1.3, modificationType: 'value', modificationValue: 3, displayType: 'normal' },
            { name: 'Reload', property: 'reloadTime', cost: 85, costModifier: 1.2, modificationType: 'percentage', modificationValue: -10, displayFormat: 'seconds' },
            { name: 'Penetration', property: 'penetration', cost: 110, costModifier: 1.4, modificationType: 'percentage', modificationValue: 15, displayType: 'percentage' }
        ];
        this.heroUpgrades = [
            '10 Max Health',
            '2 Armor',
            '5 Max Shield',
            '10% Movement Speed',
            '100% Magnet Size',
            '10% Coins Pickups',
            '10% XP Pickups'
        ];
        this.heroUpgradeButtons = [];
        this.weaponUpgradeButtons = [];

    this.weaponUpgradeButtons.forEach(button => {
        button.setVisible(false);
    });
    
    this.heroUpgradeButtons.forEach(button => {
        button.setVisible(false);
    });

    this.rect = Phaser.Geom.Rectangle.Clone(this.scene.cameras.main);
    this.initializeUpgradeUI();
    }



    applySelectedHeroUpgrade(option) {
        const heroStats = this.hero.heroStats;
        const upgradeMap = {
            '10 Max Health': () => heroStats.modifyAttributeByValue('maxhealth', 20),
            '2 Armor': () => heroStats.modifyAttributeByValue('armor', 2),
            '5 Max Shield': () => heroStats.modifyAttributeByValue('maxshield', 5),
            '10% Movement Speed': () => heroStats.modifyAttributeByPercentage('movementSpeed', 10),
            '100% Magnet Size': () => heroStats.modifyAttributeByPercentage('magnetSize', 100),
            '10% Coins Pickups': () => heroStats.modifyAttributeByPercentage('coinsModifier', 10),
            '10% XP Pickups': () => heroStats.modifyAttributeByPercentage('xpModifier', 10)
        };
    
        if (upgradeMap[option]) {
            upgradeMap[option]();
        }

        this.heroUpgradeButtons.forEach(button => {
            button.setVisible(false);
        });
    
        this.weaponUpgradeButtons.forEach(button => {
            button.setVisible(true);
        });
        this.displayWeaponShopTitle();
        this.displayAvailableWeaponUpgrades();
        
    }

    drawGraphics (){
            // Graphics for the black tinted background
    this.backgroundGraphics = this.scene.add.graphics();
    this.backgroundGraphics.setDepth(4).setScrollFactor(0); // Set a depth for the background

    // Fill the screen with a black tinted rectangle
    this.backgroundGraphics.fillStyle(0x000000, 0.5); // 0.5 is the alpha for semi-transparency
    this.backgroundGraphics.fillRect(0, 0, this.scene.cameras.main.width, this.scene.cameras.main.height);

    // Graphics for the shapes
    this.shapesGraphics = this.scene.add.graphics();
    this.shapesGraphics.setDepth(6).setScrollFactor(0); // Set a different depth for the shapes
    
    // Assuming you'll be drawing the shapes here...
    this.shapes = new Array(15).fill(null).map(
        () => new Phaser.Geom.Circle(Phaser.Math.Between(0, 800), Phaser.Math.Between(0, 600), Phaser.Math.Between(25, 75))
    );
    
    // Draw the shapes on the shapesGraphics
    this.shapesGraphics.lineStyle(5, 0x00ff00, 1); // Example style, adjust as needed
    this.shapes.forEach(shape => {
        this.shapesGraphics.strokeCircleShape(shape); // Example drawing method for circles
    });
    }

    displayRandomHeroUpgrades() {
        //this.scene.music.setMusicVolume(0);
       // this.scene.musicFade.setMusicFadeVolume(1);
       this.drawGraphics();


       
       this.heroUpgradeButtons.forEach(button => {
        button.setVisible(true);
         });

        let randomUpgrades = Phaser.Utils.Array.Shuffle(this.heroUpgrades).slice(0, 3);
        
        randomUpgrades.forEach((upgrade, index) => {
            let cellWidth = this.grid.getCellWidth() * 4; // Span 3 columns
            let cellHeight = this.grid.getCellHeight();
    
            let btnBackground = this.scene.add.nineslice(0, 0, 'ui', 'button-bg')
                .setOrigin(0.5, 0.5)
                .setScrollFactor(0)
                .setDisplaySize(cellWidth, cellHeight);
    
            let btnText = this.scene.add.text(0, 0, upgrade, { color: '#fff', align: 'center' })
                .setOrigin(0.5, 0.5)
                .setScrollFactor(0)
                .setDepth(7);
    
            let buttonGroup = this.scene.add.container(0, 0, [btnBackground, btnText])
                .setSize(cellWidth, cellHeight)
                .setInteractive(new Phaser.Geom.Rectangle(0, 0, cellWidth, cellHeight), Phaser.Geom.Rectangle.Contains)
                .on('pointerdown', () => this.applySelectedHeroUpgrade(upgrade))
                .on('pointerover', () => btnBackground.setFrame('button-over'))
                .on('pointerout', () => btnBackground.setFrame('button-bg'))
                .setScrollFactor(0)
                .setDepth(6);
    
            // Adjusting the position according to given requirement
            this.grid.placeAt(4.5, 2 + index * 2, buttonGroup); // Adjusted the placement to the center
    
            // Store a reference to the created button:
            this.heroUpgradeButtons.push(buttonGroup);
        });
    }
    


    initializeUpgradeUI() {
        this.grid = new AlignGrid({
            scene: this.scene,
            rows: 10,
            cols: 10
        });

       // this.grid.show();
    }

    getFormattedAttributeValue(attr, value) {
        switch (attr.displayFormat) {
            case 'percentage':
                return (value * 100).toFixed(2) + '%'; // Convert to percentage
            case 'seconds':
                return value/1000 + ' Sec';
            case 'km/s':
                return (value*0.002).toFixed(2) + ' KM/s';
            default:
                return value; // Return value as-is for default
        }
    }

    
    displayAvailableWeaponUpgrades() {
        this.displayCurrentHeroCoins();

        // First row positions
        const firstRowPositions = [
            { x: 0, y: 2 },
            { x: 0, y: 3 },
            { x: 0, y: 4 },
            { x: 0, y: 5 },
            { x: 0, y: 6 },
            { x: 0, y: 7 }
        ];
    
        // Second row positions
        const secondRowPositions = [
            { x: 5, y: 2 },
            { x: 5, y: 3 },
            { x: 5, y: 4 },
            { x: 5, y: 5 },
            { x: 5, y: 6 },
            { x: 5, y: 7 }
        ];
    
        // Combine both rows for easier iteration
        const allPositions = firstRowPositions.concat(secondRowPositions);
    
        for (let i = 0; i < this.weaponUpgradeAttributes.length; i++) {
            let attr = this.weaponUpgradeAttributes[i];
        // Check if the hero has enough coins
        let canAfford = this.scene.hero.heroStats.coins >= attr.cost;
    
        // Calculate the width and height based on grid cell size
        let cellWidth = this.grid.getCellWidth() * 5 - 4; // Multiply by 5 for spanning 5 columns
        let cellHeight = this.grid.getCellHeight() - 4;
    
            // Create a nine-slice button background and resize it
            let btnBackground = this.scene.add.nineslice(0, 0, 'ui', 'blue_button00')
                .setOrigin(0.5, 0.5)
                .setScrollFactor(0)
                .setDisplaySize(cellWidth, cellHeight);
            
            // Create a text element for the attribute's description
            let displayValue = this.getFormattedAttributeValue(attr, this.hero.currentWeapon.weaponStats[attr.property]);
            let btnText = this.scene.add.text(0, 0, attr.name + ": " + displayValue + " (" + attr.cost + " Gold)", {
                color: '#000',
                align: 'center',
                fontStyle: 'bold'
            })
            .setOrigin(0.5, 0.5)
            .setScrollFactor(0)
            .setDepth(7); // Make sure text is above the button background
            
    // Set the button tint based on affordability
    if (!canAfford) {
        btnBackground.setTint(0xaaaaaa); // Grey tint
    }

    let buttonGroup = this.scene.add.container(0, 0, [btnBackground, btnText])
        .setSize(cellWidth, cellHeight)
        .setInteractive(new Phaser.Geom.Rectangle(0, 0, cellWidth, cellHeight), Phaser.Geom.Rectangle.Contains)
        .on('pointerdown', () => {
            if (canAfford) {
                this.buySelectedUpgrade(attr);
            }
        })
        .on('pointerover', () => {
            if (canAfford) {
                btnBackground.setFrame('yellow_button00');
                this.scene.tweens.add({
                    targets: buttonGroup,
                    scaleX: 1.2,
                    scaleY: 1.2,
                    duration: 200,
                    ease: 'Sine.easeOut'
                });
            }
        })
        .on('pointerout', () => {
            if (canAfford) {
                btnBackground.setFrame('blue_button00');
                this.scene.tweens.add({
                    targets: buttonGroup,
                    scaleX: 1,
                    scaleY: 1,
                    duration: 200,
                    ease: 'Sine.easeOut'
                });
            }
        })
        .setScrollFactor(0)
        .setDepth(6);
    
            // Place the button group on the grid
            this.weaponUpgradeButtons.push(buttonGroup);
            if (allPositions[i]) {
                this.grid.placeAt(allPositions[i].x + 2, allPositions[i].y, buttonGroup); // +2 for centering across the span of 5 columns
            }
        }
    }

    displayCurrentHeroCoins() {
        // Destroy previous coins text if it exists
        if(this.coinsText) {
            this.coinsText.destroy();
        }
    
        // Create new text to show current hero coins
        this.coinsText = this.scene.add.text(120, 50, `Coins: ${Math.round(this.scene.hero.heroStats.coins)}`, {
            color: '#FFF',
            align: 'right',
            fontSize: '24px',
            fontStyle: 'bold',
            fontFamily: 'PixelAE'
        })
        .setOrigin(1, 0) // This will right-align the text to the screen edge
        .setScrollFactor(0)
        .setDepth(10); // Make sure text is always on top
    }


    buySelectedUpgrade(attr) {
        if (this.scene.hero.heroStats.coins >= attr.cost) {
            // Deduct the coins from the hero
            this.scene.hero.heroStats.coins -= attr.cost;

        if (attr.modificationType === 'value') {
            this.hero.currentWeapon.weaponStats.modifyAttributeByValue(attr.property, attr.modificationValue);
        } else if (attr.modificationType === 'percentage') {
            this.hero.currentWeapon.weaponStats.modifyAttributeByPercentage(attr.property, attr.modificationValue);
        }

        attr.cost = Math.ceil(attr.cost * attr.costModifier); // Increase the cost for the next purchase

        this.displayAvailableWeaponUpgrades(); // Redraw the attributes to update the displayed cost
        this.displayCurrentHeroCoins();     // Update coins display after purchase
    } else {
        // Notify the player they don't have enough coins, maybe with a pop-up or a sound
        console.log("Not enough coins to make this purchase!");
    }

    }

    displayWeaponShopTitle() {
        let weaponShopTextX = this.grid.cellWidth * 3 + this.grid.cellWidth / 2;
        let endX = this.grid.cellWidth * 6 + this.grid.cellWidth / 2;
        let weaponShopTextY = this.cellHeight * 1 + this.grid.cellHeight / 2;
    
        if (!this.weaponShopText) {
            this.weaponShopText = this.scene.add.text(0, 0, 'Weapon Shop', { color: '#ffffff', fontSize: '20px' , fontFamily: 'PixelAE' });
            this.weaponShopText.setOrigin(0.5, 0.5);
            this.weaponShopText.setScrollFactor(0);
            this.weaponShopText.setDepth(7);
            this.weaponShopText.setPosition((weaponShopTextX + endX) / 2, weaponShopTextY);
        } else {
            this.weaponShopText.setVisible(true);
        }
        
        let resumeButtonX = this.grid.cw / 2;
        let resumeButtonY = this.grid.ch - this.grid.cellHeight;
        
        if (!this.resumeButton) {
            this.resumeButton = this.scene.add.nineslice(resumeButtonX, resumeButtonY, 'ui', 'blue_button00')
            .setOrigin(0.5, 0.5)
            .setScrollFactor(0)
            .setDepth(7)
            .setDisplaySize(this.grid.cellWidth * 2, this.grid.cellHeight)
            .setTint(0xff0000)
            .setInteractive()
            .on('pointerdown', () => {
                this.resumeButton.setVisible(false);
                this.resumeButtonText.setVisible(false); // Add this
                this.hideUpgradeUI();
                this.backgroundGraphics.destroy();
                this.shapesGraphics.destroy();
            });
    
            // Create and position the "RESUME" text on top of the button
            this.resumeButtonText = this.scene.add.text(resumeButtonX, resumeButtonY, 'RESUME', { color: '#ffffff', fontSize: '20px' ,
            fontFamily: 'PixelAE' })
            .setOrigin(0.5, 0.5)
            .setScrollFactor(0)
            .setDepth(8);
        } else {
            this.resumeButton.setVisible(true);
            this.resumeButtonText.setVisible(true); // Add this
        }
    }
    
    

    hideUpgradeUI() {
        this.weaponShopText.setVisible(false);
        this.resumeButton.setVisible(false);
        // Hiding weapon buttons:
        this.weaponUpgradeButtons.forEach(button => {
            button.setVisible(false);
        });
    
        // Hiding hero upgrade buttons:
        this.heroUpgradeButtons.forEach(button => {
            button.setVisible(false);
        });
        this.scene.resumeGame();
        this.hero.updateAutoFireDelay();
                       // this.scene.music.setMusicVolume(1);
               // this.scene.musicFade.setMusicFadeVolume(0);
        // If there are any other UI elements (like texts or headers), hide them here.
    }

    color (i)
    {
        return 0x001100 * (i % 15) + 0x000033 * (i % 5);
    }

    update(){
        this.displayCurrentHeroCoins();

        if(this.shapes){
        this.shapes.forEach(function (shape, i) {
            shape.x += (1 + 0.1 * i);
            shape.y += (1 + 0.1 * i);
        });

        Phaser.Actions.WrapInRectangle(this.shapes, this.rect, 72);

        this.shapesGraphics.clear();
        this.shapes.forEach((shape, i) => {
            this.shapesGraphics
            .fillStyle(this.color(i), 0.5)
            .fillCircleShape(shape);
        }, this);
    }

    }
}

class AlignGrid {
    constructor(config) {
        this.config = config;
        this.scene = config.scene;
        this.cw = this.scene.sys.game.config.width;   // canvas width
        this.ch = this.scene.sys.game.config.height;  // canvas height

        this.cw = this.scene.sys.game.config.width;
        this.ch = this.scene.sys.game.config.height;
        this.rows = config.rows;
        this.cols = config.cols;
        this.cellWidth = this.cw / this.cols;
        this.cellHeight = this.ch / this.rows;
    }

    placeAt(xx, yy, obj) {
        let x2 = this.cellWidth * xx + this.cellWidth / 2;
        let y2 = this.cellHeight * yy + this.cellHeight / 2;
        obj.x = x2;
        obj.y = y2;
    }

    getCellWidth() {
        return this.scene.sys.game.config.width / this.cols;
    }
    
    getCellHeight() {
        return this.scene.sys.game.config.height / this.rows;
    }

    // A helper method to place text at a given cell
    placeTextAt(xx, yy, text) {
        let x2 = this.cellWidth * xx + this.cellWidth / 2;
        let y2 = this.cellHeight * yy + this.cellHeight / 2;
        let txt = this.scene.add.text(x2, y2, text, { color: '#ff0000', fontSize: '16px',
        fontFamily: 'PixelAE' });
        txt.setOrigin(0.5, 0.5);  // To center the text in the cell
        txt.setDepth(6);
        txt.setScrollFactor(0);  // If you don't want the text to scroll with the camera
    }

    show() {
        this.graphics = this.scene.add.graphics();
        this.graphics.lineStyle(2, 0xff0000, 0.5);
    
        for (let i = 0; i < this.cw; i += this.cellWidth) {
            this.graphics.moveTo(i, 0);
            this.graphics.lineTo(i, this.ch);
    
            for (let j = 0; j < this.ch; j += this.cellHeight) {
                if (i === 0) {
                    // Placing the row numbers on the first column
                    this.placeTextAt(0, j / this.cellHeight, (j / this.cellHeight).toString());
                }
            }
    
            // Placing the column numbers on the first row
            this.placeTextAt(i / this.cellWidth, 0, (i / this.cellWidth).toString());
        }
    
        for (let i = 0; i < this.ch; i += this.cellHeight) {
            this.graphics.moveTo(0, i);
            this.graphics.lineTo(this.cw, i);
        }
    
        this.graphics.strokePath();
    
        // Set depth and scroll factor
        this.graphics.setDepth(6);
        this.graphics.setScrollFactor(0);
    
        // Adding the "Weapon Shop" text across the specified cells
    }
}


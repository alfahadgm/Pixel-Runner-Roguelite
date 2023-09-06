class Utils {
    constructor(scene) {
        this.scene = scene;
        this.screenWidth = scene.game.config.width;
        this.screenHeight = scene.game.config.height;
    }

    isOutOfBounds(entity) {
        const maxDistance = this.calculateDistance(0, 0, this.screenWidth, this.screenHeight) * 2;
        const distance = this.calculateDistance(this.scene.hero.x, this.scene.hero.y, entity.x, entity.y);
        return distance > maxDistance;
    }

    calculateDistance(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    }

    initWorldView() {
        const centerOffset = (this.chunkSize * this.tileSize) / 2;
        this.scene.followPoint = new Phaser.Math.Vector2(centerOffset, centerOffset);
    }

    findNearestEnemy(hero) {
        let nearestEnemy = null;
        let nearestDistance = Infinity;

        this.scene.enemyManager.enemies.getChildren().forEach(enemy => {
            const distance = Phaser.Math.Distance.Between(hero.x, hero.y, enemy.x, enemy.y);
            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearestEnemy = enemy;
            }
        });

        return nearestEnemy;
    }

    initKeyboardControls() {
        const keys = {
            up: 'UP', down: 'DOWN', left: 'LEFT', right: 'RIGHT',
            HKey: 'H', KKey: 'K', EnterKey: 'ENTER',
            W: 'W', A: 'A', S: 'S', D: 'D'
        };
        this.scene.keys = this.scene.input.keyboard.createCursorKeys();
        for (let key in keys) {
            this.scene.keys[key] = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[keys[key]]);
        }
    }


/** DISPLAY **/
    displayDamageText(x, y, damage, isCritical) {
        damage = Math.round(damage); // Round to nearest whole number

        const color = isCritical ? 'red' : 'grey'; // Choosing sprite sheet based on critical hit

        // Convert damage to array of digits
        const digits = Array.from(String(damage), Number).map(digit => (digit === 0) ? 9 : digit - 1);

        const spacing = 6; // Assuming each digit sprite has a width of 6
        const startx = x - (spacing * digits.length) / 2; // Start position for centering the numbers

        digits.forEach((digit, index) => {
            const numberSprite = this.scene.add.sprite(startx + index * spacing, y, `${color}Numbers`, digit).setOrigin(0.5, 0.5);
            numberSprite.setDepth(3);

            // Animate the sprite: Move upwards while fading out over 0.5 seconds
            this.scene.tweens.add({
                targets: numberSprite,
                y: y - 50,     // Move 50 pixels up
                alpha: 0,      // Fade out
                duration: 500, // 0.5 seconds
                onComplete: () => {
                    numberSprite.destroy();
                }
            });
        });
    }


    // In your main scene class
    displayCollectableText(x, y, text) {
        const style = {
            color: 'yellow', fontSize: '16px',
            fontFamily: 'PixelAE'
        };
        const collectableText = this.scene.add.text(x, y, text, style).setOrigin(0.5, 0.5); // Centering the text
        collectableText.setDepth(3);

        // Animate the text: Move upwards while fading out over 0.5 seconds
        this.scene.tweens.add({
            targets: collectableText,
            y: y - 50,     // Move 50 pixels up
            alpha: 0,      // Fade out
            duration: 500, // 0.5 seconds
            onComplete: () => {
                collectableText.destroy();
            }
        });
    }
}
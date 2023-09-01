class Collectable extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setDepth(1);

        this.setOrigin(0.5, 0.5);
        this.setVisible(true);
        this.setActive(true);
        this.setInteractive();


        const bodyWidth = this.scene.hero.heroStats.magnetSize;
        const bodyHeight = this.scene.hero.heroStats.magnetSize;
        const offsetX = (this.width - bodyWidth) / 2;
        const offsetY = (this.height - bodyHeight) / 2;
        
        this.body.setSize(bodyWidth, bodyHeight);
        this.body.setOffset(offsetX, offsetY);

        this.play(texture, true);

        this.followSpeed = 100;
        this.maxFollowSpeed = 300;
        
        this.isActivated = false; // New flag to determine if collectable should follow player
    }

    activate() {
        this.isActivated = true;
    }

    update(player) {
        if (!this.isActivated) return;
    
        const dx = player.x - this.x;
        const dy = player.y - this.y;
    
        // Check if the center of the collectable sprite is over the player's center position
        if (Math.abs(dx) <= this.width / 2 && Math.abs(dy) <= this.height / 2) {
            this.applyEffect(player);  // Apply the effect based on the collectable type
            this.destroy();
            return;
        }
    
        const angle = Math.atan2(dy, dx);
        this.body.setVelocityX(Math.cos(angle) * this.followSpeed);
        this.body.setVelocityY(Math.sin(angle) * this.followSpeed);
    
        // Increase follow speed but cap it to maxFollowSpeed
        this.followSpeed = Math.min(this.followSpeed + 5, this.maxFollowSpeed);
    }
    
    applyEffect(player) {
        let displayText = ""; // Initialize the display text
    
        switch(this.type) {
            case 'goldCoin':
                const goldValue = 500*player.heroStats.coinsModifier;
                player.heroStats.modifyAttributeByValue('coins', goldValue);
                displayText = `+${Math.round(goldValue)} COINS`;
                this.scene.assetLoader.xp.play({
                    loop: false
                });
                break;
    
            case 'silverCoin':
                const silverValue = 200*player.heroStats.coinsModifier;
                player.heroStats.modifyAttributeByValue('coins', silverValue);
                displayText = `+${Math.round(silverValue)} COINS`;
                this.scene.assetLoader.xp.play({
                    loop: false
                });
                break;
    
            case 'bronzeCoin':
                const bronzeValue = 100*player.heroStats.coinsModifier;
                player.heroStats.modifyAttributeByValue('coins', bronzeValue);
                displayText = `+${Math.round(bronzeValue)} COINS`;
                this.scene.assetLoader.xp.play({
                    loop: false
                });
                break;
    
            case 'heart':
                const healValue = 10;
                player.heroStats.heal(healValue);
                displayText = `+${Math.round(healValue)} HP`;
                this.scene.assetLoader.health.play({
                    loop: false
                });
                break;
    
            case 'heartmax':
                // Let's say it increases the max health by 10%.
                const percentageIncrease = 50;
                player.heroStats.modifyAttributeByPercentage('health', percentageIncrease);
                displayText = `+${percentageIncrease}% HP`;
                this.scene.assetLoader.upgrade.play({
                    loop: false
                });
                break;
    
            case 'xplow':
                const lowXPValue = 20*player.heroStats.xpModifier;
                player.heroStats.modifyAttributeByValue('xp', lowXPValue);
                displayText = `+${Math.round(lowXPValue)} XP`;
                this.scene.assetLoader.xp.play({
                    loop: false
                });
                break;
    
            case 'xpmid':
                const midXPValue = 100*player.heroStats.xpModifier;
                player.heroStats.modifyAttributeByValue('xp', midXPValue);
                displayText = `+${Math.round(midXPValue)} XP`;
                this.scene.assetLoader.xp.play({
                    loop: false
                });
                break;
    
            case 'xphigh':
                const highXPValue = 500*player.heroStats.xpModifier;
                player.heroStats.modifyAttributeByValue('xp', highXPValue);
                displayText = `+${Math.round(highXPValue)} XP`;
                this.scene.assetLoader.xp.play({
                    loop: false
                });
                break;
    
            case 'ammo':
                const ammoValue = 5*player.heroStats.ammoModifier;
                player.currentWeapon.weaponStats.modifyAttributeByValue('totalAmmo', ammoValue);
                displayText = `+${Math.round(ammoValue)} AMMO`;
                break;
    
            default:
                console.warn(`No effect defined for collectable type: ${this.type}`);
                break;
        }
    
        // Display the collectable text if there's a value to show
        if (displayText) {
            this.scene.displayCollectableText(this.x, this.y, displayText);
        }
    }
}    



class Ammo extends Collectable {
    constructor(scene, x, y) {
        const TEXTURE = 'ammo'; // This should match the spritesheet key used for the animation
        super(scene, x, y, TEXTURE);
        this.type = 'ammo';
    }
}

class GoldCoin extends Collectable {
    constructor(scene, x, y) {
        const TEXTURE = 'gold-coin-rotate'; // This should match the spritesheet key used for the animation
        super(scene, x, y, TEXTURE);
        this.type = 'goldCoin';
    }
}

class SilverCoin extends Collectable {
    constructor(scene, x, y) {
        const TEXTURE = 'silver-coin-rotate'; // This should match the spritesheet key used for the animation
        super(scene, x, y, TEXTURE);
        this.type = 'silverCoin';
    }
}

class BronzeCoin extends Collectable {
    constructor(scene, x, y) {
        const TEXTURE = 'bronze-coin-rotate'; // This should match the spritesheet key used for the animation
        super(scene, x, y, TEXTURE);
        this.type = 'bronzeCoin';
    }
}

class Heart extends Collectable {
    constructor(scene, x, y) {
        const TEXTURE = 'heart-rotate'; // This should match the spritesheet key used for the animation
        super(scene, x, y, TEXTURE);
        this.type = 'heart';
    }
}

class HeartMax extends Collectable {
    constructor(scene, x, y) {
        const TEXTURE = 'heart-max-rotate'; // This should match the spritesheet key used for the animation
        super(scene, x, y, TEXTURE);
        this.type = 'heartmax';
    }
}

class XPOrbLow extends Collectable {
    constructor(scene, x, y) {
        const TEXTURE = 'xporb-low'; // This should match the spritesheet key used for the animation
        super(scene, x, y, TEXTURE, 0);
        this.type = 'xplow';
    }
}

class XPOrbMid extends Collectable {
    constructor(scene, x, y) {
        const TEXTURE = 'xporb-mid'; // This should match the spritesheet key used for the animation
        super(scene, x, y, TEXTURE, 0);
        this.type = 'xpmid';
    }
}

class XPOrbHigh extends Collectable {
    constructor(scene, x, y) {
        const TEXTURE = 'xporb-high'; // This should match the spritesheet key used for the animation
        super(scene, x, y, TEXTURE, 0);
        this.type = 'xphigh';
    }
}
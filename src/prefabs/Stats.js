//HeroStats.js
class HeroStats {
    constructor(health = 100, armor = 0, shield = 0, movementSpeed = 1, xp = 0, level = 1) {
        this.health = health;
        this.armor = armor;
        this.shield = shield;
        this.movementSpeed = movementSpeed;
        this.xp = xp;
        this.level = level;
        this.xpThresholds = [100, 300, 600, 1000, 1500]; // Sample XP thresholds for levels 2 to 6.
    }

    // Modify attributes by a specific percentage
    modifyAttributeByPercentage(attribute, percentage) {
        if (this[attribute] !== undefined) {
            this[attribute] *= (1 + (percentage / 100));
        } else {
            console.error(`Attribute "${attribute}" not found.`);
        }
    }

    // Modify attributes by a fixed number
    modifyAttributeByValue(attribute, value) {
        if (this[attribute] !== undefined) {
            this[attribute] += value;

            // Special logic for XP accumulation and level up
            if (attribute === "xp" && this.level < this.xpThresholds.length) {
                if (this.xp >= this.xpThresholds[this.level - 1]) {
                    this.levelUp();
                }
            }
        } else {
            console.error(`Attribute "${attribute}" not found.`);
        }
    }

    levelUp() {
        this.level++;
        
    }
}

//WeaponStats.js
class WeaponStats {
    constructor(damage, bulletSpeed, criticalChance, criticalDamage, maxRange) {
        this.damage = damage;
        this.bulletSpeed = bulletSpeed;
        this.criticalChance = criticalChance; // 0.1 is 10% chance
        this.criticalDamage = criticalDamage; // Multiplier for critical damage
        this.maxRange = maxRange;
    }

    modifyAttributeByPercentage(attribute, percentage) {
        if (this[attribute] !== undefined) {
            this[attribute] *= (1 + (percentage / 100));
        } else {
            console.error(`Attribute "${attribute}" not found.`);
        }
    }

    modifyAttributeByValue(attribute, value) {
        if (this[attribute] !== undefined) {
            this[attribute] += value;
        } else {
            console.error(`Attribute "${attribute}" not found.`);
        }
    }

    getDamage() {
        this.isCriticalHit = Math.random() < this.criticalChance;
        const finalDamage = this.isCriticalHit ? this.damage * this.criticalDamage : this.damage;
        
        
        return finalDamage;
    }
}
class HeroStats {
    constructor(scene, health = 100, armor = 0, shield = 0, movementSpeed = 1, xp = 0, level = 1, coins = 0) {
        this.scene = scene;
        this.health = health;
        this.maxhealth = health;
        this.armor = armor;
        this.shield = shield;
        this.maxshield = 20;
        this.movementSpeed = movementSpeed;
        this.xp = xp;
        this.level = level;
        this.coins = coins;
        this.xpThresholds = [10, 300, 600, 1000, 1500]; // Sample XP thresholds for levels 2 to 6.
    }

    // Modify attributes by a specific percentage
    modifyAttributeByPercentage(attribute, percentage) {
        if (this[attribute] !== undefined) {
            this[attribute] *= (1 + (percentage / 100));
        }
    }

    // Modify attributes by a fixed number
    modifyAttributeByValue(attribute, value) {
        if (this[attribute] !== undefined) {
            this[attribute] += value;

            // Special logic for XP accumulation and level up
            if (attribute === "xp" && this.level < this.xpThresholds.length) {
                if (this.xp >= this.xpThresholds[this.level - 1]) {
                    this.scene.hero.levelUp();
                }
            }
        }
    }
    

    // Heal method to increase health and shield without exceeding their max values
heal(amount) {
    if (typeof amount !== 'number' || isNaN(amount)) {
        console.error("Invalid heal amount");
        return;
    }

    // First heal the health up to its max value
    const healthDeficit = this.maxhealth - this.health;
    if (amount <= healthDeficit) {
        this.health += amount;
        return;  // Exit if all healing amount is consumed for health
    }

    // If there's excess healing after maxing out health
    this.health = this.maxhealth;  // Set health to its maximum value
    amount -= healthDeficit;  // Deduct the amount used to heal health to its max
    
    // Use the remaining amount to heal the shield up to its max value
    const shieldDeficit = this.maxshield - this.shield;
    if (amount <= shieldDeficit) {
        this.shield += amount;
    } else {
        this.shield = this.maxshield;  // Set shield to its maximum value
    }
}

}

class WeaponStats {
    constructor(
        damage, bulletSpeed, criticalChance, criticalDamage, maxRange, cooldown,
        // Energy weapon attributes
        energyCapacity = null, currentEnergyCapacity= null, usagePerShot = null, rechargeRate = null, overheatThreshold = null,
        // Explosive weapon attributes
        blastRadius = null, fuseTime = null, knockback = null,
        // Firearm attributes
        magazineSize = null, currentMagazine=null , totalAmmo = null, reloadTime = null, bulletType = null, penetration = null
    ) {
        // Basic weapon attributes
        this.damage = damage;
        this.bulletSpeed = bulletSpeed;
        this.criticalChance = criticalChance; 
        this.criticalDamage = criticalDamage;
        this.maxRange = maxRange;
        this.cooldown = cooldown;

        // Energy weapon attributes
        this.energyCapacity = energyCapacity;
        this.currentEnergyCapacity = currentEnergyCapacity;
        this.usagePerShot = usagePerShot;
        this.rechargeRate = rechargeRate;
        this.overheatThreshold = overheatThreshold;

        // Explosive weapon attributes
        this.blastRadius = blastRadius;
        this.fuseTime = fuseTime;
        this.knockback = knockback;

        // Firearm attributes
        this.magazineSize = magazineSize;
        this.currentMagazine = currentMagazine;
        this.totalAmmo = totalAmmo;
        this.reloadTime = reloadTime;
        this.bulletType = bulletType; // e.g., "standard", "hollow-point", "armor-piercing"
        this.penetration = penetration; // A value representing bullet penetration (can be a percentage or flat value)
    }

    modifyAttributeByPercentage(attribute, percentage) {
        if (this[attribute] !== undefined) {
            this[attribute] *= (1 + (percentage / 100));
        } else {
            
        }
    }

    modifyAttributeByValue(attribute, value) {
        if (this[attribute] !== undefined) {
            this[attribute] += value;
        } else {
            
        }
    }

    getDamage(distanceFromImpact = 0) {
        let finalDamage = this.damage;
        
        // Critical hit chance
        if (this.criticalChance != null) {
            const isCriticalHit = Math.random() < this.criticalChance;
            if (isCriticalHit && this.criticalDamage != null) {
                finalDamage *= this.criticalDamage;
            }
        }
        
        // For Energy Weapons: Overheating Mechanism
        if (this.energyCapacity != null && this.overheatThreshold != null) {
            const energyLeftPercentage = this.energyCapacity / 100;
            if (energyLeftPercentage < this.overheatThreshold) {
                finalDamage *= 0.75; // Example: Reduce damage by 25% when overheated
            }
        }
        
        // For Explosive Weapons: Proximity Damage Calculation
        if (this.blastRadius != null) {
            const proximityFactor = 1 - (distanceFromImpact / this.blastRadius);
            finalDamage += finalDamage * proximityFactor; // The closer the enemy to the center of the blast, the more damage
        }
        
        // For Firearms: Bullet Type Damage Modification
        if (this.bulletType != null) {
            switch (this.bulletType) {
                case "hollow-point":
                    finalDamage *= 1.2; // Example: Increase damage by 20%
                    break;
                case "armor-piercing":
                    finalDamage *= 0.9; // Example: Reduce damage but penetrates armor
                    break;
                default:
                    // Standard bullet, no modification
                    break;
            }
        }
        
        return finalDamage;
    }
}    

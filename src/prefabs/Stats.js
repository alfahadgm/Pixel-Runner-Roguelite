class HeroStats {
    constructor(scene, health = 100, armor = 0, shield = 0, movementSpeed = 1.2, xp = 0, level = 1, coins = 150   ) {
        this.scene = scene;
        this.health = health;
        this.maxhealth = health;
        this.armor = armor;
        this.shield = shield;
        this.maxshield = 20;
        this.shieldGenerationRate = 1;
        this.shieldRegenerationInterval = 2000;
        this.magnetSize = 40;
        this.coinsModifier = 1;
        this.ammoModifier = 1;
        this.xpModifier = 1;
        this.canDash = true;
        this.dashCooldown = 5000;
        this.movementSpeed = movementSpeed;
        this.xp = xp;
        this.level = level;
        this.coins = coins;
        this.xpThresholds = [100]; 
        this.generateXpThresholds();
    }

    generateXpThresholds() {
        let multiplier = 1.5;
        let decrementValue = 0.01; // This value will decrement the multiplier on each iteration.
    
        while (this.xpThresholds.length < 100) {
            let lastXp = this.xpThresholds[this.xpThresholds.length - 1];
            let nextXp = Math.round(lastXp * multiplier / 100) * 100; 
    
            this.xpThresholds.push(nextXp);
    
            // Decrease the multiplier but never let it go below 1.1
            multiplier = Math.max(multiplier - decrementValue, 1.1);
        }
    }

    levelUp() {
        if (this.level < this.xpThresholds.length) {
            this.level++;
            this.scene.assetLoader.musicControl(0, 1); 
            this.scene.pauseGame();
            this.scene.upgrades.displayRandomHeroUpgrades();
            // Add other level-up logic if needed, e.g., increasing health, etc.
            this.scene.assetLoader.levelup.play({
                loop: false
            });
        }
    }

    startShieldRegeneration(interval = 1000) {
        // Make sure we don't start multiple intervals for regeneration.
        if (this.shieldRegenerationInterval) {
            clearInterval(this.shieldRegenerationInterval);
        }

        this.shieldRegenerationInterval = setInterval(() => {
            if (this.shield < this.maxshield) {
                this.shield += this.shieldGenerationRate;
                if (this.shield > this.maxshield) {
                    this.shield = this.maxshield;
                }
            }
        }, interval);
    }

    stopShieldRegeneration() {
        if (this.shieldRegenerationInterval) {
            clearInterval(this.shieldRegenerationInterval);
            this.shieldRegenerationInterval = null;
        }
    }

    modifyAttributeByPercentage(attribute, percentage) {
        if (this[attribute] !== undefined) {
            this[attribute] *= (1 + (percentage / 100));
        }
    }

    modifyAttributeByValue(attribute, value) {
        if (this[attribute] !== undefined) {
            this[attribute] += value;

            if (attribute === "xp" && this.level < this.xpThresholds.length) {
                if (this.xp >= this.xpThresholds[this.level - 1]) {
                    this.levelUp();
                }
            }
        }
    }

    getDamage(rawDamage) {
        // Calculate post-mitigation damage based on armor formula.
        const postMitigationDamage = rawDamage / (1 + (this.armor / 100));
    
        // Damage Reduction Percentage (optional, just to show the calculation)
        const damageReductionPercentage = 1 - (postMitigationDamage / rawDamage);
    
        // Effective Health Increase (optional, just to show the calculation)
        const effectiveHealthIncrease = (rawDamage / postMitigationDamage) - 1;
    
        // If the hero has a shield
        if (this.shield > 0) {
            // If shield can absorb all the post-mitigation damage
            if (this.shield >= postMitigationDamage) {
                this.shield -= postMitigationDamage;
                return; // No damage to health
            } else {
                // Damage will hit both shield and health
                const damageToHealth = postMitigationDamage - this.shield;
                this.shield = 0; // Shield is fully depleted
                this.health -= damageToHealth;
            }
        } else {
            // No shield, so health takes the full hit
            this.health -= postMitigationDamage;
        }
    
        // Ensure health doesn't go below zero
        if (this.health < 0) {
            this.health = 0;
        }
    }
    

    

    // Heal method to increase health and shield without exceeding their max values
heal(amount) {
    if (typeof amount !== 'number' || isNaN(amount)) {
        console.error("Invalid heal amount");
        return;
    }
    const healthDeficit = this.maxhealth - this.health;
    if (amount <= healthDeficit) {
        this.health += amount;
        return;
    }

    this.health = this.maxhealth;
    amount -= healthDeficit;

}

}

class WeaponStats {
    constructor(
        scene,
        damage, bulletSpeed, criticalChance, criticalDamage, maxRange, cooldown,
        // Energy weapon attributes
        energyCapacity = null, currentEnergyCapacity= null, usagePerShot = null, rechargeRate = null, overheatThreshold = null,
        // Explosive weapon attributes
        blastRadius = null, fuseTime = null, knockback = null,
        // Firearm attributes
        magazineSize = null, currentMagazine=null , totalAmmo = null, reloadTime = null, bulletType = null, penetration = null
    ) {
        // Basic weapon attributes
        this.scene = scene;
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
                this.scene.assetLoader.crit.play({
                    loop: false
                });
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

        this.scene.assetLoader.hit.play({
            loop: false
        });
        return finalDamage;
    }
}    

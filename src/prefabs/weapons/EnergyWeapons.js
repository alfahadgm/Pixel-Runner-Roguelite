class EnergyWeapon extends Weapon {
    constructor(scene, weaponStats, color, name) {
        super(scene, weaponStats, color, name);
        this.isOverheated = false;
    }

    update() {
        
        this.passiveRecharge();
        this.coolDown();
    }

    coolDown() {
        
        if (this.isOverheated && this.weaponStats.currentEnergyCapacity < this.weaponStats.energyCapacity) {
            this.weaponStats.currentEnergyCapacity += this.weaponStats.rechargeRate;
            
            if (this.weaponStats.currentEnergyCapacity >= this.weaponStats.energyCapacity) {
                this.isOverheated = false;
                
            }
        }
    }

    passiveRecharge() {
        
        if (this.weaponStats.currentEnergyCapacity < this.weaponStats.energyCapacity && !this.isOverheated) {
            this.weaponStats.currentEnergyCapacity += this.weaponStats.rechargeRate;
            
            if (this.weaponStats.currentEnergyCapacity > this.weaponStats.energyCapacity) {
                this.weaponStats.currentEnergyCapacity = this.weaponStats.energyCapacity;
            }
        }
    }

    fire(x, y, currentTime) {
        if (this.isReadyToFire(currentTime) && this.weaponStats.currentEnergyCapacity > 0) {
            this.weaponStats.currentEnergyCapacity -= this.weaponStats.usagePerShot;
            super.fire(x, y, currentTime);

            if (this.weaponStats.currentEnergyCapacity <= 0) {
                this.isOverheated = true;
                this.overheatHandler();
            }
        } else {
            
        }
    }

    overheatHandler() {
        
    }

    createBullet(x, y) {
        
        return new EnergyBullet(this.scene, this.weaponStats, x, y);
    }

    isReadyToFire(currentTime) {
        const isWeaponCooledDown = currentTime > this.lastFired + this.weaponStats.cooldown;
        
        return isWeaponCooledDown && !this.isOverheated;
    }
}

class PlasmaRifle extends EnergyWeapon {
    constructor(scene, color, name="PlasmaRifle") {
        // Creating a weaponStatsInstance with the following parameters:
        const weaponStatsInstance = new WeaponStats(
            50,                 // Damage
            800,                // Bullet Speed
            0.1,                // Critical Chance (10%)
            2.5,                // Critical Damage Multiplier
            500,                // Max Range
            1000,               // Cooldown (1000 units, e.g. milliseconds)
            100,                // Energy Capacity
            100,                // Current Energy Capacity
            5,                  // Usage Per Shot
            0.01,                  // Recharge Rate (e.g., energy points per unit time)
            90,                 // Overheat Threshold (when the energy reaches this, the weapon can overheat)
            null,               // Blast Radius (Not applicable for PlasmaRifle)
            null,               // knockback
            null,               // Fuse Time (Not applicable for PlasmaRifle)
            null,               // Magazine Size (Not applicable for PlasmaRifle since it uses energy)
            null,               // Total Ammo (Not applicable for PlasmaRifle since it uses energy)
            null,               // Reload Time (Not applicable for PlasmaRifle since it recharges)
            null,               // Bullet Type (Can be null or specify a special type for plasma rounds)
            null                // Penetration (Can be null or specify a value if needed)
        );
        super(scene, weaponStatsInstance, color, name);
    }
}

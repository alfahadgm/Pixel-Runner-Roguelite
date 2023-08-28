class Firearm extends Weapon {
    constructor(scene, weaponStats, color, name) {
        super(scene, weaponStats, color, name);
        this.isReloading = false;
    }

    fire(x, y, currentTime) {
        if (this.isReadyToFire(currentTime)) {
            super.fire(x, y, currentTime);
        }
    }
    
    launchProjectile(x, y, direction) {
        if (this.isOutOfAmmo()) {
            this.outOfAmmoHandler();
            return; // Do not continue if there's no ammo.
        }

        super.launchProjectile(x, y, direction);
        this.weaponStats.currentMagazine--;
        this.lastFired = this.scene.time.now;
    }
    
    isReadyToFire(currentTime) {
        const isWeaponCooledDown = currentTime > this.lastFired + this.weaponStats.cooldown;
        const hasAmmo = !this.isOutOfAmmo();
        const notReloading = !this.isReloading;
        
        if (!hasAmmo) {
            this.outOfAmmoHandler();
            return false; // Cannot fire without ammo
        }

        return isWeaponCooledDown && notReloading;
    }

    outOfAmmoHandler() {
        if (!this.isReloading) {
            this.reload();
        }
    }

    reload() {
        
        if (this.weaponStats.totalAmmo <= 0) {
            return;
        }
        
        this.isReloading = true;
        this.scene.time.delayedCall(this.weaponStats.reloadTime, () => {
            
            const bulletsToReload = Math.min(this.weaponStats.magazineSize - this.weaponStats.currentMagazine, this.weaponStats.totalAmmo);
            this.weaponStats.currentMagazine += bulletsToReload;
            this.weaponStats.totalAmmo -= bulletsToReload;
            if (this.weaponStats.totalAmmo < 0) this.weaponStats.totalAmmo = 0;
            this.isReloading = false;
            });
    }

    isOutOfAmmo() {
        return this.weaponStats.currentMagazine === 0;
    }


    createBullet(x, y) {
        return new FirearmBullet(this.scene, this.weaponStats, x, y);
    }
}

    class Pistol extends Firearm {
        constructor(scene, color, name="Pistol") {
            // Creating a weaponStatsInstance with the following parameters:
            const weaponStatsInstance = new WeaponStats(
                15,                 // Damage
                500,                // Bullet Speed
                0.05,               // Critical Chance (5%)
                2.0,                // Critical Damage Multiplier
                100,                // Max Range
                300,                // Cooldown (300 units, e.g. milliseconds)
                null,               // Energy Capacity (Not applicable for Pistol)
                null,               // Current Energy Capacity (Not applicable for Pistol)
                null,               // Usage Per Shot (Not applicable for Pistol)
                null,               // Recharge Rate (Not applicable for Pistol)
                null,               // Overheat Threshold (Not applicable for Pistol)
                null,               // Blast Radius (Not applicable for Pistol)
                null,               // knockback
                null,               // Fuse Time (Not applicable for Pistol)
                10,                 // Magazine Size
                10,                 // Current Magazine
                9999,                 // Total Ammo
                600,                // Reload Time
                "standard",         // Bullet Type
                0.1                 // Penetration
            );
            super(scene, weaponStatsInstance, color, name);
        }
    }
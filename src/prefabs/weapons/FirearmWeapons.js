class Firearm extends Weapon {
    constructor(scene, weaponStats, color, name) {
        super(scene, weaponStats, color, name);
        this.isReloading = false;
    }

    fire(x, y, currentTime) {
        if (this.isReadyToFire(currentTime)) {
            super.fire(x, y, currentTime);
        } else {
            this.outOfAmmoHandler();
        }
    }
    
    launchProjectile(x, y, direction) {
        super.launchProjectile(x, y, direction);
        this.weaponStats.currentMagazine--;
        this.lastFired = this.scene.time.now;
        
        if (this.isOutOfAmmo() && !this.isReloading) {
            this.outOfAmmoHandler();
        }
    }
    
    isReadyToFire(currentTime) {
        const isWeaponCooledDown = currentTime > this.lastFired + this.weaponStats.cooldown;
        const hasAmmo = !this.isOutOfAmmo();
        const notReloading = !this.isReloading;
        return isWeaponCooledDown && hasAmmo && notReloading;
    }

    outOfAmmoHandler() {
        if (!this.isReloading) {
            this.reload();
        }
    }

    reload() {
        console.log("Trying to reload...");
        
        if (this.weaponStats.totalAmmo <= 0) {
            console.log("No ammo left to reload.");
            return;
        }
        
        this.isReloading = true;
        this.scene.time.delayedCall(this.weaponStats.reloadTime, () => {
            console.log("Reloading...");
            
            const bulletsToReload = Math.min(this.weaponStats.magazineSize - this.weaponStats.currentMagazine, this.weaponStats.totalAmmo);
            this.weaponStats.currentMagazine += bulletsToReload;
            this.weaponStats.totalAmmo -= bulletsToReload;
            if (this.weaponStats.totalAmmo < 0) this.weaponStats.totalAmmo = 0;
            this.isReloading = false;
    
            console.log("Reloaded", bulletsToReload, "bullets.");
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
                200,                // Max Range
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
                50,                 // Total Ammo
                600,                // Reload Time
                "standard",         // Bullet Type
                0.1                 // Penetration
            );
            super(scene, weaponStatsInstance, color, name);
        }
    }
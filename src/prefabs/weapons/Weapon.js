class Weapon {
    constructor(scene, weaponStats, color, name) {
        this.scene = scene;
        this.weaponStats = weaponStats;
        this.color = color;
        this.name = name;
        this.lastFired = 0;
        this.isReloading = false;
    }

    fire(x, y) {
        if (this.isReadyToFire()) {
            const nearestEnemy = this.scene.utils.findNearestEnemy(this.scene.hero);
            if (nearestEnemy) {
                const distanceToEnemy = Math.sqrt((nearestEnemy.x - x) ** 2 + (nearestEnemy.y - y) ** 2);
                if (distanceToEnemy <= this.weaponStats.maxRange) {
                    const direction = this._computeDirectionTowardsEnemy(x, y, nearestEnemy.x, nearestEnemy.y);
                    this.launchProjectile(x, y, direction);
                }
            }
        }
    }

    launchProjectile(x, y, direction) {
        if (this.isOutOfAmmo()) {
            this._handleEmptyMagazine();
            return;
        }
        let bullet = this._spawnBullet(x, y);
        bullet.fire(x, y, direction);
        this.weaponStats.currentMagazine--;
        this.lastFired = this.scene.time.now;
    }

    isReadyToFire() {
        const hasAmmo = !this.isOutOfAmmo();
        const notReloading = !this.isReloading;
        
        if (!hasAmmo) {
            this._handleEmptyMagazine();
            return false;
        }
    
        return notReloading;
    }

    isOutOfAmmo() {
        return this.weaponStats.currentMagazine === 0;
    }

    _handleEmptyMagazine() {
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

    _spawnBullet(x, y) {
        return new Bullet(this.scene, x, y, 'bullet', null, this.weaponStats);
    }
    
    _computeDirectionTowardsEnemy(sourceX, sourceY, targetX, targetY) {
        const diffX = targetX - sourceX;
        const diffY = targetY - sourceY;
        const magnitude = Math.sqrt(diffX * diffX + diffY * diffY);
        return {
            velocityX: diffX / magnitude,
            velocityY: diffY / magnitude
        };
    }

    getDamage() {
        // Specific logic for Rifle's damage
        return super.getDamage();
    }
}

class WeaponFactory {
    static getWeapons(scene) {

        return [
            new Pistol(scene, 0xFFFF00),
        ];
    }
}

class Pistol extends Weapon {
    constructor(scene, color, name="Pistol") {
        // Creating a weaponStatsInstance with the following parameters:
        const weaponStatsInstance = new WeaponStats(
            scene,
            15,                 // Damage
            500,                // Bullet Speed
            0.02,               // Critical Chance (5%)
            1.2,                // Critical Damage Multiplier
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
            9,                 // Magazine Size
            10,                 // Current Magazine
            9999,               // Total Ammo
            600,                // Reload Time
            "standard",         // Bullet Type
            0.1                 // Penetration
        );
        super(scene, weaponStatsInstance, color, name);
    }
}


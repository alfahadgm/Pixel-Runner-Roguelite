class Weapon {
    constructor(scene, weaponStats, name) {
        this.scene = scene;
        this.weaponStats = weaponStats;
        this.name = name;
        this.lastShotTime = 0;
        this.weaponUpgradeCosts = {};
    }

    canShoot(cooldownTime) {
        const currentTime = this.scene.time.now;
        if (currentTime - this.lastShotTime >= cooldownTime) {
            this.lastShotTime = currentTime;
            return true;
        }
        return false;
    }

    fireFromPosition(x, y, direction, hero) {
        const cooldownTime = this.weaponStats.cooldown;
        if (this.canShoot(cooldownTime)) {
            const bullet = new Bullet(this.scene, this.weaponStats.bulletBlueprint, x, y);
            bullet.shootInDirection(x, y, direction);
        }
    }

    reload() {
        if (this.weaponStats.totalAmmo >= this.weaponStats.magazineSize) {
            this.weaponStats.totalAmmo -= this.weaponStats.magazineSize;
            this.weaponStats.currentMagazine = this.weaponStats.magazineSize;
        } else {
            this.weaponStats.currentMagazine = this.weaponStats.totalAmmo;
            this.weaponStats.totalAmmo = 0;
        }
    }

    hasAmmo() {
        return this.weaponStats.currentMagazine > 0;
    }

    getDirectionToTarget(sourceX, sourceY, targetX, targetY) {
        const diffX = targetX - sourceX;
        const diffY = targetY - sourceY;
        const magnitude = Math.sqrt(diffX * diffX + diffY * diffY);
        return {
            velocityX: diffX / magnitude,
            velocityY: diffY / magnitude
        };
    }

    getDamage() {
        return this.weaponStats.damage;
    }
}

// Here is the new weapon call
class WeaponFactory {
    static getWeapons(scene) {
        const pistolBulletBlueprint = new BulletBlueprint(
            "pistolBullet", 
            500, 
            'Electric', { damageEverySecond: 10, stunDuration: 150,}, 
            'Ricochet', { bounces: 1, damageModifierEachBounce: 0.75}, 
            'Leeching', { leechPercentage: 5 },
            'Steel', { knockBackAmount: 5 }
        );

        const pistolStats = new WeaponStats(
            20, 5, 0.1, 2.0, 300, 500, 10, 10, 100, 1.2, pistolBulletBlueprint
        );

        
        return [new Weapon(scene, pistolStats, "Pistol")];
    }
}
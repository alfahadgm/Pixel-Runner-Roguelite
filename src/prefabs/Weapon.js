const DIRECTIONS = {
    'right': { velocityX: 1, velocityY: 0 },
    'up': { velocityX: 0, velocityY: -1 },
    'left': { velocityX: -1, velocityY: 0 },
    'down': { velocityX: 0, velocityY: 1 }
};

class Weapon {
    constructor(scene, weaponStats, color, cooldown, name) {

        this.scene = scene;
        this.weaponStats = weaponStats;
        this.color = color;
        this.name = name;
        this.cooldown = cooldown;
        this.bullets = this.scene.add.group({
            classType: Bullet,
            maxSize: 10,
            runChildUpdate: true
        });
    }

    fire(x, y) {
        // Find the nearest enemy
        const nearestEnemy = this.scene.findNearestEnemy(this.scene.hero);

        if (nearestEnemy) {
            // Calculate distance to the nearest enemy
            const distanceToEnemy = Math.sqrt((nearestEnemy.x - x) ** 2 + (nearestEnemy.y - y) ** 2);

            // Check if the distance to the nearest enemy is within the weapon's max range
            if (distanceToEnemy <= this.weaponStats.maxRange) {
                // Get the direction to the nearest enemy
                const direction = this.getDirectionToTarget(x, y, nearestEnemy.x, nearestEnemy.y);     
                const bullet = new Bullet(this.scene, this.weaponStats, x, y, 'bullet');
                this.scene.physics.add.collider(bullet, this.scene.enemyManager.enemies, this.scene.bulletHitenemy, null, this);
                
                if (this instanceof Firearm) {
                    this.currentMagazine--;  // Decrease magazine only if firing conditions are met
                }
                
                bullet.fire(x, y, direction);
            }
        }
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

}

class WeaponFactory {
    static getWeapons(scene) {
        //damage,bulletSpeed,criticalChance,criticalDamage
        let pistolStats = new WeaponStats(20, 300, 0.1, 2, 300); // Example max range of 300
        let sniperStats = new WeaponStats(200, 500, 0.3, 2, 1000); // Example max range of 1000
        let rifleStats = new WeaponStats(15, 300, 0.1, 2, 500); // Example max range of 500
        
        return [
            new Pistol(scene, pistolStats, 0xFFFF00, 500, "Pistol"),
            new Sniper(scene, sniperStats, 0xFF0000, 2000, "Sniper"),
            new Rifle(scene, rifleStats, 0xFF0000, 100, "Rifle")
        ];
    }
}

class Firearm extends Weapon {
    constructor(scene, weaponStats, color, cooldown, name, magazine, ammo, reloadTime) {
        super(scene, weaponStats, color, cooldown, name);
        this.magazine = magazine;
        this.ammo = ammo;
        this.currentMagazine = magazine;
        this.reloadTime = reloadTime;
        this.isReloading = false;
        this.isOutofAmmo = false;
    }

    fire(x, y, direction) {
        if (this.isReloading || this.currentMagazine <= 0) {
            this.outOfAmmoHandler();
            return;  // Don't fire
        }
        super.fire(x, y, direction);
    }

    outOfAmmoHandler() {
        if (this.currentMagazine <= 0 && !this.isReloading) {
            this.reload();
        }
    }

    reload() {
        if (this.ammo <= 0) {
            this.isOutofAmmo = true;
            
        } else if (!this.isOutofAmmo) {
            this.isReloading = true;
            this.scene.time.delayedCall(this.reloadTime, () => {
                const bulletsToReload = Math.min(this.magazine, this.ammo);
                this.currentMagazine = bulletsToReload;
                this.ammo -= bulletsToReload;
                this.isReloading = false;
            });
        }
    }
}

class Pistol extends Firearm {
    constructor(scene, weaponStats, color, cooldown, name = "Pistol") {
        super(scene, weaponStats, color, cooldown, name, 10, 50, 600);

    }
}

class Rifle extends Firearm {
    constructor(scene, weaponStats, color, cooldown, name = "Rifle") {
        super(scene, weaponStats, color, cooldown, name, 30, 120, 1000);

    }
}

class Sniper extends Firearm {
    constructor(scene, weaponStats, color, cooldown, name = "Sniper") {
        super(scene, weaponStats, color, cooldown, name, 2, 5, 2000);
    }
}
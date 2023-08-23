
const DIRECTIONS = {
    up: { endY: -1, velocityY: -1 },
    down: { endY: 1, velocityY: 1 },
    left: { endX: -1, velocityX: -1 },
    right: { endX: 1, velocityX: 1 }
};

class Weapon {
    constructor(scene, weaponStats, color, cooldown, name) {
        this.scene = scene;
        this.weaponStats = weaponStats;
        this.color = color;
        this.name = name;
        this.cooldown = cooldown;
        this.bullets = this.scene.physics.add.group({ classType: Bullet, runChildUpdate: true });
        this.lineBullets = [];
    }

    fire(x, y, direction) {
        let bullet = new Bullet(this.scene, this.weaponStats, x, y, 'bullet');
        bullet.fire(x, y, direction);
        
    }
}

class WeaponFactory {
    static getWeapons(scene) {
        let pistolStats = new WeaponStats(20, 100, 5.0, 60.0);
        let sniperStats = new WeaponStats(50, 500, 10.0, 100.0);
        return [
            new Pistol(scene, pistolStats, 0xFFFF00, 500, "Pistol"),
            new Sniper(scene, sniperStats, 0xFF0000, 2000, "Sniper")
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
        // Check if the firearm is currently reloading or out of ammo
        if (this.isReloading || this.currentMagazine <= 0) {
            this.outOfAmmoHandler();
            return;  // Don't fire
        }

        // Reduce the current magazine ammo count and proceed with firing
        this.currentMagazine--;
        super.fire(x, y, direction); // This calls the fire method of the parent (Weapon) class
    }


    outOfAmmoHandler() {
        console.log('Out of ammo! Need to reload.');
        if (this.currentMagazine <= 0 && !this.isReloading) {
            this.reload();
        }
    }

    reload() {
        console.log("Attempting to reload. Ammo left:", this.ammo);
        if (this.ammo <= 0) {
            this.isOutofAmmo = true;
            console.log("Out of Ammo");
        } else if (!this.isOutofAmmo) {
            this.isReloading = true;
            this.scene.time.delayedCall(this.reloadTime, () => {
                const bulletsToReload = Math.min(this.magazine, this.ammo);
                this.currentMagazine = bulletsToReload;
                this.ammo -= bulletsToReload;
                this.isReloading = false;
                console.log(`${this.name} reloaded.`);
            });
        }
    }
}

class Pistol extends Firearm {
    constructor(scene, weaponStats, color, cooldown, name = "Pistol") {
        super(scene, weaponStats, color, cooldown, name, 10, 50, 1000);
    }
}

class Sniper extends Firearm {
    constructor(scene, weaponStats, color, cooldown, name = "Sniper") {
        super(scene, weaponStats, color, cooldown, name, 2, 5, 5000);
    }
}
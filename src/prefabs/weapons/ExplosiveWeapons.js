class Explosive extends Weapon {
    constructor(scene, weaponStats, color, cooldown, name) {
        super(scene, weaponStats, color, cooldown, name);
        this.blastRadius = weaponStats.blastRadius;  // Radius in which the explosion affects enemies
        this.fuseTime = weaponStats.fuseTime;  // Time after which the explosive detonates
    }

    throw(x, y, direction) {
        const grenade = new Grenade(this.scene, this.weaponStats, x, y, 'grenade');
        this.scene.physics.add.collider(grenade, this.scene.enemyManager.enemies, this.scene.explosionHitEnemy, null, this);

        grenade.launch(x, y, direction); // This method should handle grenade motion based on given parameters

        // Handle explosion after fuseTime
        this.scene.time.delayedCall(this.fuseTime, () => {
            grenade.explode();
        });
    }
    createBullet(x, y) {
        return new Explosive(this.scene, this.weaponStats, x, y);
    }
}

class HandGrenade extends ExplosiveWeapon {
    constructor(scene, color, name="HandGrenade") {
        // Creating a weaponStatsInstance with the following parameters:
        const weaponStatsInstance = new WeaponStats(
            200,                // Damage
            null,               // Bullet Speed (Not applicable for HandGrenade)
            null,               // Critical Chance (Can be null or set to a certain value if grenades can have crits)
            null,               // Critical Damage Multiplier (Not applicable for HandGrenade)
            10,                 // Max Range (assuming this is the radius of maximum effective damage)
            5000,               // Cooldown (5 seconds, assuming you can't throw another until this time passes)
            null,               // Energy Capacity (Not applicable for HandGrenade)
            null,               // Usage Per Shot (Not applicable for HandGrenade)
            null,               // Recharge Rate (Not applicable for HandGrenade)
            null,               // Overheat Threshold (Not applicable for HandGrenade)
            20,                 // Blast Radius (20 units, e.g. meters)
            null,               // knockback
            3,                  // Fuse Time (3 seconds until detonation)
            null,               // Knockback (can be a value if you want explosions to have a knockback effect)
            null,               // Magazine Size (Not applicable for HandGrenade)
            null,               // Total Ammo (Not applicable for HandGrenade unless you specify total grenades carried)
            null,               // Reload Time (Not applicable for HandGrenade)
            null,               // Bullet Type (Not applicable for HandGrenade)
            null                // Penetration (Not applicable for HandGrenade)
        );
        super(scene, weaponStatsInstance, color, name);
    }
}

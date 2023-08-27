
class Weapon {
    constructor(scene, weaponStats, color, name) { // <-- Remove cooldown parameter here
        this.scene = scene;
        this.weaponStats = weaponStats;
        this.color = color;
        this.name = name;
        this.lastFired = 0;

    }

    fire(x, y, currentTime) {
        if (this.isReadyToFire(currentTime)) {
            const nearestEnemy = this.scene.findNearestEnemy(this.scene.hero);
            if (nearestEnemy) {
            
                const distanceToEnemy = Math.sqrt((nearestEnemy.x - x) ** 2 + (nearestEnemy.y - y) ** 2);
                console.log("Budget : " + this.scene.enemyManager.enemyBudget);

                if (distanceToEnemy <= this.weaponStats.maxRange) {
                    const direction = this.getDirectionToTarget(x, y, nearestEnemy.x, nearestEnemy.y);
                    this.launchProjectile(x, y, direction);
                } else {
            }
            }
        }
    }

    launchProjectile(x, y, direction) {
        
        let bullet = this.createBullet(x, y);
        bullet.fire(x, y, direction);
    }

    isReadyToFire(currentTime) {
        
        
        
        return currentTime > this.lastFired + this.weaponStats.cooldown;
    }

    createBullet(x, y) {
        return new Bullet(this.scene, this.weaponStats, x, y, 'bullet');
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
        // Specific logic for Rifle's damage
        return super.getDamage();  // This calls the base method, but you can add additional logic or replace entirely.
    }

}

class WeaponFactory {
    static getWeapons(scene) {

        return [
            new Pistol(scene, 0xFFFF00),
            // new PlasmaRifle(scene, 0x0000FF),
           // new HandGrenade(scene, 0x888888)
        ];
    }
}


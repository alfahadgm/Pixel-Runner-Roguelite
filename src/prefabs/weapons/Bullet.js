
class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, weaponStats) {
        super(scene, x, y, texture, frame, weaponStats);

        // Store reference to scene and weapon stats
        //this.scene = scene;
        this.weaponStats = weaponStats;

        // Add bullet to physics world and scene
        this.scene.physics.world.enable(this);
        this.scene.add.existing(this);

        // Bullet properties
        this.setDepth(2);
        this.setCollisionShape();

        // Default bullet state
        this.setActive(false).setVisible(false);

        this.scene.physics.add.collider(this, scene.enemyManager.enemies, this.bulletHitenemy, null, this);

    }

    // Set the bullet's circular collision shape
    setCollisionShape() {
        const radius = 10;
        this.body.setCircle(radius);
        this.body.setOffset(
            (this.width - radius * 2) / 2, 
            (this.height - radius * 2) / 2
        );
    }

    bulletHitenemy(bullet, enemy) {
        const damage = bullet.weaponStats.getDamage(); 
        enemy.decreaseHealth(damage);
        this.scene.displayDamageText(enemy.x, enemy.y, damage, bullet.weaponStats.isCriticalHit);
        enemy.tint = 0xEE4B2B;
        this.scene.time.delayedCall(100, () => {
            enemy.clearTint();
        });
    
        bullet.destroyBullet();
    }
    



    preDestroy() {
        this.scene.physics.world.disable(this);
    }

    fire(x, y, direction) {

        this.setActive(true).setVisible(true).setPosition(x, y);
        this.scene.assetLoader.shoot.play({
            loop: false
        });

        const speed = this.weaponStats.bulletSpeed;
        this.setVelocity(direction.velocityX * speed, direction.velocityY * speed);
        
        const angle = Phaser.Math.RadToDeg(Math.atan2(direction.velocityY, direction.velocityX));
        this.setAngle(angle);
    }
    destroyBullet() {
        this.setVelocity(0, 0);
        this.destroy();
    }
}

class FirearmBullet extends Bullet {
    constructor(scene, weaponStats, x, y) {
        super(scene, x, y,'firearmBullet', null,  weaponStats);
    }
}

class EnergyBullet extends Bullet {
    constructor(scene, weaponStats, x, y) {
        super(scene, x, y,'energyBullet', null,  weaponStats);
        this.setTint(0x00ff00);
    }
    fire(x, y, direction) {
        super.fire(x, y, direction);
    }
}

class ExplosiveBullet extends Bullet {
    constructor(scene, weaponStats, x, y) {
        super(scene, x, y,'explosiveBullet', null,  weaponStats);
    }

    explode() {
        this.destroyBullet();
    }
}

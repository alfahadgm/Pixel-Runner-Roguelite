class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, weaponStats) {
        super(scene, x, y, texture, frame, weaponStats);
        this._weaponStats = weaponStats;
        this.scene.physics.world.enable(this);
        this.scene.add.existing(this);
        this.setDepth(2);
        this._initializeCollisionShape();
        this.setActive(false).setVisible(false);
        this.scene.physics.add.collider(this, scene.enemyManager.enemies, this._handleBulletHitOnEnemy, null, this);
    }

    _initializeCollisionShape() {
        const bulletCollisionRadius = 10;
        this.body.setCircle(bulletCollisionRadius);
        this.body.setOffset(
            (this.width - bulletCollisionRadius * 2) / 2, 
            (this.height - bulletCollisionRadius * 2) / 2
        );
    }

    _handleBulletHitOnEnemy(bullet, enemy) {
        const bulletDamage = bullet._weaponStats.getDamage(); 
        enemy.decreaseHealth(bulletDamage);
        this.scene.utils.displayDamageText(enemy.x, enemy.y, bulletDamage, bullet._weaponStats.isCriticalHit);
        enemy.tint = 0xEE4B2B;
        this.scene.time.delayedCall(100, () => {
            enemy.clearTint();
        });
    
        bullet._markBulletForDestruction();
    }

    fire(x, y, direction) {
        this.setActive(true).setVisible(true).setPosition(x, y);
        this.scene.assetLoader.shoot.play({
            loop: false
        });

        const bulletSpeed = this._weaponStats.bulletSpeed;
        this.setVelocity(direction.velocityX * bulletSpeed, direction.velocityY * bulletSpeed);
        
        const bulletAngle = Phaser.Math.RadToDeg(Math.atan2(direction.velocityY, direction.velocityX));
        this.setAngle(bulletAngle);
    }
    
    _markBulletForDestruction() {
        this.setVelocity(0, 0);
        this.destroy();
    }
}
class Grenade extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, weaponStats, x, y, texture) {
        super(scene, x, y, texture);
        this.scene = scene;
        this.weaponStats = weaponStats;
        this.scene.physics.world.enable(this);
        this.setDepth(2).setActive(false).setVisible(false);
        this.scene.add.existing(this);
    }
    
    launch(x, y, direction) {
        this.setActive(true).setVisible(true).setPosition(x, y);
        const launchVelocity = 300; // example velocity for launching grenades
        this.setVelocity(direction.velocityX * launchVelocity, direction.velocityY * launchVelocity);
    }
    
    explode() {
        // Handle explosion damage, radius, etc.
        // For example: 
        const enemies = this.scene.enemyManager.enemies.getChildren();
        for (let enemy of enemies) {
            const distance = Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y);
            if (distance <= this.weaponStats.explosionRadius) {
                // Damage or destroy the enemy
                enemy.takeDamage(this.weaponStats.damage);  // Assuming a takeDamage method on the enemy
            }
        }
        this.destroy();  // Destroy the grenade after the explosion
    }
}
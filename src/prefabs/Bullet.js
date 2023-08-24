class Bullet extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, weaponStats, x, y, texture) {
        super(scene, x, y, texture);

        // Store reference to scene and weapon stats
        this.scene = scene;
        this.weaponStats = weaponStats;

        // Add this bullet to the scene's physics world
        this.scene.physics.world.enable(this);
        this.scene.add.existing(this);

        // Set bullet properties
        this.setDepth(2);

        // Calculate the bullet's circular collision shape
        const radius = 10;
        this.body.setCircle(radius);
        this.body.setOffset(
            (this.width - radius * 2) / 2, 
            (this.height - radius * 2) / 2
        );
        

        // Set the bullet to be inactive by default
        this.setActive(false).setVisible(false);
    }

    fire(x, y, direction) {
        // Activate bullet and set its position
        this.setActive(true).setVisible(true).setPosition(x, y);
    
        // If aiming at the enemy is the new default behavior
        const targetenemy = this.scene.enemy;
        const dirX = targetenemy.x - x;
        const dirY = targetenemy.y - y;
        const distance = Math.sqrt(dirX * dirX + dirY * dirY);
        
        // Normalize the vector
        const normalizedDirX = dirX / distance;
        const normalizedDirY = dirY / distance;
    
        this.setVelocity(
            normalizedDirX * this.weaponStats.bulletSpeed,
            normalizedDirY * this.weaponStats.bulletSpeed
        );
        
            normalizedDirX * this.weaponStats.bulletSpeed, 
            normalizedDirY * this.weaponStats.bulletSpeed
        );
    
        // Set the bullet's rotation angle to point to the target
        const angle = Phaser.Math.RadToDeg(Math.atan2(dirY, dirX));
        this.setAngle(angle);
        
    }
    

    destroyBullet() {
        this.destroy(); 
    }
}

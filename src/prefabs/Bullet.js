class Bullet extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, weaponStats, x, y, texture) {
        super(scene, x, y, texture);

        // Store reference to scene and weapon stats
        this.scene = scene;
        this.weaponStats = weaponStats;

        // Add this bullet to the scene's physics world
        this.scene.physics.world.enable(this);
        this.scene.add.existing(this);
        this.setInteractive();

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

    preDestroy() {
        this.scene.physics.world.disable(this);
    }

    fire(x, y, direction) {
        // Activate bullet and set its position
        this.setActive(true).setVisible(true).setPosition(x, y);
        
        // Use the given direction for bullet movement
        this.setVelocity(
            direction.velocityX * this.weaponStats.bulletSpeed,
            direction.velocityY * this.weaponStats.bulletSpeed
        );
        
        // Calculate the angle based on the direction
        const angle = Phaser.Math.RadToDeg(Math.atan2(direction.velocityY, direction.velocityX));
        
        // Set the bullet's rotation angle to the calculated angle
        this.setAngle(angle);
    }
    
    

    destroyBullet() {
        this.destroy(); 
    }
}

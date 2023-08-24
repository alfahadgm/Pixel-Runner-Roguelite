class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'block');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Initialize enemy health
        this.health = 100000;
        this.speed = 50; // speed at which the enemy will follow the hero
    }

    follow(target) {
        // calculate the angle towards the target (hero)
        const angle = Phaser.Math.Angle.Between(this.x, this.y, target.x, target.y);
        
        // set velocity based on speed and angle
        this.body.setVelocityX(Math.cos(angle) * this.speed);
        this.body.setVelocityY(Math.sin(angle) * this.speed);
    }

    // Decrease health and handle when it reaches 0
    decreaseHealth(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.health = 0;
            this.handleDestroy();
        }
        
    }

    // Handle block destruction or any other logic you want when health reaches 0
    handleDestroy() {
        this.destroy();
    }
}


class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, health, damage, speed) {
        super(scene, x, y, texture);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setDepth(2);
        

        // Set enemy properties
        this.setOrigin(0.5, 0.5); // Center the origin
        this.setVisible(true);    // Ensure enemy is visible
        this.setActive(true);     // Set enemy as active
        this.setInteractive();
        scene.enemyManager.enemies.add(this);

        // Initialize enemy health, damage, and speed
        this.health = health;
        this.damage = damage;
        this.speed = speed;

    }

    follow(target) {
        
        const angle = Phaser.Math.Angle.Between(this.x, this.y, target.x, target.y);
        this.body.setVelocityX(Math.cos(angle) * this.speed);
        this.body.setVelocityY(Math.sin(angle) * this.speed);
    }

    decreaseHealth(amount) {
        this.health -= amount;
        console.log("Health : " + this.health)
        if (this.health <= 0) {
            this.health = 0;
            this.handleDestroy();
        }
    }

    handleDestroy() {
        this.destroy();
    }
}

class Enemy1 extends Enemy {
    constructor(scene, x, y) {
        const ENEMY_TEXTURE = 'enemy1';  // Replace with the actual texture key for enemy1
        const ENEMY_HEALTH = 50;
        const ENEMY_DAMAGE = 50;
        const ENEMY_SPEED = 60;
        super(scene, x, y, ENEMY_TEXTURE, ENEMY_HEALTH, ENEMY_DAMAGE, ENEMY_SPEED);
    }
}

class Enemy2 extends Enemy {
    constructor(scene, x, y) {
        const ENEMY_TEXTURE = 'enemy2';  // Replace with the actual texture key for enemy2
        const ENEMY_HEALTH = 20;
        const ENEMY_DAMAGE = 80;
        const ENEMY_SPEED = 40;
        super(scene, x, y, ENEMY_TEXTURE, ENEMY_HEALTH, ENEMY_DAMAGE, ENEMY_SPEED);
    }
}

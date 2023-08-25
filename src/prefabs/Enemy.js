
class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, health, damage, speed, bodysize_width, bodysize_height) {
        super(scene, x, y, texture);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setDepth(2);
        
        // Set enemy properties
        this.setOrigin(0.5, 0.5);
        this.setVisible(true);    // Ensure enemy is visible
        this.setBodySize(bodysize_width, bodysize_height);
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
        const dx = target.x - this.x;
        const dy = target.y - this.y;
        this.body.setVelocityX(Math.cos(angle) * this.speed);
        this.body.setVelocityY(Math.sin(angle) * this.speed);
    
        let animationKey = '';
    
        if (Math.abs(dx) > Math.abs(dy)) {
            // Moving horizontally
            if (dx > 0) {
                if (this.scene.anims.exists(`${this.texture.key}-walk-right`)) {
                    this.setFlipX(false);
                    animationKey = `${this.texture.key}-walk-right`;
                }
            } else {
                if (this.scene.anims.exists(`${this.texture.key}-walk-right`)) {
                    this.setFlipX(true);
                    animationKey = `${this.texture.key}-walk-right`;
                }
            }
        } else {
            // Moving vertically
            
            if (dy > 0) {
                if (this.scene.anims.exists(`${this.texture.key}-walk-down`)) {
                    animationKey = `${this.texture.key}-walk-down`;
                }
            } else {
                if (this.scene.anims.exists(`${this.texture.key}-walk-up`)) {
                    animationKey = `${this.texture.key}-walk-up`;
                }
            }
        }
    
        if (animationKey !== '') {
            this.play(animationKey, true);
        }
    }
    
    
    
    
        

    decreaseHealth(amount) {
        this.health -= amount;
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
        const TEXTURE = 'bat';  // Replace with the actual texture key for enemy1
        const HEALTH = 40;
        const DAMAGE = 20;
        const SPEED = 80;
        const BODYSIZE_WIDTH = 10;
        const BODYSIZE_HEIGHT = 10
        super(scene, x, y, TEXTURE, HEALTH, DAMAGE, SPEED, BODYSIZE_WIDTH, BODYSIZE_HEIGHT);
    }
}

class Enemy2 extends Enemy {
    constructor(scene, x, y) {
        const TEXTURE = 'skeleton';  // Replace with the actual texture key for enemy1
        const HEALTH = 120;
        const DAMAGE = 40;
        const SPEED = 60;
        const BODYSIZE_WIDTH = 10;
        const BODYSIZE_HEIGHT = 10
        super(scene, x, y, TEXTURE, HEALTH, DAMAGE, SPEED, BODYSIZE_WIDTH, BODYSIZE_HEIGHT);
    }
}
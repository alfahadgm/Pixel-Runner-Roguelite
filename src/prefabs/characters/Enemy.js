

class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, name, health, damage, speed, bodysize_width, bodysize_height, canThrowProjectile, rarity) {
        super(scene, x, y, texture);
        this.scene = scene;
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
        this.rarity = rarity;
        this.name = name;
        this.canThrowProjectile = canThrowProjectile;
        this.projectileCooldown = false;


    }


    follow(target) {
        const distanceToTarget = this.scene.utils.calculateDistance(this.x, this.y, target.x, target.y);
        const textureKey = this.texture.key;
        let speedModifier = Math.max(target.heroStats.movementSpeed, (distanceToTarget > 800) ? distanceToTarget / 400 : 0);
        
        if ((textureKey === 'bee' || textureKey === 'eyeball') && distanceToTarget <= 100) {
            this.body.setVelocity(0, 0);
            this.throwProjectile(target);
            return;
        }
        
        const angle = Phaser.Math.Angle.Between(this.x, this.y, target.x, target.y);
        this.body.setVelocityX(Math.cos(angle) * this.speed * speedModifier);
        this.body.setVelocityY(Math.sin(angle) * this.speed * speedModifier);
    
        const dx = target.x - this.x;
        const dy = target.y - this.y;
        let direction = '';
        
        if (Math.abs(dx) > Math.abs(dy)) {
            direction = (dx > 0) ? 'right' : 'left';
            this.setFlipX(dx <= 0);
        } else {
            direction = (dy > 0) ? 'down' : 'up';
        }
        
        const animationKey = `${textureKey}-walk-${direction}`;
        if (this.scene.anims.exists(animationKey)) {
            this.play(animationKey, true);
        }
    }

    throwProjectile(target) {
        if (!this.canThrowProjectile || this.projectileCooldown) return;
    
        this.projectileCooldown = true;
        
        this.scene.time.delayedCall(1000, () => {
            if (!this.scene) return;
    
            let projectile;
            let PROJECTILE_SPEED;
    
            const createProjectile = (spriteKey, speed) => {
                projectile = this.scene.physics.add.sprite(this.x, this.y, spriteKey);
                PROJECTILE_SPEED = speed;
            };
    
            const angle = Phaser.Math.Angle.Between(this.x, this.y, target.x, target.y);
            
            switch (this.texture.key) {
                case 'bee':
                    createProjectile('beeP', 120);
                    break;
                case 'eyeball':
                    createProjectile('eyeballP', 160);
                    this.adjustProjectileCurve(projectile, target, PROJECTILE_SPEED);
                    break;
            }
    
            projectile.setVelocityX(Math.cos(angle) * PROJECTILE_SPEED);
            projectile.setVelocityY(Math.sin(angle) * PROJECTILE_SPEED);
    
            this.scene.physics.add.overlap(projectile, target, (projectile, target) => {
                target.heroStats.getDamage(this.damage);
                projectile.destroy();
            });
    
            this.scene.time.delayedCall(4000, () => projectile.destroy());
            this.scene.time.delayedCall(3000, () => this.projectileCooldown = false);
        });
    }
    
    adjustProjectileCurve(projectile, target, PROJECTILE_SPEED) {
        const lerpFactor = 0.05;
        const initialAngle = Phaser.Math.Angle.Between(this.x, this.y, target.x, target.y);
        
        this.scene.time.addEvent({
            delay: 50,
            callback: () => {
                if (!projectile.active) return;
                const currentAngle = Math.atan2(projectile.body.velocity.y, projectile.body.velocity.x);
                const targetAngle = Phaser.Math.Angle.Between(projectile.x, projectile.y, target.x, target.y);
                let newAngle = Phaser.Math.Linear(currentAngle, targetAngle, lerpFactor);
    
                if ((initialAngle >= 0 && newAngle < 0) || (initialAngle < 0 && newAngle > 0)) {
                    newAngle = 0;
                }
    
                projectile.setVelocityX(Math.cos(newAngle) * PROJECTILE_SPEED);
                projectile.setVelocityY(Math.sin(newAngle) * PROJECTILE_SPEED);
            },
            loop: true
        });
    }    

    decreaseHealth(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.health = 0;
            this.handleDestroy();
        }
    }

    handleDestroy() {
        this.dropLoot();
        this.destroy();
    }

    dropLoot() {
        this.scene.collectableManager.spawnRandom(this.x, this.y, this.name);
    }
}

// Wave 1
class Bat extends Enemy {
    constructor(scene, x, y) {
        const TEXTURE = 'bat';
        const NAME = 'bat';
        const HEALTH = 40;
        const DAMAGE = 10;
        const SPEED = 80;
        const RARITY = 0;
        const BODYSIZE_WIDTH = 10;
        const BODYSIZE_HEIGHT = 10;
        const CANPROJECTILE = false;
        super(scene, x, y, TEXTURE, NAME, HEALTH, DAMAGE, SPEED, BODYSIZE_WIDTH, BODYSIZE_HEIGHT, CANPROJECTILE, RARITY);
    }
}

// Wave 2
class Skeleton extends Enemy {
    constructor(scene, x, y) {
        const TEXTURE = 'skeleton';
        const NAME = 'skeleton';
        const HEALTH = 60;
        const DAMAGE = 15;
        const SPEED = 75;
        const RARITY = 1;
        const BODYSIZE_WIDTH = 10;
        const BODYSIZE_HEIGHT = 10;
        const CANPROJECTILE = false;
        super(scene, x, y, TEXTURE, NAME, HEALTH, DAMAGE, SPEED, BODYSIZE_WIDTH, BODYSIZE_HEIGHT, CANPROJECTILE, RARITY);
    }
}

// Wave 4
class Bee extends Enemy {
    constructor(scene, x, y) {
        const TEXTURE = 'bee';
        const NAME =  'bee';
        const HEALTH = 60;
        const DAMAGE = 15;
        const SPEED = 90;
        const RARITY = 2;
        const BODYSIZE_WIDTH = 0;
        const BODYSIZE_HEIGHT = 0;
        const CANPROJECTILE = true;
        super(scene, x, y, TEXTURE, NAME, HEALTH, DAMAGE, SPEED, BODYSIZE_WIDTH, BODYSIZE_HEIGHT, CANPROJECTILE, RARITY);
    }
}

// Wave 7
class SmallWorm extends Enemy {
    constructor(scene, x, y) {
        const TEXTURE = 'small_worm';
        const NAME = 'smallWorm';
        const HEALTH = 80;
        const DAMAGE = 20;
        const SPEED = 50;
        const RARITY = 2;
        const BODYSIZE_WIDTH = 10;
        const BODYSIZE_HEIGHT = 10;
        const CANPROJECTILE = false;
        super(scene, x, y, TEXTURE, NAME, HEALTH, DAMAGE, SPEED, BODYSIZE_WIDTH, BODYSIZE_HEIGHT, CANPROJECTILE, RARITY);
    }

    follow(target) {
        const distanceToTarget = this.scene.utils.calculateDistance(this.x, this.y, target.x, target.y);
        let speedModifier = 1;

        // Special Behavior: If within 100 units, move 1.5x faster
        if (distanceToTarget < 100) {
            speedModifier = 1.5;
        }

        super.follow(target);
        this.speed *= speedModifier; // Adjust the speed
    }
}


// Wave 7
class BigWorm extends Enemy {
    constructor(scene, x, y) {
        const TEXTURE = 'big_worm';
        const NAME = 'bigWorm';
        const HEALTH = 300;
        const DAMAGE = 30;
        const SPEED = 40;
        const RARITY = 3;
        const BODYSIZE_WIDTH = 10;
        const BODYSIZE_HEIGHT = 10;
        const CANPROJECTILE = false;
        super(scene, x, y, TEXTURE, NAME, HEALTH, DAMAGE, SPEED, BODYSIZE_WIDTH, BODYSIZE_HEIGHT, CANPROJECTILE, RARITY);
    }

    follow(target) {
        // Special Behavior: 10% chance to teleport closer
        if (Math.random() < 0.10) {
            const dx = (target.x - this.x) * 0.5;
            const dy = (target.y - this.y) * 0.5;
            this.x += dx;
            this.y += dy;
        }
        super.follow(target);
    }
}
// Wave 10
class EyeBall extends Enemy {
    constructor(scene, x, y) {
        const TEXTURE = 'eyeball'; 
        const NAME = 'eyeBall';
        const HEALTH = 220;
        const DAMAGE = 15;
        const SPEED = 50;
        const RARITY = 2;
        const BODYSIZE_WIDTH = 0;
        const BODYSIZE_HEIGHT = 0;
        const CANPROJECTILE = true;
        super(scene, x, y, TEXTURE, NAME, HEALTH, DAMAGE, SPEED, BODYSIZE_WIDTH, BODYSIZE_HEIGHT, CANPROJECTILE, RARITY);
    }
}

// Wave 12
class Ghost extends Enemy {
    constructor(scene, x, y) {
        super(scene, x, y, 'ghost', 'ghost', 250, 10, 100, 25, 25, false, 2);

        // Initiate the Ghost-specific properties
        this.isFollowing = true; // start by following the target
        this.toggleFollow(); // initiate the follow toggle mechanism
    }

    // Override the follow method
    follow(target) {
        // If the ghost should be following
        if (this.isFollowing) {
            super.follow(target);
        } else {
            // If not following, stop the ghost
            this.body.setVelocity(0, 0);
        }
    }

    // Method to toggle the following behavior
    toggleFollow() {
        // Check if the enemy is still in the scene
        if (!this.scene) return;

        // Toggle the isFollowing flag
        this.isFollowing = !this.isFollowing;

        // Call this method again after 1 second to toggle the behavior again
        this.followTimer = this.scene.time.delayedCall(1000, this.toggleFollow, [], this);
    }

    // Ensure to clear the timer on destroy to avoid errors
    handleDestroy() {
        if (this.followTimer) {
            this.followTimer.remove();
        }
        super.handleDestroy();
    }
}

class Flower extends Enemy {
    constructor(scene, x, y) {
        const TEXTURE = 'flower'; 
        const NAME = 'flower'; 
        const HEALTH = 350;
        const DAMAGE = 30;
        const SPEED = 40;
        const RARITY = 3;
        const BODYSIZE_WIDTH = 10;
        const BODYSIZE_HEIGHT = 10;
        const CANPROJECTILE = false;
        super(scene, x, y, TEXTURE, NAME, HEALTH, DAMAGE, SPEED, BODYSIZE_WIDTH, BODYSIZE_HEIGHT, CANPROJECTILE, RARITY);

        this.sporeReleaseInterval = 5000; // 5 seconds
        this.scene.time.addEvent({
            delay: this.sporeReleaseInterval,
            callback: this.releaseSpores,
            callbackScope: this,
            loop: true
        });
    }

    releaseSpores() {
        const SPORE_SPEED = 20;
        const NUM_SPORES = 8;
        const ANGLE_INCREMENT = (2 * Math.PI) / NUM_SPORES;  // 360 degrees / number of spores

        for (let i = 0; i < NUM_SPORES; i++) {
            let spore = this.scene.physics.add.sprite(this.x, this.y, 'spore');  // Assuming a 'sporeTexture' exists in the game
            const angle = i * ANGLE_INCREMENT;

            spore.setVelocityX(Math.cos(angle) * SPORE_SPEED);
            spore.setVelocityY(Math.sin(angle) * SPORE_SPEED);

            // Collider logic for spore and target. It would be best to move this out to avoid adding multiple colliders for every spore.
            this.scene.physics.add.overlap(spore, this.scene.player, (spore, player) => {  // Assuming the player object exists in the scene
                hero.applyPoisonEffect();  // A method in player to apply poison effect
                spore.destroy();
            });
        }
    }
}

// Wave 18
class Pumpking extends Enemy {
    constructor(scene, x, y) {
        const TEXTURE = 'pumpking'; 
        const NAME = 'pumpking'; 
        const HEALTH = 350;
        const DAMAGE = 35;
        const SPEED = 50;
        const RARITY = 3;
        const BODYSIZE_WIDTH = 15;
        const BODYSIZE_HEIGHT = 15;
        const CANPROJECTILE = false;
        super(scene, x, y, TEXTURE, NAME, HEALTH, DAMAGE, SPEED, BODYSIZE_WIDTH, BODYSIZE_HEIGHT, CANPROJECTILE, RARITY);
    }
}

// Wave 20
class Slime extends Enemy {
    constructor(scene, x, y) {
        const TEXTURE = 'slime'; 
        const NAME = 'slime'; 
        const HEALTH = 600;
        const DAMAGE = 12;
        const SPEED = 40;
        const RARITY = 3;
        const BODYSIZE_WIDTH = 15;
        const BODYSIZE_HEIGHT = 15;
        const CANPROJECTILE = false;
        super(scene, x, y, TEXTURE, NAME, HEALTH, DAMAGE, SPEED, BODYSIZE_WIDTH, BODYSIZE_HEIGHT, CANPROJECTILE, RARITY);
    
    }
}

// When Slime Killed MiniSlimes showup
class MiniSlime extends Enemy {
    constructor(scene, x, y) {
        const TEXTURE = 'miniSlime'; 
        const NAME = 'miniSlime'; 
        const HEALTH = 250;
        const DAMAGE = 8;
        const SPEED = 40;
        const RARITY = 3;
        const BODYSIZE_WIDTH = 8;
        const BODYSIZE_HEIGHT = 8;
        const CANPROJECTILE = false;
        super(scene, x, y, TEXTURE, NAME, HEALTH, DAMAGE, SPEED, BODYSIZE_WIDTH, BODYSIZE_HEIGHT, CANPROJECTILE, RARITY);
    }
}

// Wave 23
class Snake extends Enemy {
    constructor(scene, x, y) {
        const TEXTURE = 'snake'; 
        const NAME = 'snake'; 
        const HEALTH = 600;
        const DAMAGE = 15;
        const SPEED = 60;
        const RARITY = 3;
        const BODYSIZE_WIDTH = 15;
        const BODYSIZE_HEIGHT = 15;
        const CANPROJECTILE = false;
        super(scene, x, y, TEXTURE, NAME, HEALTH, DAMAGE, SPEED, BODYSIZE_WIDTH, BODYSIZE_HEIGHT, CANPROJECTILE, RARITY);
    }
}
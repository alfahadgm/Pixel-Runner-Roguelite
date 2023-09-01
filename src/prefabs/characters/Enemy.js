

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
        let speedModifier = (distanceToTarget > 800) ? 800 / distanceToTarget : 1;
        
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

    throwProjectile(target, projectileKey = null) {
        if (!this.canThrowProjectile || this.projectileCooldown) return;
        
        this.projectileCooldown = true;
        
        this.scene.time.delayedCall(1000, () => {
            if (!this.scene) return;
    
            let projectile;
            let PROJECTILE_SPEED;
    
            const createProjectile = (spriteKey, speed) => {
                projectile = this.scene.physics.add.sprite(this.x, this.y, spriteKey);
                console.log("Projectile created at ", this.x, this.y);

                PROJECTILE_SPEED = speed;
            };
    
            const angle = Phaser.Math.Angle.Between(this.x, this.y, target.x, target.y);
            
            // If a specific projectileKey is provided, use that
            if (projectileKey) {
                createProjectile(projectileKey, 120);  // Set the speed as required for 'worm_projectile'
            } else {
                switch (this.texture.key) {
                    case 'bee':
                        createProjectile('beeP', 120);
                        break;
                    case 'eyeball':
                        createProjectile('eyeballP', 160);
                        this.adjustProjectileCurve(projectile, target, PROJECTILE_SPEED);
                        break;
                }
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
    
        this.scene.time.addEvent({
            delay: 50,
            callback: () => {
                if (!projectile.active) return;
    
                const targetAngle = Phaser.Math.Angle.Between(projectile.x, projectile.y, target.x, target.y);
                
                const angleDifference = Phaser.Math.Angle.Wrap(targetAngle - projectile.rotation);
    
                // Making sure the angle difference is kept small to avoid abrupt changes
                let newAngle = projectile.rotation + angleDifference * lerpFactor;
                newAngle = Phaser.Math.Angle.Wrap(newAngle);
    
                projectile.setVelocityX(Math.cos(newAngle) * PROJECTILE_SPEED);
                projectile.setVelocityY(Math.sin(newAngle) * PROJECTILE_SPEED);
                projectile.rotation = newAngle;
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
        const HEALTH = 120;
        const DAMAGE = 15;
        const SPEED = 90;
        const RARITY = 2;
        const BODYSIZE_WIDTH = 10;
        const BODYSIZE_HEIGHT = 10;
        const CANPROJECTILE = true;
        super(scene, x, y, TEXTURE, NAME, HEALTH, DAMAGE, SPEED, BODYSIZE_WIDTH, BODYSIZE_HEIGHT, CANPROJECTILE, RARITY);
    }
}

// Wave 7
class SmallWorm extends Enemy {
    constructor(scene, x, y) {
        const TEXTURE = 'small_worm';
        const NAME = 'smallWorm';
        const HEALTH = 400;
        const DAMAGE = 20;
        const SPEED = 50;
        const RARITY = 2;
        const BODYSIZE_WIDTH = 10;
        const BODYSIZE_HEIGHT = 10;
        const CANPROJECTILE = false;
        super(scene, x, y, TEXTURE, NAME, HEALTH, DAMAGE, SPEED, BODYSIZE_WIDTH, BODYSIZE_HEIGHT, CANPROJECTILE, RARITY);
    }

    decreaseHealth(amount) {
        this.health -= amount;
    
        // Move worm towards target when it gets hit
        if (this.scene.hero) {
            let nudgeAmount = 10; // You can change this to control the distance of the nudge
            const angle = Phaser.Math.Angle.Between(this.x, this.y, this.scene.hero.x, this.scene.hero.y);
            this.x += Math.cos(angle) * nudgeAmount;
            this.y += Math.sin(angle) * nudgeAmount;
        }
    
        if (this.health <= 0) {
            this.health = 0;
            this.handleDestroy();
        }
    }
}


// Wave 7
class BigWorm extends Enemy {
    constructor(scene, x, y) {
        const TEXTURE = 'big_worm';
        const NAME = 'bigWorm';
        const HEALTH = 1500;
        const DAMAGE = 30;
        const SPEED = 40;
        const RARITY = 3;
        const BODYSIZE_WIDTH = 10;
        const BODYSIZE_HEIGHT = 10;
        const CANPROJECTILE = true;  // Setting this to true
        super(scene, x, y, TEXTURE, NAME, HEALTH, DAMAGE, SPEED, BODYSIZE_WIDTH, BODYSIZE_HEIGHT, CANPROJECTILE, RARITY);
    }

    decreaseHealth(amount, target) {
        super.decreaseHealth(amount);
        this.throwRandomProjectile();
    }
    
    throwRandomProjectile() {
        const projectileKey = 'worm_projectile';
        this.throwProjectile(this.scene.hero, projectileKey);
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
    // Class-level constants for Flower
    static TEXTURE = 'flower';
    static NAME = 'flower';
    static HEALTH = 350;
    static DAMAGE = 30;
    static SPEED = 40;
    static RARITY = 3;
    static BODYSIZE_WIDTH = 10;
    static BODYSIZE_HEIGHT = 10;
    static CANPROJECTILE = false;

    // Class-level constants for spore
    static SPORE_SPEED = 20;
    static NUM_SPORES = 8;
    static ANGLE_INCREMENT = (2 * Math.PI) / Flower.NUM_SPORES; 

    constructor(scene, x, y) {
        super(
            scene, x, y, Flower.TEXTURE, Flower.NAME, Flower.HEALTH, 
            Flower.DAMAGE, Flower.SPEED, Flower.BODYSIZE_WIDTH, 
            Flower.BODYSIZE_HEIGHT, Flower.CANPROJECTILE, Flower.RARITY
        );

        this.sporeReleaseInterval = 5000; // 5 seconds
        this.scene.time.addEvent({
            delay: this.sporeReleaseInterval,
            callback: this.releaseSpores,
            callbackScope: this,
            loop: true
        });
    }

    releaseSpores() {
        if (!this.scene || !this.scene.physics) {
            return;
        }
        for (let i = 0; i < Flower.NUM_SPORES; i++) {
            const spore = this.scene.physics.add.sprite(this.x, this.y, 'spore');
            const angle = i * Flower.ANGLE_INCREMENT;

            spore.setVelocityX(Math.cos(angle) * Flower.SPORE_SPEED);
            spore.setVelocityY(Math.sin(angle) * Flower.SPORE_SPEED);

            // Moved the collider logic out of loop
            // It will still be applied multiple times, 
            // consider refactoring if it affects performance.
            this.scene.physics.add.overlap(spore, this.scene.player, (spore, player) => {
                player.applyPoisonEffect(); // Corrected hero to player
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
        const HEALTH = 2000;
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
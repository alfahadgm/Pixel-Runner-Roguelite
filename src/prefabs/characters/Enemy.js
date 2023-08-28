

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
    
        // Calculate a dynamic speed modifier
        let speedModifier = target.heroStats.movementSpeed;
        if (distanceToTarget > 400) {
            speedModifier = distanceToTarget / 400; // This will make the enemy faster when further away
        }
    // For the Bee and Eyeball: Stop and throw projectiles when within 100 units of distance
    if ((this.texture.key === 'bee' || this.texture.key === 'eyeball') && distanceToTarget <= 100) {
        this.body.setVelocity(0, 0); // Stop the enemy
        this.throwProjectile(target); // Call the projectile throwing method
        return; // Exit the function to avoid further processing
    } else {
            // If distance is more than 100 or if it's not Bee or Eyeball, follow the target
            const angle = Phaser.Math.Angle.Between(this.x, this.y, target.x, target.y);
            this.body.setVelocityX(Math.cos(angle) * this.speed * speedModifier);
            this.body.setVelocityY(Math.sin(angle) * this.speed * speedModifier);
    
    
            let animationKey = '';
            const dx = target.x - this.x;
            const dy = target.y - this.y;
        
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
    }

    throwProjectile(target) {
        // Check if the enemy can throw a projectile and if it's not on cooldown
        if (this.canThrowProjectile && this.projectileCooldown === false) {
            // Set cooldown to true
            this.projectileCooldown = true;
    
            // Delay for 1 second before launching the projectile
            this.scene.time.delayedCall(1000, () => {
                // Check if the enemy is still in the scene
                if (!this.scene) return;
    

                let projectile;
                let PROJECTILE_SPEED;
                // Create the projectile sprite
                if (this.texture.key === 'bee' ){
                projectile = this.scene.physics.add.sprite(this.x, this.y, 'beeP');
                PROJECTILE_SPEED = 120;
                } else if (this.texture.key === 'eyeball') {
                    projectile = this.scene.physics.add.sprite(this.x, this.y, 'eyeballP');
                    PROJECTILE_SPEED = 160;
                    
                    const lerpFactor = 0.05; // Adjust this value to change the curve rate (range between 0 and 1)
                    
                    const initialAngle = Phaser.Math.Angle.Between(this.x, this.y, target.x, target.y);
            
                    // Start an update loop for the eyeball projectile
                    const projectileUpdateEvent = this.scene.time.addEvent({
                        delay: 50,  // update every 50ms
                        callback: () => {
                            if (!projectile.active) {
                                projectileUpdateEvent.remove();
                                return;
                            }
                            
                            // Calculate current angle based on projectile's velocity
                            const currentAngle = Math.atan2(projectile.body.velocity.y, projectile.body.velocity.x);
            
                            // Calculate the angle to the target
                            const targetAngle = Phaser.Math.Angle.Between(projectile.x, projectile.y, target.x, target.y);
            
                            // Lerp between current angle and target angle
                            let newAngle = Phaser.Math.Linear(currentAngle, targetAngle, lerpFactor);
                            
                            // Check angle restrictions
                            if (initialAngle >= 0 && newAngle < 0) {
                                newAngle = 0;
                            } else if (initialAngle < 0 && newAngle > 0) {
                                newAngle = 0;
                            }
            
                            projectile.setVelocityX(Math.cos(newAngle) * PROJECTILE_SPEED);
                            projectile.setVelocityY(Math.sin(newAngle) * PROJECTILE_SPEED);
                        },
                        loop: true
                    });
                }
                // Calculate the angle to the target
                const angle = Phaser.Math.Angle.Between(this.x, this.y, target.x, target.y);
                // Set the velocity so it moves towards the target
                projectile.setVelocityX(Math.cos(angle) * PROJECTILE_SPEED);
                projectile.setVelocityY(Math.sin(angle) * PROJECTILE_SPEED);

                // Add collider between the projectile and the target
                this.scene.physics.add.overlap(projectile, target, (projectile, target) => {
                    target.heroStats.getDamage(this.damage)
                    projectile.destroy();
                });
                
                // Optional: destroy the projectile after a certain time
                this.scene.time.delayedCall(4000, () => {
                    projectile.destroy();
                });
    
                // Set a cooldown timer
                this.scene.time.delayedCall(3000, () => {
                    this.projectileCooldown = false;
                });
            });
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
        const DAMAGE = 15;
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
        const SPEED = 80;
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
        const HEALTH = 60;
        const DAMAGE = 20;
        const SPEED = 40;
        const RARITY = 2;
        const BODYSIZE_WIDTH = 10;
        const BODYSIZE_HEIGHT = 10
        const CANPROJECTILE = false;
        super(scene, x, y, TEXTURE, NAME, HEALTH, DAMAGE, SPEED, BODYSIZE_WIDTH, BODYSIZE_HEIGHT, CANPROJECTILE, RARITY);
    }
}

// Wave 7
class BigWorm extends Enemy {
    constructor(scene, x, y) {
        const TEXTURE = 'big_worm';
        const NAME =  'bigWorm';
        const HEALTH = 250;
        const DAMAGE = 30;
        const SPEED = 40;
        const RARITY = 3;
        const BODYSIZE_WIDTH = 10;
        const BODYSIZE_HEIGHT = 10;
        const CANPROJECTILE = false;
        super(scene, x, y, TEXTURE, NAME, HEALTH, DAMAGE, SPEED, BODYSIZE_WIDTH, BODYSIZE_HEIGHT, CANPROJECTILE, RARITY);
    }
}

// Wave 10
class EyeBall extends Enemy {
    constructor(scene, x, y) {
        const TEXTURE = 'eyeball'; 
        const NAME = 'eyeBall';
        const HEALTH = 200;
        const DAMAGE = 10;
        const SPEED = 40;
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

// Wave 15
class Flower extends Enemy {
    constructor(scene, x, y) {
        const TEXTURE = 'flower'; 
        const NAME = 'flower'; 
        const HEALTH = 300;
        const DAMAGE = 30;
        const SPEED = 40;
        const RARITY = 3;
        const BODYSIZE_WIDTH = 10;
        const BODYSIZE_HEIGHT = 10;
        const CANPROJECTILE = false;
        super(scene, x, y, TEXTURE, NAME, HEALTH, DAMAGE, SPEED, BODYSIZE_WIDTH, BODYSIZE_HEIGHT, CANPROJECTILE, RARITY);
    }
}

// Wave 18
class Pumpking extends Enemy {
    constructor(scene, x, y) {
        const TEXTURE = 'pumpking'; 
        const NAME = 'pumpking'; 
        const HEALTH = 300;
        const DAMAGE = 30;
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
        const HEALTH = 500;
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
        const HEALTH = 300;
        const DAMAGE = 10;
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
        const HEALTH = 500;
        const DAMAGE = 12;
        const SPEED = 50;
        const RARITY = 3;
        const BODYSIZE_WIDTH = 15;
        const BODYSIZE_HEIGHT = 15;
        const CANPROJECTILE = false;
        super(scene, x, y, TEXTURE, NAME, HEALTH, DAMAGE, SPEED, BODYSIZE_WIDTH, BODYSIZE_HEIGHT, CANPROJECTILE, RARITY);
    }
}
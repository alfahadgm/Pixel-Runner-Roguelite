
    class Bullet extends Phaser.Physics.Arcade.Sprite {
        constructor(scene, blueprint, x, y) {
            super(scene, x, y, blueprint.texture);
            this.scene = scene;
            this.speed = blueprint.speed;
            this.effect = new Effect(blueprint.effectType, blueprint.effectProperties);
            this.trajectory = new Trajectory(blueprint.trajectoryType, blueprint.trajectoryProperties);
            this.traits = new Trait(blueprint.attributesType, blueprint.attributesProperties);
            this.material = new Material(blueprint.materialType, blueprint.materialProperties);
            this.scene.add.existing(this);
            this.scene.physics.add.existing(this);
            this.scene.physics.add.overlap(this, this.scene.enemyManager.enemies, this.onHitEnemy, null, this);
        }

        shootInDirection(x, y, direction) {
            this.setPosition(x, y);
            
            const normalizedDirection = this.scene.utils.normalizeVector(direction);
            
            this.setVelocity(normalizedDirection.x * this.speed, normalizedDirection.y * this.speed);
        }

        onHitEnemy(bullet, enemy) {
            console.log("Bullet hit enemy");
            if (this.traits && this.traits.type !== "none") {
                this.traits.handleTrait(this, enemy);
            }
            
            if (this.effect && this.effect.type !== "none") {
                this.effect.handleEffect(this, enemy);
            }
            
            if (this.trajectory && this.trajectory.type !== "none") {
                this.trajectory.handleTrajectory(this, enemy);
            }
            
            if (this.material && this.material.type !== "none") {
                this.material.handleMaterial(this, enemy);
            }
            bullet.destroy();
        }  
          
}

    // Blueprint of Bullet
    class BulletBlueprint {
        constructor(texture, speed, effectType, effectProperties, trajectoryType, trajectoryProperties, attributesType, attributesProperties, materialType, materialProperties) {
            this.texture = texture;
            this.speed = speed;
            this.effectType = effectType;
            this.effectProperties = effectProperties;
            this.trajectoryType = trajectoryType;
            this.trajectoryProperties = trajectoryProperties;
            this.attributesType = attributesType;
            this.attributesProperties = attributesProperties;
            this.materialType = materialType;
            this.materialProperties = materialProperties;
        }
    }

    // Abstract definition classes
    class Effect {
        constructor(type, properties = {}) {
            this.type = type;
            this.properties = properties;
        }
    
        handleEffect(bullet, enemy) {
            switch (this.type) {
                case 'Electric':
                    console.log("Effect Electric:", this.type);
                    break;
                default:
                    console.log("Effect not implemented:", this.type);
                    break;
            }
        }
    }

    
    class Trajectory {
        constructor(type, properties = {}) {
            this.type = type;
            this.properties = properties;
        }
    
        handleTrajectory(bullet, enemy) {
            switch (this.type) {
                case 'Ricochet':
                    // Check if the bullet will ricochet based on the provided chance
                    if (Math.random() <= this.properties.chance) {
                        bullet.bouncesRemaining = this.properties.bounces;
                        bullet.damageModifier = this.properties.damageModifierEachBounce;
                
                        if (bullet.bouncesRemaining > 0) {
                            console.log("Bullet will ricochet");
                            bullet.bouncesRemaining--;
                
                            // Find nearest enemy excluding the current enemy
                            let nearestEnemy = bullet.scene.utils.findNearestEnemy(bullet.x, bullet.y, enemy);
                            
                            if (nearestEnemy) {
                                let directionToNearestEnemy = {
                                    x: nearestEnemy.x - bullet.x,
                                    y: nearestEnemy.y - bullet.y
                                };
                
                                const normalizedDirection = bullet.scene.utils.normalizeVector(directionToNearestEnemy);
                
                                // Create a new bullet with 'none' properties
                                let newBullet = new Bullet(bullet.scene, {
                                    texture: bullet.texture.key, // Assuming bullet's texture has a key property
                                    speed: bullet.speed,
                                    effectType: "none", 
                                    effectProperties: {}, 
                                    trajectoryType: "none",
                                    trajectoryProperties: {},
                                    attributesType: "none", 
                                    attributesProperties: {}, 
                                    materialType: "none", 
                                    materialProperties: {} 
                                }, bullet.x, bullet.y);
                
                                newBullet.damage = bullet.damage * bullet.damageModifier; 
                                newBullet.setVelocity(normalizedDirection.x * bullet.speed, normalizedDirection.y * bullet.speed);
                            }
                        }
                        bullet.destroy(); // Destroy the original bullet
                    }
                    break;
                default:
                    console.log("Trajectory not implemented:", this.type);
                    break;
            }
        }
    }
      

    
    class Trait {
        constructor(type, properties = {}) {
            this.type = type;
            this.properties = properties;
        }
    
        handleTrait(bullet, enemy) {
            switch (this.type) {
                case 'Leeching':
                    console.log("Trait is Leeching:", this.type);
                    break;
                default:
                    console.log("Trait not implemented:", this.type);
                    break;
            }
        }
    }
    class Material {
        constructor(type, properties = {}) {
            this.type = type;
            this.properties = properties;
        }
    
        handleMaterial(bullet, enemy) {
            switch (this.type) {
                case 'Steel':
                    console.log("Material is Steel:", this.type);
                    break;
                default:
                    console.log("Material not implemented:", this.type);
                    break;
            }
        }
    }
class Hero extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, direction) {
        super(scene, x, y, texture, frame);
        
        this.initProperties(scene, direction);
        this.initializeWeapons();
        this.heroStats.startShieldRegeneration();
    }

    initProperties(scene, direction) {
        // Add hero to scene
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Hero properties
        this.scene = scene;
        this.direction = direction;
        this.heroVelocity = 100;
        this.dashCooldown = 300;
        this.hurtTimer = 250;
        this.heroStats = new HeroStats(scene);
        this.lastFired = 0;
        this.body.setSize(15,20,true);
    }

    initializeWeapons() {
        this.weapons = WeaponFactory.getWeapons(this.scene);
        this.currentWeaponIndex = 0;
        this.currentWeapon = this.weapons[this.currentWeaponIndex];
        this.setupAutoFireEvent();
    }

    setupAutoFireEvent() {
        this.autofireEvent?.remove();

        this.autofireEvent = this.scene.time.addEvent({
            delay: this.currentWeapon.weaponStats.cooldown,
            callback: this.attackWithWeapon,
            callbackScope: this,
            loop: true
        });
    }

    updateAutoFireDelay() {
        if (this.autofireEvent.delay !== this.currentWeapon.weaponStats.cooldown) {
            this.setupAutoFireEvent();
        }
    }

    toggleFiringStatus(status) {
        if (this.autofireEvent) {
            this.autofireEvent.paused = status;
        }
    }

    pauseFiring() {
        this.toggleFiringStatus(true);
    }

    resumeFiring() {
        this.toggleFiringStatus(false);
    }

    canFire(currentTime) {
        return currentTime > this.lastFired + this.currentWeapon.weaponStats.cooldown;
    }

    reloadAndSetCooldown(currentTime) {
        this.currentWeapon.reload();
        this.lastFired = currentTime;  // Update the timestamp even if reloading
    }

    attackWithWeapon() {
        let nearestEnemy = this.findNearestEnemy();

        if (nearestEnemy) {
            const distanceToTarget = Phaser.Math.Distance.Between(this.x, this.y, nearestEnemy.x, nearestEnemy.y);
            if (distanceToTarget <= this.currentWeapon.weaponStats.maxRange) {
                let directionVector = {
                    x: nearestEnemy.x - this.x,
                    y: nearestEnemy.y - this.y
                };
                
                this.currentWeapon.fireFromPosition(this.x, this.y, directionVector, this);
            }
        }
    }

    findNearestEnemy() {
        let nearestEnemy = null;
        let nearestDistance = Infinity;

        this.scene.enemyManager.enemies.getChildren().forEach(enemy => {
            const distance = Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y);
            
            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearestEnemy = enemy;
            }
        });
        
        return nearestEnemy;
    }

    switchWeapon() {
        this.currentWeaponIndex = (this.currentWeaponIndex + 1) % this.weapons.length;
        this.currentWeapon = this.weapons[this.currentWeaponIndex];

        this.setupAutoFireEvent();
        this.lastFired = this.scene.time.now - this.currentWeapon.weaponStats.cooldown;
    }

    setupText(x, y, text) {
        return this.scene.add.text(x, y, text, {
            fontSize: '12px',
            fill: '#ffffff'
        }).setScrollFactor(0).setDepth(4);
    }
}

//Hero.js
class Hero extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, direction) {
        super(scene, x, y, texture, frame); 
        
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
        // Weapon properties
        this.initializeWeapons();
    }

    initializeWeapons() {
        this.weapons = WeaponFactory.getWeapons(this.scene);
        this.currentWeaponIndex = 0;
        this.currentWeapon = this.weapons[this.currentWeaponIndex];

        
        // Autofire event setup
        this.setupAutoFireEvent();
    }


    setupText(x, y, text) {
        return this.scene.add.text(x, y, text, {
            fontSize: '12px',
            fill: '#ffffff'
        }).setScrollFactor(0).setDepth(4);
    }

    setupAutoFireEvent() {
        if (this.autofireEvent) {
            this.autofireEvent.remove();
        }
        this.autofireEvent = this.scene.time.addEvent({
            delay: this.currentWeapon.weaponStats.cooldown,
            callback: this.fireWeapon,
            callbackScope: this,
            loop: true
        });
        
    }

    pauseFiring() {
        if (this.autofireEvent) {
            this.autofireEvent.paused = true;
        }
    }
    
    resumeFiring() {
        if (this.autofireEvent) {
            this.autofireEvent.paused = false;
        }
    }


    fireWeapon() {    
        const currentTime = this.scene.time.now;
        if (this.currentWeapon.isReadyToFire(currentTime)) {
            this.fireBasedOnDirection();
            this.lastFired = currentTime;
        }
    }
    
    canFire(currentTime) {
        return currentTime > this.lastFired + this.currentWeapon.weaponStats.cooldown;
    }
    
    reloadAndSetCooldown(currentTime) {
        this.currentWeapon.reload();
        
        this.lastFired = currentTime;  // Update the timestamp even if reloading
    }
    
    fireBasedOnDirection() {
        let {x, y} = this.getDirectionOffsets();
        this.currentWeapon.fire(this.x + x, this.y + y,this.scene.time.now);
    }
    getDirectionOffsets() {
        let offsets = {x: 0, y: 0};
        
        switch (this.direction) {
            case 'up': offsets.y = -10; break;
            case 'down': offsets.y = 10; break;
            case 'left': offsets.x = -10; break;
            case 'right': offsets.x = 10; break;
        }

        return offsets;
    }

    switchWeapon() {
        this.currentWeaponIndex = (this.currentWeaponIndex + 1) % this.weapons.length;
        this.currentWeapon = this.weapons[this.currentWeaponIndex];

        this.setupAutoFireEvent();
        // Reset the lastFired timestamp to allow immediate firing.
        this.lastFired = this.scene.time.now - this.currentWeapon.weaponStats.cooldown;

        
    }
}


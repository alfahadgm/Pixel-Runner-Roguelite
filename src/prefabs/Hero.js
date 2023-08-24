
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
        this.heroStats = new HeroStats();
        this.lastFired = 0;
        this.body.setSize(15,20,true);

        // Weapon properties
        this.initializeWeapons();
    }

    initializeWeapons() {
        this.weapons = WeaponFactory.getWeapons(this.scene);
        this.currentWeaponIndex = 0;
        this.currentWeapon = this.weapons[this.currentWeaponIndex];
        
        // Display current weapon and ammo
        this.weaponDisplayText = this.setupText(5, 10, this.currentWeapon.name);
        this.ammoDisplayText = this.setupText(5, 20, this.formatAmmoText());
        
        // Autofire event setup
        this.setupAutoFireEvent();
    }

    setupText(x, y, text) {
        return this.scene.add.text(x, y, text, {
            fontSize: '12px',
            fill: '#ffffff'
        }).setScrollFactor(0).setDepth(1000);
    }

    formatAmmoText() {
        return `${this.currentWeapon.currentMagazine}/${this.currentWeapon.ammo}`;
    }

    setupAutoFireEvent() {
        if (this.autofireEvent) {
            console.log("Removing existing autofire event");
            this.autofireEvent.remove();
        }
    
        this.autofireEvent = this.scene.time.addEvent({
            delay: this.currentWeapon.cooldown,
            callback: this.fireWeapon,
            callbackScope: this,
            loop: true
        });
        console.log("New autofire event set with delay:", this.currentWeapon.cooldown);
    }

    fireWeapon() {
        console.log('Trying to fire with', this.currentWeapon.name);
        const currentTime = this.scene.time.now;
    
        if (this.canFire(currentTime)) {
            if (this.currentWeapon.currentMagazine <= 0 && !this.currentWeapon.isReloading) {
                this.reloadAndSetCooldown(currentTime);
            } else {
                this.fireBasedOnDirection();
                this.lastFired = currentTime;
                this.ammoDisplayText.setText(this.formatAmmoText());
            }
        }
    }
    
    canFire(currentTime) {
        return currentTime > this.lastFired + this.currentWeapon.cooldown;
    }
    
    reloadAndSetCooldown(currentTime) {
        this.currentWeapon.reload();
        console.log("Hero Trying to Reload");
        this.lastFired = currentTime;  // Update the timestamp even if reloading
    }
    
    

    fireBasedOnDirection() {
        let {x, y} = this.getDirectionOffsets();
        this.currentWeapon.fire(this.x + x, this.y + y, this.direction, this);
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
        this.lastFired = this.scene.time.now - this.currentWeapon.cooldown;
        this.weaponDisplayText.setText(this.currentWeapon.name);
        this.ammoDisplayText.setText(this.formatAmmoText());
        console.log("Switched to weapon:", this.currentWeapon.name, "with cooldown:", this.currentWeapon.cooldown);
    }


    
}


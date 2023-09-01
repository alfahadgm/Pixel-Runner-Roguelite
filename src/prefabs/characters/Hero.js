
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
        this.heroStats.startShieldRegeneration();
        // Weapon properties
        this.initializeWeapons();
        this.healthBar = new HealthBar(scene, x, y - 20);  // Assuming a height of 20 for the health bar
        this.shieldBar = new ShieldBar(scene, x, y - 20);  // Assuming a height of 20 for the health bar
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
            console.log("Previous autofire event removed.");
        }
        this.autofireEvent = this.scene.time.addEvent({
            delay: this.currentWeapon.weaponStats.cooldown,
            callback: this.fireWeapon,
            callbackScope: this,
            loop: true
        });
    }

    updateAutoFireDelay() {
        if (this.autofireEvent && this.autofireEvent.delay !== this.currentWeapon.weaponStats.cooldown) {
            this.autofireEvent.remove();
            this.setupAutoFireEvent();
        }
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
        this.fireBasedOnDirection();
        this.lastFired = currentTime;
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
        this.currentWeapon.fire(this.x + x, this.y + y);
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



    update() {
        this.healthBar.healthBarsetPosition(this.x -9 , this.y - 16 );
        this.shieldBar.shieldBarsetPosition(this.x -9 , this.y - 19 );
        this.healthBar.update();
        this.shieldBar.update();
    }
}

class HealthBar {

    constructor (scene, x, y)
    {
        this.bar = new Phaser.GameObjects.Graphics(scene);
        this.bar.setDepth(4);
        this.x = x;
        this.y = y;
        this.value = 100;
        this.p = 19 / 100;

        this.draw();
        this.scene = scene;
        scene.add.existing(this.bar);
    }

    healthBarsetPosition(x, y) {
        this.x = x;
        this.y = y;
        this.draw();
    }

    update()
    {
        this.value = (this.scene.hero.heroStats.health/this.scene.hero.heroStats.maxhealth) * 100;

        if (this.value < 0)
        {
            this.value = 0;
        }
        this.draw();
        return (this.value === 0);
    }

    draw ()
    {
        this.bar.clear();

        // BG
    //    this.bar.fillStyle(0x000000);
    //      this.bar.fillRect(this.x, this.y, 20, 4); // quarter of the original values

        // Health
        this.bar.fillStyle(0xffffff);
        this.bar.fillRect(this.x + 0.5, this.y + 0.5, 19, 3); // adjusted accordingly

        if (this.value < 30)
        {
            this.bar.fillStyle(0xff0000);
        }
        else
        {
            this.bar.fillStyle(0x00ff00);
        }

        var d = Math.floor(this.p * this.value);

        this.bar.fillRect(this.x + 0.5, this.y + 0.5, d, 3); // adjusted accordingly
    }

}

class ShieldBar {

    constructor (scene, x, y)
    {
        this.bar = new Phaser.GameObjects.Graphics(scene);
        this.bar.setDepth(4);
        this.x = x;
        this.y = y;
        this.value = 100;
        this.p = 19 / 100;

        this.draw();
        this.scene = scene;
        scene.add.existing(this.bar);
    }

    shieldBarsetPosition(x, y) {
        this.x = x;
        this.y = y;
        this.draw();
    }

    update()
    {
        this.value = (this.scene.hero.heroStats.shield/this.scene.hero.heroStats.maxshield) * 100;

        if (this.value < 0)
        {
            this.value = 0;
        }
        this.draw();
        return (this.value === 0);
    }

    draw ()
    {
        this.bar.clear();

        // BG
    //    this.bar.fillStyle(0x000000);
    //      this.bar.fillRect(this.x, this.y, 20, 4); // quarter of the original values

        // Health
        this.bar.fillStyle(0xffffff);
        this.bar.fillRect(this.x + 0.5, this.y + 0.5, 19, 3); // adjusted accordingly
        this.bar.fillStyle(0x808080);
        var d = Math.floor(this.p * this.value);
        this.bar.fillRect(this.x + 0.5, this.y + 0.5, d, 3); // adjusted accordingly
    }

}

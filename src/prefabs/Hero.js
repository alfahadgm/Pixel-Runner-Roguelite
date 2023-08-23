

//Hero.js
class Hero extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, direction) {
        super(scene, x, y, texture, frame); 
        scene.add.existing(this);          
        scene.physics.add.existing(this);  
        this.scene = scene;  // Assigning scene to an instance variable
        this.body.setCollideWorldBounds(false);

        // set custom Hero properties
        this.direction = direction; 
        this.heroVelocity = 100;    // in pixels
        this.dashCooldown = 300;    // in ms
        this.hurtTimer = 250;       // in ms
        this.lastFired = 0;         // Initializing lastFired to ensure it has a value
        this.fireCooldown = 1000;   // Assuming a cooldown of 1000ms for firing bullets
        this.heroStats = new HeroStats();

    // Initialize weapons for the hero
    this.weapons = WeaponFactory.getWeapons(scene);
    this.currentWeaponIndex = 0;
    this.currentWeapon = this.weapons[this.currentWeaponIndex];
    this.weaponDisplayText = scene.add.text(5, 10, this.currentWeapon.name, {
        fontSize: '12px',
        fill: '#ffffff'
    }).setScrollFactor(0).setDepth(1000);
    this.ammoDisplayText = scene.add.text(5, 20, this.currentWeapon.currentAmmo + "/" + this.currentWeapon.maxAmmo, {
        fontSize: '12px',
        fill: '#ffffff'
    }).setScrollFactor(0).setDepth(1000);

    this.lastFired = 0; // Keep track of the last time a bullet was fired

    this.autofireEvent = scene.time.addEvent({
        delay: this.currentWeapon.cooldown, 
        callback: this.fireWeapon, 
        callbackScope: this, 
        loop: true
    });
    }

    fireWeapon() {
        if (this.currentWeapon.currentAmmo <= 0 && this.currentWeapon.isReloading == false ){
            this.currentWeapon.reload();
            console.log("Reloading...");
        } else {
        const currentTime = this.scene.time.now;
    
        if (currentTime > this.lastFired + this.currentWeapon.cooldown) {
            // Adjust the x and y offsets depending on the direction of the hero
            let offsetX = 0, offsetY = 0;
            switch (this.direction) {
                case 'up': offsetY = -10; break;
                case 'down': offsetY = 10; break;
                case 'left': offsetX = -10; break;
                case 'right': offsetX = 10; break;
            }
    
            this.currentWeapon.fire(this.x + offsetX, this.y + offsetY, this.direction, this);
            this.lastFired = currentTime;
        }

        this.ammoDisplayText.setText(this.currentWeapon.currentAmmo + "/" + this.currentWeapon.maxAmmo);
        }
    }
    

    switchWeapon() {
        // Find the next weapon in the array
        const nextWeaponIndex = (this.weapons.indexOf(this.currentWeapon) + 1) % this.weapons.length;
        this.currentWeapon = this.weapons[nextWeaponIndex];
    
        // Update the autofire event with the new weapon's cooldown
        this.autofireEvent.remove();
        this.autofireEvent = this.scene.time.addEvent({
            delay: this.currentWeapon.cooldown, 
            callback: this.fireWeapon, 
            callbackScope: this, 
            loop: true
        });
        this.weaponDisplayText.setText(this.currentWeapon.name);
        this.ammoDisplayText.setText(this.currentWeapon.currentAmmo + "/" + this.currentWeapon.maxAmmo);
    }
    
}

// hero-specific state classes
class IdleState extends State {
    enter(scene, hero) {
        hero.setVelocity(0);
        hero.anims.play(`walk-${hero.direction}`);
        hero.anims.stop();
    }

    execute(scene, hero) {
        // use destructuring to make a local copy of the keyboard object
        const { left, right, up, down, space, shift } = scene.keys;
        const HKey = scene.keys.HKey;

        // transition to swing if pressing space
        if(Phaser.Input.Keyboard.JustDown(space)) {
            this.stateMachine.transition('swing');
            return;
        }

        // transition to dash if pressing shift
        if(Phaser.Input.Keyboard.JustDown(shift)) {
            this.stateMachine.transition('dash');
            return;
        }

        // hurt if H key input (just for demo purposes)
        if(Phaser.Input.Keyboard.JustDown(HKey)) {
            this.stateMachine.transition('hurt');
            return;
        }

        // transition to move if pressing a movement key
        if(left.isDown || right.isDown || up.isDown || down.isDown ) {
            this.stateMachine.transition('move');
            return;
        }
    }

    
}

class MoveState extends State {
    execute(scene, hero) {
        // use destructuring to make a local copy of the keyboard object
        const { left, right, up, down, space, shift } = scene.keys;
        const HKey = scene.keys.HKey;

        // transition to swing if pressing space
        if(Phaser.Input.Keyboard.JustDown(space)) {
            this.stateMachine.transition('swing');
            return;
        }

        // transition to dash if pressing shift
        if(Phaser.Input.Keyboard.JustDown(shift)) {
            this.stateMachine.transition('dash');
            return;
        }

        // hurt if H key input (just for demo purposes)
        if(Phaser.Input.Keyboard.JustDown(HKey)) {
            this.stateMachine.transition('hurt');
            return;
        }

        // transition to idle if not pressing movement keys
        if(!(left.isDown || right.isDown || up.isDown || down.isDown)) {
            this.stateMachine.transition('idle');
            return;
        }

        

        // handle movement
        let moveDirection = new Phaser.Math.Vector2(0, 0);
        if(up.isDown) {
            moveDirection.y = -1;
            scene.followPoint.y -= 1;
            hero.direction = 'up';
            
        } else if(down.isDown) {
            moveDirection.y = 1;
            scene.followPoint.y += 1;
            hero.direction = 'down';
        }
        if(left.isDown) {
            moveDirection.x = -1;
            scene.followPoint.x -= 1;
            hero.direction = 'left';

        } else if(right.isDown) {
            moveDirection.x = 1;
            scene.followPoint.x += 1;
            hero.direction = 'right';

        }
        // normalize movement vector, update hero position, and play proper animation
        moveDirection.normalize();
        hero.setVelocity(hero.heroVelocity * moveDirection.x, hero.heroVelocity * moveDirection.y);
        hero.anims.play(`walk-${hero.direction}`, true);
    }
}

class SwingState extends State {
    enter(scene, hero) {
        hero.setVelocity(0);
        hero.anims.play(`swing-${hero.direction}`);
        hero.once('animationcomplete', () => {
            this.stateMachine.transition('idle');
        });
    }
}

class DashState extends State {
    enter(scene, hero) {
        hero.setVelocity(0);
        hero.anims.play(`swing-${hero.direction}`);
        hero.setTint(0x00AA00);     // turn green
        switch(hero.direction) {
            case 'up':
                hero.setVelocityY(-hero.heroVelocity * 3);
                break;
            case 'down':
                hero.setVelocityY(hero.heroVelocity * 3);
                break;
            case 'left':
                hero.setVelocityX(-hero.heroVelocity * 3);
                break;
            case 'right':
                hero.setVelocityX(hero.heroVelocity * 3);
                break;
        }

        // set a short cooldown delay before going back to idle
        scene.time.delayedCall(hero.dashCooldown, () => {
            hero.clearTint();
            this.stateMachine.transition('idle');
        });
    }
}

class HurtState extends State {
    enter(scene, hero) {
        hero.setVelocity(0);
        hero.anims.play(`walk-${hero.direction}`);
        hero.anims.stop();
        hero.setTint(0xFF0000);     // turn red
        // create knockback by sending body in direction opposite facing direction
        switch(hero.direction) {
            case 'up':
                hero.setVelocityY(hero.heroVelocity*2);
                break;
            case 'down':
                hero.setVelocityY(-hero.heroVelocity*2);
                break;
            case 'left':
                hero.setVelocityX(hero.heroVelocity*2);
                break;
            case 'right':
                hero.setVelocityX(-hero.heroVelocity*2);
                break;
        }

        // set recovery timer
        scene.time.delayedCall(hero.hurtTimer, () => {
            hero.clearTint();
            this.stateMachine.transition('idle');
        });
    }

        enterHurtState() {
        this.stateMachine.transition('hurt');
    }


}
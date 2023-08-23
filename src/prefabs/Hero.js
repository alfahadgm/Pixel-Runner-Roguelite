
//Hero.js
class Hero extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, direction) {
        super(scene, x, y, texture, frame); 
        scene.add.existing(this);          
        scene.physics.add.existing(this);  

        this.body.setCollideWorldBounds(false);

        // set custom Hero properties
        this.direction = direction; 
        this.heroVelocity = 100;    // in pixels
        this.dashCooldown = 300;    // in ms
        this.hurtTimer = 250;       // in ms
        this.lastFired = 0;         // Initializing lastFired to ensure it has a value
        this.fireCooldown = 1000;   // Assuming a cooldown of 1000ms for firing bullets
        this.weapons = [
            new Weapon(scene, 0xFF0000, 1000, "Sniper"),  // Red weapon (Sniper)
            new Weapon(scene, 0x00FF00, 500, "Pistol"),   // Green weapon (Pistol)
            new Weapon(scene, 0x0000FF, 750, "Rifle")     // Blue weapon (Rifle)
        ];
        this.currentWeaponIndex = 0;

    // Initialize the weapon display text
    this.weaponDisplayText = scene.add.text(10, 10, this.weapons[this.currentWeaponIndex].name, {
        fontSize: '32px',
        fill: '#ffffff'
    });

    this.weaponDisplayText.setScrollFactor(0); // This makes the text follow the camera
    this.weaponDisplayText.setDepth(1000);     // This ensures the text is rendered above other game objects

    this.autofireEvent = this.scene.time.addEvent({
        delay: this.weapons[this.currentWeaponIndex].cooldown,
        callback: this.fireWeapon,
        callbackScope: this,
        loop: true
    });
    }

    fireWeapon() {
        console.log('Hero: Firing current weapon.');
        const currentTime = this.scene.time.now;
        const currentWeapon = this.weapons[this.currentWeaponIndex];
    
        if (currentTime > this.lastFired + currentWeapon.cooldown) {
            let offsetX = 0;
            let offsetY = 0;
    
            switch (this.direction) {
                case 'up':
                    offsetY = -10;
                    break;
                case 'down':
                    offsetY = 10;
                    break;
                case 'left':
                    offsetX = -10;
                    break;
                case 'right':
                    offsetX = 10;
                    break;
            }
    
            this.weapons[this.currentWeaponIndex].fire(this.x + offsetX, this.y + offsetY, this.direction, this);
            this.lastFired = currentTime;
        }
    }

    switchWeapon() {
        this.currentWeaponIndex = (this.currentWeaponIndex + 1) % this.weapons.length;
        this.autofireEvent.remove();  // Remove the current autofire event
        // Add a new one with updated cooldown
        this.autofireEvent = this.scene.time.addEvent({
            delay: this.weapons[this.currentWeaponIndex].cooldown,
            callback: this.fireWeapon,
            callbackScope: this,
            loop: true
        });
        this.weaponDisplayText.setText(this.weapons[this.currentWeaponIndex].name);
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
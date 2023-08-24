
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
        hero.anims.play(`swing-${hero.direction}`);
        hero.once('animationcomplete', () => {
            this.stateMachine.transition('idle');
        });
    }
}

class DashState extends State {
    enter(scene, hero) {
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
        hero.setTint(0xFF0000);
    }
}
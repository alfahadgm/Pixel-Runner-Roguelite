
class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'bullet');
        scene.add.existing(this);  // Add the bullet to the scene's display list
        scene.physics.world.enable(this);

        this.setCollideWorldBounds(false);  // Turn off static world bounds
        this.body.onWorldBounds = true;     // Ensure world bounds event is enabled
        this.body.world.on('worldbounds', this.worldBoundsHandler, this); // Add an event handler
        this.speed = 800;
    }

    fire(x, y, direction, hero) {
        console.log('Weapon: Fire function called with direction:', direction);
        // Adjust bullet boundaries based on hero's position
        this.worldBounds = {
            left: hero.x - (hero.scene.game.config.width / 2),
            right: hero.x + (hero.scene.game.config.width / 2),
            top: hero.y - (hero.scene.game.config.height / 2),
            bottom: hero.y + (hero.scene.game.config.height / 2)
        };
        
        this.setRotation(this.calculateRotation(direction)); // Algorithmically set rotation

        switch (direction) {
            case 'up':
                this.setVelocityY(-this.speed);
                break;
            case 'down':
                this.setVelocityY(this.speed);
                break;
            case 'left':
                this.setVelocityX(-this.speed);
                break;
            case 'right':
                this.setVelocityX(this.speed);
                break;
        }
    }

    calculateRotation(direction) {
        const angles = {
            'right': 0,
            'up': -Math.PI / 2,
            'left': Math.PI,
            'down': Math.PI / 2
        };

        return angles[direction] || 0;  // Default to 0 if direction is not recognized
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        // Check if bullet has crossed world boundaries based on hero's position
        if (this.x < this.worldBounds.left || this.x > this.worldBounds.right ||
            this.y < this.worldBounds.top || this.y > this.worldBounds.bottom) {
            this.destroy();
        }
    }

    worldBoundsHandler(body) {
        if (body.gameObject === this) {
            this.destroy();
        }
    }
}

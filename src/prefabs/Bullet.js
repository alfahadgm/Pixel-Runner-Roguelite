class Bullet {
    constructor(scene, weaponStats, x, y, texture) {
        this.scene = scene;
        this.weaponStats = weaponStats; 
        this.sprite = this.scene.physics.add.sprite(x, y, texture).setDepth(2);
        this.sprite.setActive(false);
        this.sprite.setVisible(false);
        let radius = Math.max(20) / 2;
        this.sprite.body.setCircle(radius);
        const offsetX = (this.sprite.width - radius * 2) / 2;
        const offsetY = (this.sprite.height - radius * 2) / 2;
        this.sprite.body.setOffset(offsetX, offsetY);
    }

    fire(x, y, direction) {
        this.sprite.setActive(true);
        this.sprite.setVisible(true);
        this.sprite.setPosition(x, y);

        let velocity = {
            x: DIRECTIONS[direction].velocityX || 0,
            y: DIRECTIONS[direction].velocityY || 0
        };

        velocity.x *= this.weaponStats.bulletSpeed; 
        velocity.y *= this.weaponStats.bulletSpeed; 

        this.sprite.setVelocity(velocity.x, velocity.y);

        // Set rotation angle based on the direction
        switch(direction) {
            case 'right':
                this.sprite.setAngle(0);
                break;
            case 'up':
                this.sprite.setAngle(-90);
                break;
            case 'left':
                this.sprite.setAngle(180);
                break;
            case 'down':
                this.sprite.setAngle(90);
                break;
        }
    }  
}

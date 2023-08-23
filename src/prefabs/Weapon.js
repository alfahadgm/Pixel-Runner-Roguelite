// Weapon.js
class Weapon {
    constructor(scene, color, cooldown, name) {
        this.scene = scene;
        this.color = color; // Color of the weapon bullet
        this.name = name;   // Name of the weapon
        this.cooldown = cooldown; // Assign cooldown to the weapon
        this.bullets = this.scene.add.group({
            classType: Bullet,
            removeCallback: (bullet) => bullet.scene.sys.updateList.remove(bullet)
        });
        this.lineBullets = [];
    }

    fire(x, y, direction, hero) {
        if (this.color) {  // Bullet represented as a line
            this.fireLineBullet(x, y, direction, hero);
            console.log('Weapon: Firing line bullet with direction:', direction);
        } else {  // Sprite-based bullet
            let bullet = this.bullets.get(x, y);
            if (bullet) {
                bullet.fire(x, y, direction, hero);
            }
        }
    }

    fireLineBullet(x, y, direction, hero) {
        const lineLength = 10;
        const speed = 200; // Speed of the moving line
    
        let endX = x;
        let endY = y;
        let velocityX = 0;
        let velocityY = 0;
    
        switch (direction) {
            case 'up':
                endY = y - lineLength;
                velocityY = -speed;
                break;
            case 'down':
                endY = y + lineLength;
                velocityY = speed;
                break;
            case 'left':
                endX = x - lineLength;
                velocityX = -speed;
                break;
            case 'right':
                endX = x + lineLength;
                velocityX = speed;
                break;
        }
    
        const bullet = {
            startX: x,
            startY: y,
            endX: endX,
            endY: endY,
            direction: direction,
            line: new Phaser.Geom.Line(x, y, endX, endY), // Setting the line's end points directly here
            graphics: this.scene.add.graphics({ lineStyle: { width: 2, color: this.color } }),
            update: function(delta) {
                const adjustedDelta = delta / 1000; // Convert milliseconds to seconds
                this.line.x1 += velocityX * adjustedDelta;
                this.line.x2 += velocityX * adjustedDelta;
                this.line.y1 += velocityY * adjustedDelta;
                this.line.y2 += velocityY * adjustedDelta;
            }
        };

        console.log('Bullet velocity (X, Y):', velocityX, velocityY);
        console.log('Bullet created with start and end points:', bullet.startX, bullet.startY, bullet.endX, bullet.endY);
        this.lineBullets.push(bullet);
        bullet.graphics.strokeLineShape(bullet.line); // Explicitly drawing the line bullet at creation
    }

    update(delta, hero) {
        for (let bullet of this.lineBullets) {
            bullet.update(delta);

            bullet.graphics.clear();
            bullet.graphics.strokeLineShape(bullet.line);

            const boundaryOffset = 300; // or whatever distance you consider as the boundary from the hero

            if ((bullet.direction === 'up' && bullet.line.y1 <= hero.y - boundaryOffset) ||
                (bullet.direction === 'down' && bullet.line.y1 >= hero.y + boundaryOffset) ||
                (bullet.direction === 'left' && bullet.line.x1 <= hero.x - boundaryOffset) ||
                (bullet.direction === 'right' && bullet.line.x1 >= hero.x + boundaryOffset)) {
                    this.removeLineBullet(bullet);
            }
            
        }
    }

    removeLineBullet(bullet) {
        console.log('Bullet being removed at position (X1, Y1):', bullet.line.x1, bullet.line.y1);

        if (bullet.graphics) {
            bullet.graphics.destroy();
        }
        const index = this.lineBullets.indexOf(bullet);
        if (index > -1) {
            this.lineBullets.splice(index, 1);
        }
    }
}
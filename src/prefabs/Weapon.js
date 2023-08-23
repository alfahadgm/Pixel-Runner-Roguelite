
class Weapon {
    constructor(scene, weaponStats, color, cooldown, name) {
        this.scene = scene;
        this.weaponStats = weaponStats || new WeaponStats();
        this.color = color;
        this.name = name;
        this.cooldown = cooldown;
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

// WeaponFactory.js
class WeaponFactory {
    static getWeapons(scene) {
        const pistolStats = new WeaponStats(20, 1.5, 5.0, 60.0);
        const sniperStats = new WeaponStats(50, 2.0, 10.0, 100.0);

        return [
            new Pistol(scene, pistolStats, 500),
            new Sniper(scene, sniperStats, 2000),
        ];
    }
}


class Pistol extends Weapon {
    constructor(scene, weaponStats, cooldown, name) {
        super(scene, weaponStats, 0xFFFF00, cooldown, name || "Pistol");
        this.maxAmmo = 15;
        this.currentAmmo = this.maxAmmo;
        this.reloadTime = 2000; // 2 seconds
        this.isReloading = false;
    }

    fire(x, y, direction, hero) {
        if (this.currentAmmo > 0) {
            super.fire(x, y, direction, hero);
            this.currentAmmo--;
        } else {
            console.log('Out of ammo! Need to reload.');
        }
    }

    reload() {
        this.isReloading = true;
        setTimeout(() => {
            this.currentAmmo = this.maxAmmo;
            console.log('Pistol reloaded.');
            this.isReloading = false;
        }, this.reloadTime);
    }
}

class Sniper extends Weapon {
    constructor(scene, weaponStats, cooldown, name) {
        super(scene, weaponStats, 0xFF0000, cooldown, name || "Sniper");
        this.maxAmmo = 5;
        this.currentAmmo = this.maxAmmo;
        this.reloadTime = 5000; // 5 seconds
        this.isReloading = false;
    }

    fire(x, y, direction, hero) {
        if (this.currentAmmo > 0) {
            super.fire(x, y, direction, hero);
            this.currentAmmo--;
        } else {
            console.log('Out of ammo! Need to reload.');
        }
    }

    reload() {
        this.isReloading = true;
        setTimeout(() => {
            this.currentAmmo = this.maxAmmo;
            console.log('Sniper reloaded.');
            this.isReloading = false;
        }, this.reloadTime);
    }
}

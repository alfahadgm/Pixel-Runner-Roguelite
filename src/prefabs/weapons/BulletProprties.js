
// Sample subclasses with unique behaviours
class Electric extends Effect {
    constructor(properties) {
        super('Electric', properties);
    }
    handleEffect(bullet, enemy) {
        // Example: Reduce enemy's health with electric effect
        enemy.health -= this.properties.damage || 0;
        console.log('Electrified enemy with damage:', this.properties.damage);
    }
}

class Ricochet extends Trajectory {
    constructor(properties) {
        super('Ricochet', properties);
    }

    handleTrajectory(bullet, enemy) {
        // Example: Bullet bounces off an enemy
        bullet.setVelocity(-bullet.body.velocity.x, -bullet.body.velocity.y);
        console.log('Bullet ricocheted.');
    }
}

class Leeching extends Trait {
    constructor(properties) {
        super('Leeching', properties);
    }

    handleTrait(bullet, enemy) {
        // Example: Leech health from the enemy and add to the player's health
        const leechAmount = this.properties.amount || 0;
        enemy.health -= leechAmount;
        bullet.scene.player.health += leechAmount;
        console.log(`Leeched ${leechAmount} health from enemy.`);
    }
}

class Steel extends Material {
    constructor(properties) {
        super('Steel', properties);
    }

    handleMaterial(bullet, enemy) {
        // Example: Inflict more damage due to steel material
        enemy.health -= this.properties.additionalDamage || 0;
        console.log('Inflicted additional steel damage:', this.properties.additionalDamage);
    }
}
// Bullet related classes
class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, bulletType, x, y) {
        super(scene, x, y, bulletType.texture);
        this.scene = scene;
        this.speed = bulletType.speed;
        this.effect = bulletType.effect;
        this.behavior = bulletType.behavior;
        this.attributes = bulletType.attributes;
        this.material = bulletType.material;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
    }

    shootInDirection(x, y, direction) {
        this.setPosition(x, y);
        
        const normalizedDirection = this.scene.utils.normalizeVector(direction);
        
        this.setVelocity(normalizedDirection.x * this.speed, normalizedDirection.y * this.speed);
    }
    
}



// Abstract BulletEffect class
class BulletEffect {
    constructor(type, properties = {}) {
        this.type = type;
        this.properties = properties;
    }
}

class StandardEffect extends BulletEffect {
    constructor(properties = {}) {
        super('Standard', properties);
    }
}

// Abstract BulletBehavior class
class BulletBehavior {
    constructor(type, properties = {}) {
        this.type = type;
        this.properties = properties;
    }
}

class StandardBehavior extends BulletBehavior {
    constructor(properties = {}) {
        super('Standard', properties);
    }
}

// Abstract BulletAttributes class
class BulletAttributes {
    constructor(type, properties = {}) {
        this.type = type;
        this.properties = properties;
    }
}

class StandardAttribute extends BulletAttributes {
    constructor(properties = {}) {
        super('Standard', properties);
    }
}

// Abstract BulletMaterial class
class BulletMaterial {
    constructor(type, properties = {}) {
        this.type = type;
        this.properties = properties;
    }
}

class StandardMaterial extends BulletMaterial {
    constructor(properties = {}) {
        super('Standard', properties);
    }
}

const bulletClasses = {
    effect: {
        'Standard': StandardEffect,
    },
    behavior: {
        'Standard': StandardBehavior,
    },
    attributes: {
        'Standard': StandardAttribute,
    },
    material: {
        'Standard': StandardMaterial,
    }
};


// Combine all bullet related classes together
class BulletType {
    constructor(texture, speed, effect, effectProperties, behavior, behaviorProperties, attributes, attributesProperties, material, materialProperties) {
        this.texture = texture;
        this.speed = speed;

        this.effect = new bulletClasses.effect[effect](effectProperties);
        this.behavior = new bulletClasses.behavior[behavior](behaviorProperties);
        this.attributes = new bulletClasses.attributes[attributes](attributesProperties);
        this.material = new bulletClasses.material[material](materialProperties);
    }
}
// Extending BulletEffect classes
class ElectricEffect extends BulletEffect {
    constructor(properties) {
        super('Electric', properties);
        this.stunDuration = properties.stunDuration;
        this.amplifiedWithGraphene = properties.amplifiedWithGraphene;
    }
}

class PoisonEffect extends BulletEffect {
    constructor(properties) {
        super('Poison', properties);
        this.duration = properties.duration;
        this.damageOverTime = properties.damageOverTime;
        this.toxicTrail = properties.toxicTrail;
    }
}

class BleedEffect extends BulletEffect {
    constructor(properties) {
        super('Bleed', properties);
        this.duration = properties.duration;
        this.damageOverTime = properties.damageOverTime;
        this.enhancedWithDiamond = properties.enhancedWithDiamond;
    }
}

class FreezeEffect extends BulletEffect {
    constructor(properties) {
        super('Freeze', properties);
        this.duration = properties.duration;
    }
}

class BlindEffect extends BulletEffect {
    constructor(properties) {
        super('Blind', properties);
        this.duration = properties.duration;
        this.range = properties.range;
    }
}

// Extending BulletBehavior classes
class RicochetBehavior extends BulletBehavior {
    constructor(properties) {
        super('Ricochet', properties);
        this.bounces = properties.bounces;
        this.reducedDamageAfterBounce = properties.reducedDamageAfterBounce;
    }
}

class PiercingBehavior extends BulletBehavior {
    constructor(properties) {
        super('Piercing', properties);
        this.pierceCount = properties.pierceCount;
        this.enhancedWithDiamond = properties.enhancedWithDiamond;
    }
}

class SplittingBehavior extends BulletBehavior {
    constructor(properties) {
        super('Splitting', properties);
        this.splitCount = properties.splitCount;
        this.condition = properties.condition; // condition can be "onImpact" or "distance"
    }
}

class SpiralBehavior extends BulletBehavior {
    constructor(properties) {
        super('Spiral', properties);
        this.radius = properties.radius;
        this.speedVariation = properties.speedVariation; // can be "increasing" or "decreasing"
    }
}

// Extending BulletAttributes classes
class CriticalChanceAttribute extends BulletAttributes {
    constructor(properties) {
        super('CriticalChance', properties);
        this.percentageChance = properties.percentageChance;
        this.amplifiedDamage = properties.amplifiedDamage;
    }
}

class ExplosiveAttribute extends BulletAttributes {
    constructor(properties) {
        super('Explosive', properties);
        this.explosionRadius = properties.explosionRadius;
        this.aoeDamage = properties.aoeDamage;
        this.secondaryEffects = properties.secondaryEffects; // can be "fire", "shrapnel", etc.
    }
}

class IncendiaryAttribute extends BulletAttributes {
    constructor(properties) {
        super('Incendiary', properties);
        this.chanceToSetOnFire = properties.chanceToSetOnFire;
        this.burnDuration = properties.burnDuration;
        this.damageOverTime = properties.damageOverTime;
    }
}

class LeechingAttribute extends BulletAttributes {
    constructor(properties) {
        super('Leeching', properties);
        this.leechPercentage = properties.leechPercentage;
        this.cappedHealing = properties.cappedHealing;
    }
}

// Extending BulletMaterial classes
class SteelMaterial extends BulletMaterial {
    constructor(properties) {
        super('Steel', properties);
        this.magnetic = properties.magnetic;
    }
}

class CarbonFiberMaterial extends BulletMaterial {
    constructor(properties) {
        super('CarbonFiber', properties);
        this.increasedRange = properties.increasedRange;
        this.reducedDropOff = properties.reducedDropOff;
    }
}

class GrapheneMaterial extends BulletMaterial {
    constructor(properties) {
        super('Graphene', properties);
        this.amplifyElectric = properties.amplifyElectric;
        this.increasedSpeed = properties.increasedSpeed;
    }
}

class TitaniumMaterial extends BulletMaterial {
    constructor(properties) {
        super('Titanium', properties);
        this.increasedSpeed = properties.increasedSpeed;
        this.reducedDrop = properties.reducedDrop;
    }
}

class OsmiumMaterial extends BulletMaterial {
    constructor(properties) {
        super('Osmium', properties);
        this.increasedImpact = properties.increasedImpact;
        this.reducedSpeed = properties.reducedSpeed;
    }
}

class DiamondMaterial extends BulletMaterial {
    constructor(properties) {
        super('Diamond', properties);
        this.enhancedPiercing = properties.enhancedPiercing;
        this.increasedBleedDamage = properties.increasedBleedDamage;
    }
}
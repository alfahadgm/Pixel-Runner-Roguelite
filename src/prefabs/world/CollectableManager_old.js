
class CollectableManager {
    constructor(scene) {
        this.scene = scene;
        this.collectablesGroup = this.scene.add.group({
            classType: Collectable,
        });
        // Define drop chances
        this.dropChances = [
            { type: 'goldCoin', chance: 0.025 }, // Rare
            { type: 'silverCoin', chance: 0.05 }, // Uncommon
            { type: 'bronzeCoin', chance: 0.267 }, // Common
            { type: 'heart', chance: 0.05 }, // Uncommon
            { type: 'heartmax', chance: 0.01 }, // Legendary
            { type: 'xplow', chance: 0.267 }, // Common
            { type: 'xpmid', chance: 0.03 }, // Very rare
            { type: 'xphigh', chance: 0.025 }, // Rare
            { type: 'ammo', chance: 0.267 } // Common
        ];
    }



    adjustDropChanceByRarity(rarity) {
        let adjustmentValue = 0;
        
        if (rarity !== 0) {
            for (let dropChance of this.dropChances) {
                if (['goldCoin', 'heartmax', 'xpmid', 'xphigh'].includes(dropChance.type)) {
                    adjustmentValue += 0.01 * rarity;
                    dropChance.chance += 0.01 * rarity;
                }
            }
            
            // Balance out the overall drop chances so they sum to 1.
            for (let dropChance of this.dropChances) {
                if (!['goldCoin', 'heartmax', 'xpmid', 'xphigh'].includes(dropChance.type)) {
                    dropChance.chance -= (adjustmentValue / (this.dropChances.length - 4)); 
                }
            }
        }
    }

    getRandomType() {
        const rand = Math.random();
        let sum = 0;

        for (let i = 0; i < this.dropChances.length; i++) {
            sum += this.dropChances[i].chance;
            if (rand <= sum) {
                return this.dropChances[i].type;
            }
        }

        return null; // This line should not be reached if chances sum up to 1
    }

    getRandomOffset(maxDistance) {
        const xOffset = (Math.random() - 0.5) * 2 * maxDistance;
        const yOffset = (Math.random() - 0.5) * 2 * maxDistance;
        return { x: xOffset, y: yOffset };
    }

    spawnRandom(x, y, enemyRarity) {
        this.adjustDropChanceByRarity(enemyRarity);
    
        const maxCollectables = this.numberOfRareCollectables(enemyRarity);
    
        for (let i = 0; i < maxCollectables; i++) {
            const type = this.getRandomType();
            const offset = this.getRandomOffset(20);
            this.spawn(type, x + offset.x, y + offset.y);
        }
    }

    numberOfRareCollectables(rarity) {
        switch (rarity) {
            case 0: return 1; // common enemies spawn 1 rare item at max
            case 1: return 2; // somewhat rare enemies spawn 2 rare items
            case 2: return 3; // rare enemies spawn 3 rare items
            default: return 1;
        }
    }
    

    spawn(type, x, y) {
        let collectable;
        switch (type) {
            case 'goldCoin':
                collectable = new GoldCoin(this.scene, x, y);
                break;
            case 'silverCoin':
                collectable = new SilverCoin(this.scene, x, y);
                break;
            case 'bronzeCoin':
                collectable = new BronzeCoin(this.scene, x, y);
                break;
            case 'heart':
                collectable = new Heart(this.scene, x, y);
                break;
            case 'heartmax':
                collectable = new HeartMax(this.scene, x, y);
                break;
            case 'xplow':
                collectable = new XPOrbLow(this.scene, x, y);
                break;
            case 'xpmid':
                collectable = new XPOrbMid(this.scene, x, y);
                break;
            case 'xphigh':
                collectable = new XPOrbHigh(this.scene, x, y);
                break;
            case 'ammo':
                collectable = new Ammo(this.scene, x, y);
                break;
        }

        if (collectable) {
            this.collectablesGroup.add(collectable);
        }
    }
}

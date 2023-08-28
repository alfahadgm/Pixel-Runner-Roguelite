class CollectableManager {
    constructor(scene) {
        this.scene = scene;
        this.collectablesGroup = this.scene.add.group({
            classType: Collectable,
        });

        this.dropChances = [
            { type: 'goldCoin', chance: 0.025, cost: 10 },
            { type: 'silverCoin', chance: 0.05, cost: 5 },
            { type: 'bronzeCoin', chance: 0.267, cost: 2 },
            { type: 'heart', chance: 0.05, cost: 4 }, // Uncommon
            { type: 'heartmax', chance: 0.01, cost: 25 }, // Legendary
            { type: 'xplow', chance: 0.267, cost: 2 }, // Common
            { type: 'xpmid', chance: 0.03, cost: 5 }, // Very rare
            { type: 'xphigh', chance: 0.025, cost: 10 }, // Rare
        //    { type: 'ammo', chance: 0.267, cost: 2 } // Common
        ];
    }



    getRarityFromEnemyCost(enemyName) {
        const cost = this.scene.enemyManager.enemyData[enemyName].cost;

        if (cost <= 4) return 0;
        if (cost <= 8) return 1;
        if (cost <= 20) return 2;
        return 3;
    }

    getCollectableCost(type) {
        const collectable = this.dropChances.find(item => item.type === type);
        return collectable ? collectable.cost : 0;
    }

    getRandomType(remainingCost) {
        let rand = Math.random();
        // Filter items based on cost and sort them in descending order based on chance
        const validDropChances = this.dropChances.filter(item => item.cost <= remainingCost).sort((a, b) => b.chance - a.chance);

        for (const item of validDropChances) {
            rand -= item.chance;
            if (rand <= 0) return item.type;
        }
        return null;
    }

    spawnRandom(x, y, enemyName) {
        let remainingCost = this.scene.enemyManager.enemyData[enemyName].cost;
        const enemyRarity = this.getRarityFromEnemyCost(enemyName);
        this.adjustDropChanceByRarity(enemyRarity);
    
        let spawnedAny = false; // Step 1
    
        while(remainingCost > 0) {
            const type = this.getRandomType(remainingCost);
            if (!type) break;
    
            remainingCost -= this.getCollectableCost(type);
    
            const offset = this.getRandomOffset(20);
            this.spawn(type, x + offset.x, y + offset.y);
            spawnedAny = true; // Step 2
        }
    
        // Step 3
        if (!spawnedAny) {
            const offset = this.getRandomOffset(20);
            const randomType = Math.random() < 0.5 ? 'bronzeCoin' : 'xplow';
            this.spawn(randomType, x + offset.x, y + offset.y);
        }
    }


    adjustDropChanceByRarity(rarity) {
        if (rarity === 0) return;
        
        const adjustForTypes = ['goldCoin', 'heartmax', 'xpmid', 'xphigh'];
        const totalTypesToAdjust = adjustForTypes.length;
        const adjustmentPerType = 0.01 * rarity;
        const negativeAdjustment = -(adjustmentPerType * totalTypesToAdjust) / (this.dropChances.length - totalTypesToAdjust);

        for (let dropChance of this.dropChances) {
            if (adjustForTypes.includes(dropChance.type)) {
                dropChance.chance += adjustmentPerType;
            } else {
                dropChance.chance += negativeAdjustment;
            }
        }
    }

    getRandomOffset(maxDistance) {
        const xOffset = (Math.random() - 0.5) * 2 * maxDistance;
        const yOffset = (Math.random() - 0.5) * 2 * maxDistance;
        return { x: xOffset, y: yOffset };
    }


    spawn(type, x, y) {
        const collectableClasses = {
            goldCoin: GoldCoin,
            silverCoin: SilverCoin,
            bronzeCoin: BronzeCoin,
            heart: Heart,
            heartmax: HeartMax,
            xplow: XPOrbLow,
            xpmid: XPOrbMid,
            xphigh: XPOrbHigh,
          //  ammo: Ammo
        };

        if (collectableClasses[type]) {
            const collectable = new collectableClasses[type](this.scene, x, y);
            this.collectablesGroup.add(collectable);
        }
    }
}
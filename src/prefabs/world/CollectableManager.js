

const MAX_OFFSET_DISTANCE = 20;

class CollectableManager {
    constructor(scene) {
        this.scene = scene;
        this.collectablesGroup = this.scene.add.group({
            classType: Collectable,
        });

        this.enemyDropCounter = {};
        setInterval(() => {
            this.logEnemyDropCounts();
        }, 60000); // 10000 milliseconds = 10 seconds

        this.baseDropChances = [
            { type: 'goldCoin', chance: 0.025, cost: 10 }, // Late Game
            { type: 'silverCoin', chance: 0.05, cost: 5 }, // Mid Game
            { type: 'bronzeCoin', chance: 0.267, cost: 2 }, // Early Game
            { type: 'heart', chance: 0.05, cost: 4 },  // Early-Mid Game
            { type: 'heartmax', chance: 0.01, cost: 25 }, // Totaly Random
            { type: 'xplow', chance: 0.267, cost: 2 }, // Early Game
            { type: 'xpmid', chance: 0.03, cost: 5 }, // Mid Game
            { type: 'xphigh', chance: 0.025, cost: 10 },  // Late Game
        //    { type: 'ammo', chance: 0.267, cost: 2 } 
        ];

        this.dropChances = [...this.baseDropChances];
    }

    logDropForEnemy(enemyName, dropType) {
        if (!this.enemyDropCounter[enemyName]) {
            this.enemyDropCounter[enemyName] = {};
        }
        
        if (!this.enemyDropCounter[enemyName][dropType]) {
            this.enemyDropCounter[enemyName][dropType] = 0;
        }
        
        this.enemyDropCounter[enemyName][dropType]++;
    }

    logEnemyKill(enemyName) {
        if (!this.enemyDropCounter[enemyName]) {
            this.enemyDropCounter[enemyName] = { killed: 0 };
        }
        
        if (!this.enemyDropCounter[enemyName].killed) {
            this.enemyDropCounter[enemyName].killed = 0;
        }
        
        this.enemyDropCounter[enemyName].killed++;
    }

    logEnemyDropCounts() {
        console.log("---- Enemy Stats ----");
        for (const [enemy, stats] of Object.entries(this.enemyDropCounter)) {
            console.log(`${enemy} - Killed: ${stats.killed || 0}`);
            for (const [statType, count] of Object.entries(stats)) {
                if (statType !== 'killed') {
                    console.log(`  ${statType}: ${count}`);
                }
            }
        }
    }
    

    resetDropChances() {
        this.dropChances = [...this.baseDropChances];
    }


    determineRarity(cost) {
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
        const validDropChances = this.dropChances.filter(item => item.cost <= remainingCost);
    
        let cumulativeChance = 0;
        const randomValue = Math.random();
        
        for (const item of validDropChances) {
            cumulativeChance += item.chance;
            if (randomValue < cumulativeChance) return item.type;
        }
        return null;
    }
    

    attemptSpawn(x, y, remainingCost, enemyName) {
        const type = this.getRandomType(remainingCost);
        if (type) {
            remainingCost -= this.getCollectableCost(type);
            const offset = this.getRandomOffset(20); // or whatever constant you want
            this.spawn(type, x + offset.x, y + offset.y, enemyName);
            return true;
        }
        return false;
    }
    
    spawnRandom(x, y, enemyName) {
        this.logEnemyKill(enemyName);
    
        const enemyCost = this.scene.enemyManager.enemyData[enemyName].cost;
        const enemyRarity = this.determineRarity(enemyCost);
    
        // Filter the drops that are suitable for this rarity
        const suitableDrops = this.baseDropChances.filter(item => this.isSuitableForRarity(item, enemyRarity));
    
        const type = this.getRandomTypeFromList(suitableDrops);
    
        // If no suitable type from the list, default to bronzeCoin or xplow
        const validType = type || (Math.random() < 0.5 ? 'bronzeCoin' : 'xplow');
    
        const offset = this.getRandomOffset(20);
        this.spawn(validType, x + offset.x, y + offset.y, enemyName);
    }
    
    isSuitableForRarity(item, rarity) {
        // Depending on how you want to define suitability. 
        // For instance, for rarity 0, you might want items of cost 2, for rarity 1, items of cost 4-6, etc.
        if (rarity === 0) return item.cost <= 4;
        if (rarity === 1) return item.cost > 4 && item.cost <= 8;
        if (rarity === 2) return item.cost > 8 && item.cost <= 20;
        if (rarity === 3) return item.cost > 20;
    }
    
    getRandomTypeFromList(suitableDrops) {
        const totalChance = suitableDrops.reduce((sum, item) => sum + item.chance, 0);
        let cumulativeChance = 0;
        const randomValue = Math.random();
        
        for (const item of suitableDrops) {
            cumulativeChance += item.chance / totalChance;
            if (randomValue < cumulativeChance) return item.type;
        }
    
        return null;
    }
    
    

    getRandomOffset(maxDistance) {
        const xOffset = (Math.random() - 0.5) * 2 * maxDistance;
        const yOffset = (Math.random() - 0.5) * 2 * maxDistance;
        return { x: xOffset, y: yOffset };
    }


    spawn(type, x, y, enemyName) {
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

        this.logDropForEnemy(enemyName, type);

    }
}
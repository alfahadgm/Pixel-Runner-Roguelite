class CollectableManager {
    constructor(scene) {
        this.scene = scene;
        this.collectablesGroup = this.scene.add.group({
            classType: Collectable,
            maxSize: 500,
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

    getMultipleDropTypes() {
        // These are your common items.
        const commonItems = ['bronzeCoin', 'xplow', 'ammo'];
        
        // Randomly choose 1 to 3 different common items
        const dropCount = Math.floor(Math.random() * 3) + 1; 
        const dropTypes = [];

        for (let i = 0; i < dropCount; i++) {
            const randomIndex = Math.floor(Math.random() * commonItems.length);
            dropTypes.push(commonItems[randomIndex]);
            
            // Remove the chosen item so it isn't selected again
            commonItems.splice(randomIndex, 1);
        }

        return dropTypes;
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

    spawnRandom(x, y) {
        const type = this.getRandomType();
        
        // If it's a common type, there's a chance to spawn multiple types of common items.
        if (['bronzeCoin', 'xplow', 'ammo'].includes(type)) {
            const dropTypes = this.getMultipleDropTypes();
            for (const dropType of dropTypes) {
                const offset = this.getRandomOffset(20);
                this.spawn(dropType, x + offset.x, y + offset.y);
            }
        } else {
            this.spawn(type, x, y);
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

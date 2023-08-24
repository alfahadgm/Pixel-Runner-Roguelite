
class Chunk {
    constructor(scene, x, y) {
        this.initialize(scene, x, y);
    }

    initialize(scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        if (!this.tiles) {
            this.tiles = this.scene.add.group();
        } else {
            this.clearTiles();
        }
        this.isLoaded = false;
        
    }

    clearTiles() {
        this.tiles.clear(true, true);
        this.isLoaded = false;
    }

    unload() {
        if (this.isLoaded) {
            this.tiles.getChildren().forEach(tile => {
                this.scene.spritePool.returnSprite(tile); 
            });
            this.tiles.clear(false, false);  // Set destroy parameter to false to avoid destroying the sprite.
            Chunk.chunkPool.push(this); 
            this.isLoaded = false;
            
        }
    }
    unloadFromMemory() {
        // Modified this method to return sprites to the pool
        if (this.isLoaded) {
            this.tiles.getChildren().forEach(tile => {
                this.scene.spritePool.returnSprite(tile);
            });
            this.tiles.clear(true, true); // Clearing the children and destroying them
            this.isLoaded = false;
            
        }
    }

    getTileProperties(perlinValue, x, y) {
        let key = "";
        let animationKey = "";

        // Increase this value to make water spots less frequent
        const waterFrequencyThreshold = 0.15;

        const distanceFromCenter = Math.sqrt((x - this.scene.chunkSize/2) ** 2 + (y - this.scene.chunkSize/2) ** 2);
        const normalizedDistance = distanceFromCenter / (this.scene.chunkSize / 2);

        // The following condition ensures that water forms in circular areas
        if (normalizedDistance < 0.5 && perlinValue < waterFrequencyThreshold) {
            key = "sprWater";
            animationKey = "sprWater";
        } else if (perlinValue >= waterFrequencyThreshold && perlinValue < 0.5) {
            key = "sprSand";
        } else {
            key = "sprGrass";
        }

        return { key, animationKey };
    }

    load() {
        if (!this.isLoaded) {
            const baseTileX = this.x * this.scene.chunkSize * this.scene.tileSize;
            const baseTileY = this.y * this.scene.chunkSize * this.scene.tileSize;

            const chunkPoolExists = this.scene.chunkPool && this.scene.chunkPool.length > 0;
            if (chunkPoolExists) {
                const pooledChunk = this.scene.chunkPool.pop();
                this.tiles = pooledChunk.tiles;
                this.clearTiles();
            }

            for (let x = 0; x < this.scene.chunkSize; x++) {
                for (let y = 0; y < this.scene.chunkSize; y++) {
                    const tileX = Math.round(baseTileX + (x * this.scene.tileSize));
                    const tileY = Math.round(baseTileY + (y * this.scene.tileSize));
    
                    // Adjust the division value to make water spots bigger. Higher values create bigger spots.
                    const perlinValue = noise.perlin2(tileX / 150, tileY / 150);
                    const { key, animationKey } = this.getTileProperties(perlinValue, x, y);
                    // Using sprite pool
                    const tile = this.scene.spritePool.getSprite(tileX, tileY, key);
                    tile.setOrigin(0, 0);  // Ensure all tiles have origin set to top-left corner.
                    
                    if (animationKey !== "") {
                        tile.play(animationKey);
                    }

                    this.tiles.add(tile);
                }
            }
            this.isLoaded = true;
        }
    }
}

Chunk.chunkPool = [];

class Tile extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, key) {
        super(scene, x, y, key);  // Ensure that the Phaser sprite constructor is correctly passed all required parameters.
        this.scene.add.existing(this);
        this.setOrigin(0);
    }
}
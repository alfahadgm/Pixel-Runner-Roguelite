

const MAX_LOADED_CHUNKS = 100;
const LOAD_RADIUS = 4;
const UNLOAD_THRESHOLD = 6;

class ChunkManager {
    constructor(scene) {
        this.scene = scene;
        this.chunks = new Map();
        this.loadedChunkCount = 0;
        this.scene.spritePool = new SpritePool(this.scene);  
    }

    getChunkKey(x, y) {
        return `${x},${y}`;
    }

    getChunk(x, y) {
        const key = this.getChunkKey(x, y);
        return this.chunks.get(key);
    }

    squaredDistance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return dx * dx + dy * dy;
    }

    update(hero) {
        const { chunkSize, tileSize } = this.scene;
        const snappedChunkX = Math.floor(hero.x / (chunkSize * tileSize));
        const snappedChunkY = Math.floor(hero.y / (chunkSize * tileSize));

        this.generateChunks(snappedChunkX, snappedChunkY);
        this.handleChunkLoading(snappedChunkX, snappedChunkY);
        this.removeFarAwayChunks(snappedChunkX, snappedChunkY);
    }

    generateChunks(snappedChunkX, snappedChunkY) {
        for (let x = snappedChunkX - LOAD_RADIUS; x <= snappedChunkX + LOAD_RADIUS; x++) {
            for (let y = snappedChunkY - LOAD_RADIUS; y <= snappedChunkY + LOAD_RADIUS; y++) {
                const chunk = this.getChunk(x, y);
                if (!chunk && this.loadedChunkCount < MAX_LOADED_CHUNKS) {
                    const newChunk = new Chunk(this.scene, x, y);
                    this.chunks.set(this.getChunkKey(x, y), newChunk);
                }
            }
        }
    }

    handleChunkLoading(snappedChunkX, snappedChunkY) {
        const squaredLoadRadius = LOAD_RADIUS * LOAD_RADIUS;
        const thresholdSquared = UNLOAD_THRESHOLD * UNLOAD_THRESHOLD;
        for (const [key, chunk] of this.chunks) {
            const distanceSquared = this.squaredDistance(snappedChunkX, snappedChunkY, chunk.x, chunk.y);
            if (distanceSquared <= squaredLoadRadius && !chunk.isLoaded) {
                chunk.load();
            } else if (distanceSquared > thresholdSquared && chunk.isLoaded) {  // Modified this line
                chunk.unload();
            }
        }
    }

    removeFarAwayChunks(snappedChunkX, snappedChunkY) {
        const thresholdSquared = UNLOAD_THRESHOLD * UNLOAD_THRESHOLD;
        for (const [key, chunk] of this.chunks.entries()) {
            const distanceSquared = this.squaredDistance(snappedChunkX, snappedChunkY, chunk.x, chunk.y);
            if (distanceSquared > thresholdSquared) {
                chunk.unloadFromMemory();
                this.chunks.delete(key);
            }
        }
    }
}


class SpritePool {
    constructor(scene) {
        this.scene = scene;
        this.pool = [];
    }

    getSprite(x, y, key) {
        let sprite;
        if (this.pool.length > 0) {
            sprite = this.pool.pop();
            if (sprite.scene && sprite.setTexture) {  // Ensure sprite is still associated with a scene and is valid.
                sprite.setTexture(key);
                sprite.setPosition(x, y);
            } else {
                sprite = new Tile(this.scene, x, y, key);
            }
        } else {
            sprite = new Tile(this.scene, x, y, key);
        }
        return sprite;
    }

    returnSprite(sprite) {
        this.resetSprite(sprite);
        this.pool.push(sprite);
    }

    resetSprite(sprite) {
        sprite.setAlpha(1);
        sprite.setScale(1);
        sprite.setAngle(0);
        sprite.setOrigin(0.5);
        // Any other properties you'd like to reset
    }
}
class Debugger {
    constructor(scene, hero, chunkManager) {
        this.scene = scene;
        this.hero = hero;
        this.chunkManager = chunkManager;
    }

    logPlayerPosition() {
        console.log(`Player Position: x=${this.hero.x}, y=${this.hero.y}`);
    }

    logChunksInfo() {
        let loadedChunks = 0;
        let unloadedChunks = 0;
        for (const [key, chunk] of this.chunkManager.chunks.entries()) {
            if (chunk.isLoaded) {
                loadedChunks++;
            } else {
                unloadedChunks++;
            }
        }
        console.log(`Total Chunks: ${this.chunkManager.chunks.size}`);
        console.log(`Loaded Chunks: ${loadedChunks}`);
        console.log(`Unloaded Chunks: ${unloadedChunks}`);
        console.log(`Max Allowed Loaded Chunks: ${MAX_LOADED_CHUNKS}`);
    }

    logSpritePoolInfo() {
        console.log(`Sprites in Pool: ${this.scene.spritePool.pool.length}`);
    }

    logCurrentChunk() {
        const { chunkSize, tileSize } = this.scene;
        const currentChunkX = Math.floor(this.hero.x / (chunkSize * tileSize));
        const currentChunkY = Math.floor(this.hero.y / (chunkSize * tileSize));
        console.log(`Current Chunk: x=${currentChunkX}, y=${currentChunkY}`);
    }

    executeFullReport() {
        console.group('Debugger Report:');
        this.logPlayerPosition();
        this.logChunksInfo();
        this.logSpritePoolInfo();
        this.logCurrentChunk();
        console.groupEnd();
    }
}
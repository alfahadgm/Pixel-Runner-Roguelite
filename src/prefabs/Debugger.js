class Debugger {
    constructor(scene, hero, chunkManager) {
        this.scene = scene;
        this.hero = hero;
        this.chunkManager = chunkManager;
    }

    logPlayerPosition() {
        
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
        
        
        
        
    }

    logSpritePoolInfo() {
        
    }

    logCurrentChunk() {
        const { chunkSize, tileSize } = this.scene;
        const currentChunkX = Math.floor(this.hero.x / (chunkSize * tileSize));
        const currentChunkY = Math.floor(this.hero.y / (chunkSize * tileSize));
        
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
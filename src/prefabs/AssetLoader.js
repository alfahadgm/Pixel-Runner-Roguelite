
class AssetLoader {

    constructor(scene) {
        this.scene = scene;
        this.assetPath = './assets/';
    }

    setPath(path = this.assetPath) {
        this.scene.load.setPath(path);
    }

    loadSprites() {
        // Load hero sprites
        this.loadSpriteSheet('hero', 'hero-sheet.png', { frameWidth: 32, frameHeight: 32 });
        this.loadSpriteSheet('meleeSprite', 'hero-sheet.png', { frameWidth: 32, frameHeight: 32 });
        this.loadSpriteSheet('rangedSprite', 'hero-sheet.png', { frameWidth: 32, frameHeight: 32 });
        this.loadSpriteSheet('armoredSprite', 'hero-sheet.png', { frameWidth: 32, frameHeight: 32 });

        // Load environment sprites
        this.loadSpriteSheet("sprWater", "Map/sprWater.png", { frameWidth: 16, frameHeight: 16 });
        this.loadImage("sprSand", "Map/sprSand.png");
        this.loadImage("sprGrass", "Map/sprGrass.png");

        // Load additional sprites
        this.loadImage("bullet", "bullet.png");

    }

    loadSpriteSheet(key, path, frameConfig) {
        this.scene.load.spritesheet(key, path, frameConfig);
    }

    loadImage(key, path) {
        this.scene.load.image(key, path);
    }

    createHeroAnimations() {
        [...this.generateHeroFrames(), ...this.generateHeroSwingFrames()]
            .filter(anim => anim && anim.key)
            .forEach(anim => this.scene.anims.create(anim));
    }

    generateHeroFrames() {
        return ['down', 'right', 'up', 'left'].map((direction, index) => ({
            key: `walk-${direction}`,
            frameRate: 8,
            repeat: -1,
            frames: this.scene.anims.generateFrameNumbers('hero', { start: index * 4, end: (index + 1) * 4 - 1 }),
        }));
    }

    generateHeroSwingFrames() {
        return ['down', 'up', 'right', 'left'].map((direction, index) => ({
            key: `swing-${direction}`,
            frameRate: 8,
            repeat: 0,
            frames: this.scene.anims.generateFrameNumbers('hero', { start: 16 + index * 4, end: 19 + index * 4 }),
        }));
    }

    createWaterAnimations() {
        this.scene.anims.create({
            key: "sprWater",
            frames: this.scene.anims.generateFrameNumbers("sprWater"),
            frameRate: 5,
            repeat: -1
        });
    }

    createAllAnimations() {
        this.createHeroAnimations();
        this.createWaterAnimations();
    }
}
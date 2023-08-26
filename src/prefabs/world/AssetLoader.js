
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
        this.loadSpriteSheet('skeleton', 'skeleton-sheet.png', { frameWidth: 32, frameHeight: 32 });
        this.loadSpriteSheet('bat', 'bat-sheet.png', { frameWidth: 32, frameHeight: 32 });
        this.loadSpriteSheet('meleeSprite', 'hero-sheet.png', { frameWidth: 32, frameHeight: 32 });
        this.loadSpriteSheet('rangedSprite', 'hero-sheet.png', { frameWidth: 32, frameHeight: 32 });
        this.loadSpriteSheet('armoredSprite', 'hero-sheet.png', { frameWidth: 32, frameHeight: 32 });

        // Load environment sprites
        this.loadSpriteSheet('sprWater', 'Map/sprWater.png', { frameWidth: 16, frameHeight: 16 });
        this.loadImage('sprSand', 'Map/sprSand.png');
        this.loadImage('sprGrass', 'Map/sprGrass.png');
        
        // Load bullets sprites
        this.loadImage('firearmBullet', 'bullet.png');
        this.loadSpriteSheet('energyBullet', 'plasmaRifle.png', { frameWidth: 16, frameHeight: 16 });

        // Load collectables sprites
        this.loadSpriteSheet('gold-coin', 'collectables/gold-coin.png', { frameWidth: 16, frameHeight: 14 });
        this.loadSpriteSheet('silver-coin', 'collectables/silver-coin.png', { frameWidth: 16, frameHeight: 14 });
        this.loadSpriteSheet('bronze-coin', 'collectables/bronze-coin.png', { frameWidth: 16, frameHeight: 14 });
        this.loadSpriteSheet('heart', 'collectables/heart.png', { frameWidth: 16, frameHeight: 13 });
        this.loadSpriteSheet('heart-max', 'collectables/heart-max.png', { frameWidth: 16, frameHeight: 13 });
        this.loadImage('xporb-low', 'collectables/xporb1.png');
        this.loadImage('xporb-mid', 'collectables/xporb2.png');
        this.loadImage('xporb-high', 'collectables/xporb3.png');
        this.loadImage('ammo', 'collectables/ammo.png');
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
            key: 'sprWater',
            frames: this.scene.anims.generateFrameNumbers('sprWater'),
            frameRate: 5,
            repeat: -1
        });
    }

    pauseAllAnimations() {
        this.scene.anims.pauseAll();
    }
    
    resumeAllAnimations() {
        this.scene.anims.resumeAll();
    }

    enemySpriteSheets(){

        /*----------- SKELETON-------------- */
        // Animation for skeleton walking down
        this.scene.anims.create({
            key: 'skeleton-walk-down',
            frames: this.scene.anims.generateFrameNumbers('skeleton', { frames: [12, 13, 14, 15] }),
            frameRate: 8,
            repeat: -1
        });

        // Animation for skeleton walking right
        this.scene.anims.create({
            key: 'skeleton-walk-right',
            frames: this.scene.anims.generateFrameNumbers('skeleton', { frames: [16, 17, 18, 19] }),
            frameRate: 8,
            repeat: -1
        });

        // Animation for skeleton walking up
        this.scene.anims.create({
            key: 'skeleton-walk-up',
            frames: this.scene.anims.generateFrameNumbers('skeleton', { frames: [20, 21, 22, 23] }),
            frameRate: 8,
            repeat: -1
        });

                /*----------- BAT-------------- */


        // Animation for skeleton walking right
        this.scene.anims.create({
            key: 'bat-walk-right',
            frames: this.scene.anims.generateFrameNumbers('bat', { frames: [0, 1, 2, 3] }),
            frameRate: 8,
            repeat: -1
        });
     }

     collectablesSpriteSheets(){


        /*----------- GoldCoin-------------- */
        this.scene.anims.create({
            key: 'gold-coin-rotate',
            frames: this.scene.anims.generateFrameNumbers('gold-coin', { frames: [0, 1, 2, 3, 4, 5] }),
            frameRate: 8,
            repeat: -1
        });

        /*----------- SilverCoin-------------- */
        this.scene.anims.create({
            key: 'silver-coin-rotate',
            frames: this.scene.anims.generateFrameNumbers('silver-coin', { frames: [0, 1, 2, 3, 4, 5] }),
            frameRate: 8,
            repeat: -1
        });

        /*----------- BronzeCoin-------------- */
        this.scene.anims.create({
            key: 'bronze-coin-rotate',
            frames: this.scene.anims.generateFrameNumbers('bronze-coin', { frames: [0, 1, 2, 3, 4, 5] }),
            frameRate: 8,
            repeat: -1
        });

        /*----------- Heart-------------- */
        this.scene.anims.create({
            key: 'heart-rotate',
            frames: this.scene.anims.generateFrameNumbers('heart', { frames: [0, 1, 2, 3, 4] }),
            frameRate: 8,
            repeat: -1
        });

        /*----------- HeartMaxHealth-------------- */
        this.scene.anims.create({
            key: 'heart-max-rotate',
            frames: this.scene.anims.generateFrameNumbers('heart-max', { frames: [0, 1, 2, 3, 4] }),
            frameRate: 8,
            repeat: -1
        });

     }

    createAllAnimations() {
        this.createHeroAnimations();
        this.enemySpriteSheets();
        this.createWaterAnimations();
        this.collectablesSpriteSheets();    
    }

}
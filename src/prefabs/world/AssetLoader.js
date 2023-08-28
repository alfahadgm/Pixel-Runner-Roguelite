
class AssetLoader {

    constructor(scene) {
        this.scene = scene;
        this.assetPath = './assets/';
        this.musicVolume = 1;
        this.musicFadeVolume = 0;
    }

    setPath(path = this.assetPath) {
        this.scene.load.setPath(path);
    }

    loadSprites() {
        // Load hero / enemy sprites
        this.loadSpriteSheet('hero', 'hero-sheet.png', { frameWidth: 32, frameHeight: 32 });
        this.loadSpriteSheet('skeleton', 'enemy/normal/skeleton.png', { frameWidth: 32, frameHeight: 32 });
        this.loadSpriteSheet('bat', 'enemy/normal/bat.png', { frameWidth: 32, frameHeight: 32 });
        this.loadSpriteSheet('bee', 'enemy/normal/bee.png', { frameWidth: 32, frameHeight: 32 });
        this.loadSpriteSheet('big_worm', 'enemy/normal/big_worm.png', { frameWidth: 35, frameHeight: 50 });
        this.loadSpriteSheet('eyeball', 'enemy/normal/eyeball.png', { frameWidth: 32, frameHeight: 38 });
        this.loadSpriteSheet('ghost', 'enemy/normal/ghost.png', { frameWidth: 40, frameHeight: 46 });
        this.loadSpriteSheet('flower', 'enemy/normal/flower.png', { frameWidth: 60, frameHeight: 76 });
        this.loadSpriteSheet('pumpking', 'enemy/normal/pumpking.png', { frameWidth: 46, frameHeight: 46 });
        this.loadSpriteSheet('slime', 'enemy/normal/slime.png', { frameWidth: 32, frameHeight: 32 });
        this.loadSpriteSheet('small_worm', 'enemy/normal/small_worm.png', { frameWidth: 32, frameHeight: 32 });
        this.loadSpriteSheet('snake', 'enemy/normal/snake.png', { frameWidth: 32, frameHeight: 32 });
     //   this.loadSpriteSheet('meleeSprite', 'hero-sheet.png', { frameWidth: 32, frameHeight: 32 });
     //   this.loadSpriteSheet('rangedSprite', 'hero-sheet.png', { frameWidth: 32, frameHeight: 32 });
     //   this.loadSpriteSheet('armoredSprite', 'hero-sheet.png', { frameWidth: 32, frameHeight: 32 });

        // Load environment sprites
        this.loadSpriteSheet('sprWater', 'Map/sprWater.png', { frameWidth: 16, frameHeight: 16 });
        this.loadImage('sprSand', 'Map/sprSand.png');
        this.loadImage('sprGrass', 'Map/sprGrass.png');
        
        // Load bullets and projectiles sprites
        this.loadImage('beeP', 'enemy/projectiles/beeProjectile.png');
        this.loadImage('eyeballP', 'enemy/projectiles/eyeballProjectile.png');
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

        //Numbers
        this.loadSpriteSheet('yellowNumbers', 'numbers/yellow.png', { frameWidth: 6, frameHeight: 8 });
        this.loadSpriteSheet('blueNumbers', 'numbers/blue.png', { frameWidth: 6, frameHeight: 8 });
        this.loadSpriteSheet('greenNumbers', 'numbers/yellow.png', { frameWidth: 6, frameHeight: 8 });
        this.loadSpriteSheet('greyNumbers', 'numbers/yellow.png', { frameWidth: 6, frameHeight: 8 });
        this.loadSpriteSheet('redNumbers', 'numbers/yellow.png', { frameWidth: 6, frameHeight: 8 });


        //Sounds
        this.scene.load.audio('music', [ 'sound/music.ogg', 'sound/music.mp3' ]);
        this.scene.load.audio('musicFade', [ 'sound/music-fade.ogg', 'sound/music-fade.mp3' ]);
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

    audio(){
       this.music = this.scene.sound.add('music');
       // music.on('volume', listener);
       this.music.play({
            loop: true
        });
       // music.setVolume(this.musicVolume);

       this.musicFade = this.scene.sound.add('musicFade');
       // musicFade.on('volume', listener);
       this.musicFade.play({
            loop: true
        });
       // musicFade.setVolume(this.musicFadeVolume);
    }

    updateAudio(){
        this.music.setVolume(this.musicVolume*0.1);
        this.musicFade.setVolume(this.musicFadeVolume*0.5);
    }

    colorsSpriteSheets(){
        const colors = ['yellow', 'blue', 'green', 'grey', 'red'];
    
        colors.forEach(color => {
            for (let i = 0; i <= 9; i++) {
                this.scene.anims.create({
                    key: `${color}-number-${i}`,
                    frames: [{ key: `${color}Numbers`, frame: i }],
                    frameRate: 10,
                    repeat: 0 // no repeat since it's a single frame
                });
            }
        });
    }

    enemySpriteSheets(){

        /*----------- SKELETON-------------- */
        // SKELETON IS SPECIAL CASE BECAUSE OF SHEET DIFFRENCE
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


        const enemies = ['bat', 'bee', 'big_worm', 'eyeball', 'ghost', 'flower', 'pumpking', 'slime', 'small_worm', 'snake'];

        // Load spritesheets for each enemy
        enemies.forEach(enemy => {
            this.loadSpriteSheet(enemy, `enemy/normal/${enemy}.png`, { frameWidth: 32, frameHeight: 32 });
        });
        
        // Create animations for each enemy
        const animationDetails = [
            { keySuffix: 'walk-up', frames: [0, 1, 2] },
            { keySuffix: 'walk-down', frames: [6, 7, 8] },
            { keySuffix: 'walk-right', frames: [9, 10, 11] }
        ];
        
        enemies.forEach(enemy => {
            animationDetails.forEach(detail => {
                this.scene.anims.create({
                    key: `${enemy}-${detail.keySuffix}`,
                    frames: this.scene.anims.generateFrameNumbers(enemy, { frames: detail.frames }),
                    frameRate: 8,
                    repeat: -1
                });
            });
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
        this.colorsSpriteSheets();
        this.collectablesSpriteSheets();  
        this.audio();  
    }

}
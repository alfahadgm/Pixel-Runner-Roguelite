
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

    musicControl(musicVolume, musicFadeVolume){
        
        this.musicVolume = musicVolume;
        this.musicFadeVolume = musicFadeVolume;
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
        this.loadImage('spore', 'spore.png');
        
        // Load bullets and projectiles sprites
        this.loadImage('beeP', 'enemy/projectiles/beeProjectile.png');
        this.loadImage('eyeballP', 'enemy/projectiles/eyeballProjectile.png');
        this.loadImage('firearmBullet', 'bullet.png');
        this.loadImage('worm_projectile', 'enemy/projectiles/worm_projectile.png');
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

        //Numbers / UI
        this.loadSpriteSheet('yellowNumbers', 'numbers/yellow.png', { frameWidth: 6, frameHeight: 8 });
        this.loadSpriteSheet('blueNumbers', 'numbers/blue.png', { frameWidth: 6, frameHeight: 8 });
        this.loadSpriteSheet('greenNumbers', 'numbers/yellow.png', { frameWidth: 6, frameHeight: 8 });
        this.loadSpriteSheet('greyNumbers', 'numbers/yellow.png', { frameWidth: 6, frameHeight: 8 });
        this.loadSpriteSheet('redNumbers', 'numbers/yellow.png', { frameWidth: 6, frameHeight: 8 });
        
        this.loadImage('ammo', 'collectables/ammo.png');
        this.scene.load.atlas('ui', 'nine-slice.png', '../lib/nine-slice.json');

        //Sounds
        this.scene.load.audio('music', [ 'sound/music.ogg', 'sound/music.mp3' ]);
        this.scene.load.audio('musicFade', [ 'sound/music-fade.ogg', 'sound/music-fade.mp3' ]);
        this.scene.load.audio('xp', [ 'sound/xp.ogg', 'sound/xp.mp3' ]);
        this.scene.load.audio('health', [ 'sound/health.ogg', 'sound/health.mp3' ]);
        this.scene.load.audio('hit', [ 'sound/hit.ogg', 'sound/hit.mp3' ]);
        this.scene.load.audio('crit', [ 'sound/crit.ogg', 'sound/crit.mp3' ]);
        this.scene.load.audio('dash', [ 'sound/dash.ogg', 'sound/dash.mp3' ]);
        this.scene.load.audio('upgrade', [ 'sound/upgrade.ogg', 'sound/upgrade.mp3' ]);
        this.scene.load.audio('shoot', [ 'sound/shoot.ogg', 'sound/shoot.mp3' ]);
        this.scene.load.audio('levelup', [ 'sound/levelup.ogg', 'sound/levelup.mp3' ]);

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
       this.music.setVolume(this.musicVolume*0.1);
       this.music.play({
            loop: true
        });

       this.musicFade = this.scene.sound.add('musicFade');
       this.musicFade.setVolume(this.musicFadeVolume*0.5);
       this.musicFade.play({
            loop: true
        });

        this.xp = this.scene.sound.add('xp');
        this.xp.setVolume(0.1);
        this.health = this.scene.sound.add('health');
        this.health.setVolume(0.1);
        this.hit = this.scene.sound.add('hit');
        this.hit.setVolume(0.1);
        this.crit = this.scene.sound.add('crit');
        this.crit.setVolume(0.1);
        this.shoot = this.scene.sound.add('shoot');
        this.shoot.setVolume(0.1);
        this.upgrade = this.scene.sound.add('upgrade');
        this.upgrade.setVolume(0.1);
        this.levelup = this.scene.sound.add('levelup');
        this.levelup.setVolume(0.3);
        this.dash = this.scene.sound.add('dash');
        this.dash.setVolume(0.3);
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

    destroy() {
        // Stop and destroy any sounds.
        const sounds = ['music', 'musicFade', 'xp', 'health', 'hit', 'crit', 'shoot', 'upgrade', 'levelup', 'dash'];
        sounds.forEach(soundKey => {
            if (this[soundKey]) {
                this[soundKey].stop();
                this[soundKey].destroy();
                this[soundKey] = null;
            }
        });
    
        // Clear references
        this.scene = null;
        this.assetPath = null;
        this.musicVolume = null;
        this.musicFadeVolume = null;
    }

}
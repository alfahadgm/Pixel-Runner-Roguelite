class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene");

        // Paths and Sizes
        this.assetPath = './assets/';
        this.chunkSize = 16;
        this.tileSize = 16;

        // State Variables
        this.totalTime = 0;
        this.isGamePaused = false;
        this.enemyOnCooldown = false;
        this.heroIsTouchingenemy = false;
        this.heroIsInvincible = false;

        // Class Instances
        this.chunkManager = new ChunkManager(this);
        this.assetLoader = new AssetLoader(this);

        // Misc
        this.cameraLerpFactor = 0.1;
    }

    preload() {
        this.assetLoader.setPath(this.assetPath);
        this.assetLoader.loadSprites();
    }

    create() {
        this.initWorldView();
        this.initEntities();
        this.initPhysics();
        this.initCamera();
        this.initHeroFSM();
        this.initKeyboardControls();
    }

    initEntities() {
        this.hero = new Hero(this, this.followPoint.x, this.followPoint.y, 'hero', 0, 'down').setDepth(2);
        this.collectableManager = new CollectableManager(this);
        this.enemyManager = new EnemyManager(this);
        this.ui = new UI(this, this.hero);
        this.utils = new Utils(this);
        this.upgrades = new Upgrades(this, this.hero);
    }

    initPhysics() {
        this.physics.add.overlap(this.hero, this.enemyManager.enemies, this.EnemyhitHero, null, this);
        this.physics.add.overlap(this.hero, this.collectableManager.collectablesGroup, this.collect, null, this);
        this.physics.add.collider(this.enemyManager.enemies, this.enemyManager.enemies, null, null, this);
    }

    initCamera() {
        this.cameras.main.startFollow(this.hero, true, this.cameraLerpFactor, this.cameraLerpFactor);
    }

    initHeroFSM() {
        this.heroFSM = this.createHeroFSM();
        this.assetLoader.createAllAnimations();
    }

    collect(collectable) {
        collectable.activate();
    }


    displayDamageText(x, y, damage, isCritical) {
        damage = Math.round(damage); // Round to nearest whole number

        const color = isCritical ? 'red' : 'grey'; // Choosing sprite sheet based on critical hit
    
        // Convert damage to array of digits
        const digits = Array.from(String(damage), Number).map(digit => (digit === 0) ? 9 : digit - 1);
        
        const spacing = 6; // Assuming each digit sprite has a width of 6
        const startx = x - (spacing * digits.length) / 2; // Start position for centering the numbers
    
        digits.forEach((digit, index) => {
            const numberSprite = this.add.sprite(startx + index * spacing, y, `${color}Numbers`, digit).setOrigin(0.5, 0.5);
            numberSprite.setDepth(3);
    
            // Animate the sprite: Move upwards while fading out over 0.5 seconds
            this.tweens.add({
                targets: numberSprite,
                y: y - 50,     // Move 50 pixels up
                alpha: 0,      // Fade out
                duration: 500, // 0.5 seconds
                onComplete: () => {
                    numberSprite.destroy();
                }
            });
        });
    }
    
    
    // In your main scene class
    displayCollectableText(x, y, text) {
        const style = { color: 'yellow', fontSize: '16px' };
        const collectableText = this.add.text(x, y, text, style).setOrigin(0.5, 0.5); // Centering the text
        collectableText.setDepth(3);

        // Animate the text: Move upwards while fading out over 0.5 seconds
        this.tweens.add({
            targets: collectableText,
            y: y - 50,     // Move 50 pixels up
            alpha: 0,      // Fade out
            duration: 500, // 0.5 seconds
            onComplete: () => {
                collectableText.destroy();
            }
        });
    }



    EnemyhitHero(hero, enemy) {
        // Only proceed if the enemy is not on a cooldown and the hero isn't already tinted.
        if (!this.heroIsInvincible && !this.enemyOnCooldown && !this.heroIsTouchingenemy) {
    
            // Apply damage logic here
            hero.heroStats.getDamage(enemy.damage);
            // Tint the hero red to indicate damage taken.
            hero.setTint(0xFF0000);
    
            // Flag that the hero is currently touching the enemy
            this.heroIsTouchingenemy = true;
    
            // Put the enemy on a cooldown so it can't deal damage constantly.
            this.enemyOnCooldown = true;
    
            // Reset the hero tint after half a second (100 milliseconds).
            this.time.addEvent({
                delay: 100,
                callback: () => {
                    hero.clearTint();
                    this.heroIsTouchingenemy = false;
                },
                callbackScope: this
            });
    
            // Reset the enemy's cooldown after a specified time (1 second).
            this.time.addEvent({
                delay: 1000,
                callback: () => {
                    this.enemyOnCooldown = false;
                },
                callbackScope: this
            });
        }
    }
    
    dashHero() {
        // Check if the hero can dash
        if (this.hero.heroStats.canDash) {
            this.heroIsInvincible = true;
    
            // After 1.5 seconds, the hero is no longer invincible.
            this.time.addEvent({
                delay: 1500,
                callback: () => {
                    this.heroIsInvincible = false;
                },
                callbackScope: this
            });
    
            // Set the canDash flag to false so the hero can't dash immediately again
            this.hero.heroStats.canDash = false;
    
            // After 5 seconds, reset the canDash flag so the hero can dash again
            this.time.addEvent({
                delay: this.hero.heroStats.dashCooldown,
                callback: () => {
                    this.hero.heroStats.canDash = true;
                },
                callbackScope: this
            });
        }
    }
    

    initWorldView() {
        const centerOffsetX = (this.chunkSize * this.tileSize) / 2;
        const centerOffsetY = (this.chunkSize * this.tileSize) / 2;

        this.followPoint = new Phaser.Math.Vector2(centerOffsetX, centerOffsetY);
    }

    createHeroFSM() {
        let fsm = new StateMachine('idle', {
            idle: new IdleState(),
            move: new MoveState(),
            swing: new SwingState(),
            dash: new DashState(),
            hurt: new HurtState(),
        }, [this, this.hero]);

        fsm.onStateChange = new Phaser.Events.EventEmitter();

        const originalTransition = fsm.transition.bind(fsm);
        fsm.transition = function(newState) {
            originalTransition(newState);
            this.onStateChange.emit('change', newState);
        };

        return fsm;
    }


    initKeyboardControls() {
        this.keys = this.input.keyboard.createCursorKeys();
        this.keys.HKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H);
        this.keys.KKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);
        this.keys.EnterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.keys.WKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keys.WKey.on('down', () => {
            this.hero.switchWeapon();
        });
    }
    
    update(time, delta) {

        if (this.keys.EnterKey.isDown && !this.isGameEnterKeyPressed) {
            this.isGameEnterKeyPressed = true;  // to ensure single press
            if (!this.isGamePaused) {
                this.pauseGame();
            } else {
                this.resumeGame();
            }
        } else if (this.keys.EnterKey.isUp) {
            this.isGameEnterKeyPressed = false;  // reset the key press state
        }
    
        // Prevent the rest of the update function from running if the game is paused
        if (this.isGamePaused) {
            return;
        }


        if (this.heroFSM && typeof this.heroFSM.step === 'function') {
            this.heroFSM.step();
        }

        if (this.chunkManager && typeof this.chunkManager.update === 'function') {
            this.chunkManager.update(this.hero);
        }
        if (this.keys.KKey.isDown) {
            this.executeDebuggerReport();
        }

        if (this.hero.currentWeapon && this.hero.currentWeapon.bullets) {
            this.hero.currentWeapon.bullets.getChildren().forEach(bullet => {
                if (bullet && typeof bullet.update === 'function') {

                    bullet.update();
                }
            });
        }

        this.collectableManager.collectablesGroup.getChildren().forEach(collectable => {
            collectable.update(this.hero);
        });
        this.upgrades.update()
        this.enemyManager.updateEnemies(this.hero);
        this.enemyManager.manageWaves(delta);
        this.totalTime += delta / 1000; 
        this.ui.updateTimerDisplay(); // We'll create this in the UI class
        this.ui.updateHeroUI();
        this.assetLoader.updateAudio();

    }

    executeDebuggerReport() {
        if (!this.gameDebugger) {
            this.gameDebugger = new Debugger(this, this.hero, this.chunkManager);
        }
        this.gameDebugger.executeFullReport();
    }

    pauseGame() {
        this.isGamePaused = true;
        this.physics.pause();
        this.tweens.pauseAll();
        
        // Pause the hero's weapon firing
        this.hero.pauseFiring();
    
        // Pause animations
        this.assetLoader.pauseAllAnimations();
        
        
        // ... any other game pausing code
    }
    
    resumeGame() {
        this.isGamePaused = false;
        this.physics.resume();
        this.tweens.resumeAll();
    
        // Resume the hero's weapon firing
        this.hero.resumeFiring();
    
        // Resume animations
        this.assetLoader.resumeAllAnimations();

        if (this.upgradePanel) {
            this.upgradePanel.clear(true, true);
        }
        
        if (this.weaponShopPanel) {
            this.weaponShopPanel.clear(true, true);
        }
        
        if (this.tintedBackground) {
            this.tintedBackground.visible = false;
        }
        
        this.isUpgradeMenuActive = false;
        
        // ... any other game resuming code
    }


}
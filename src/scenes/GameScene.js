
class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene");
        this.assetDirectoryPath = './assets/';
        this.chunkSize = 16;
        this.tileSize = 16;
        this.totalTime = 0;
        this.terrainChunkManager = new ChunkManager(this);
        this.assetLoader = new AssetLoader(this);
        this.gamePausedFlag = false;
        this.enemyAttackCooldownActive = false;
        this.heroInContactWithEnemy = false;
        this.heroProtected = false;
        this.cameraFollowSmoothness = 0.1;
    }

    preload() {

        this.assetLoader.setPath(this.assetDirectoryPath);
        this.assetLoader.loadSprites();
    }

    create() {
        this.utils = new Utils(this); // Make enemyManager a property of the class.
        this.utils.initWorldView();

        this.hero = new Hero(this, this.followPoint.x, this.followPoint.y, 'hero', 0, 'down').setDepth(2);
        this.collectableManager = new CollectableManager(this);
        this.enemyManager = new EnemyManager(this); // Make enemyManager a property of the class.
        this.ui = new UI(this, this.hero); // Make enemyManager a property of the class.
        this.upgrades = new Upgrades(this, this.hero); // Initialize the upgrades system
        this.physics.add.overlap(this.hero, this.enemyManager.enemies, this.EnemyhitHero, null, this);
        this.physics.add.overlap(this.hero, this.collectableManager.collectablesGroup, this.collect, null, this);
        this.physics.add.collider(this.enemyManager.enemies, this.enemyManager.enemies, null, null, this);
        // this.physics.add.collider(this.hero.currentWeapon.bullets, this.enemyManager.enemies, this.bulletHitenemy, null, this);
        this.heroFSM = this.createHeroFSM();
        this.assetLoader.createAllAnimations();
        this.cameras.main.startFollow(this.hero, true, this.cameraFollowSmoothness, this.cameraFollowSmoothness);
        this.utils.initKeyboardControls();
    }

    collect(hero, collectable) {
        collectable.activate();
    }

    EnemyhitHero(hero, enemy) {
        // Only proceed if the enemy is not on a cooldown and the hero isn't already tinted.
        if (!this.heroProtected && !this.enemyAttackCooldownActive && !this.heroInContactWithEnemy) {

            // Apply damage logic here
            hero.heroStats.getDamage(enemy.damage);
            // Tint the hero red to indicate damage taken.
            hero.setTint(0xFF0000);

            // Flag that the hero is currently touching the enemy
            this.heroInContactWithEnemy = true;

            // Put the enemy on a cooldown so it can't deal damage constantly.
            this.enemyAttackCooldownActive = true;

            // Reset the hero tint after half a second (100 milliseconds).
            this.time.addEvent({
                delay: 100,
                callback: () => {
                    hero.clearTint();
                    this.heroInContactWithEnemy = false;
                },
                callbackScope: this
            });

            // Reset the enemy's cooldown after a specified time (1 second).
            this.time.addEvent({
                delay: 1000,
                callback: () => {
                    this.enemyAttackCooldownActive = false;
                },
                callbackScope: this
            });
        }
    }

    dashHero() {
        // Check if the hero can dash
        if (this.hero.heroStats.canDash) {
            this.heroProtected = true;
            // After 1.5 seconds, the hero is no longer invincible.
            this.time.addEvent({
                delay: 1500,
                callback: () => {
                    this.heroProtected = false;
                },
                callbackScope: this
            });

            // Set the canDash flag to false so the hero can't dash immediately again
            this.hero.heroStats.canDash = false;
            this.assetLoader.dash.play({
                loop: false
            });
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
        fsm.transition = function (newState) {
            originalTransition(newState);
            this.onStateChange.emit('change', newState);
        };

        return fsm;
    }
    update(time, delta) {

        if (this.keys.EnterKey.isDown && !this.isGameEnterKeyPressed) {
            this.isGameEnterKeyPressed = true;  // to ensure single press
            if (!this.gamePausedFlag) {
                this.pauseGame();
            } else {
                this.resumeGame();
            }
        } else if (this.keys.EnterKey.isUp) {
            this.isGameEnterKeyPressed = false;  // reset the key press state
        }

        // Prevent the rest of the update function from running if the game is paused
        if (this.gamePausedFlag) {
            this.upgrades.update();
            return;
        }


        if (this.heroFSM && typeof this.heroFSM.step === 'function') {
            this.heroFSM.step();
        }

        if (this.terrainChunkManager && typeof this.terrainChunkManager.update === 'function') {
            this.terrainChunkManager.update(this.hero);
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
        // this.upgrades.update()
        this.enemyManager.updateEnemies(this.hero);
        this.enemyManager.manageWaves(delta);
        this.totalTime += delta / 1000;
        this.ui.updateTimerDisplay(); // We'll create this in the UI class
        this.ui.updateHeroUI();
        this.assetLoader.updateAudio();
        this.upgrades.update();
        this.hero.update();
    }

    executeDebuggerReport() {
        if (!this.gameDebugger) {
            this.gameDebugger = new Debugger(this, this.hero, this.terrainChunkManager);
        }
        this.gameDebugger.executeFullReport();
    }

    pauseGame() {
        this.gamePausedFlag = true;
        this.physics.pause();
        this.tweens.pauseAll();

        // Pause the hero's weapon firing
        this.hero.pauseFiring();

        // Pause animations
        this.assetLoader.pauseAllAnimations();

    }

    resumeGame() {
        this.gamePausedFlag = false;
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


        this.isUpgradeMenuActive = false;
    }


}
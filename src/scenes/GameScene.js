
class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene");
        this.assetPath = './assets/';
        this.chunkSize = 16;
        this.tileSize = 16;
        this.totalTime = 0; 
        this.chunkManager = new ChunkManager(this);
        this.assetLoader = new AssetLoader(this);
        this.cameraLerpFactor = 0.1;  
    }

    preload() {
        this.assetLoader.setPath(this.assetPath);
        if (this.assetLoader && typeof this.assetLoader.loadSprites === 'function') {
            this.assetLoader.loadSprites();
        } else {
            console.error("AssetLoader not properly initialized or loadSprites method not found.");
        }
    }

    create() {
        this.initWorldView();
        this.hero = new Hero(this, this.followPoint.x, this.followPoint.y, 'hero', 0, 'down').setDepth(2);
        
        this.enemyManager = new EnemyManager(this); // Make enemyManager a property of the class.
        this.ui = new UI(this); // Make enemyManager a property of the class.
        this.utils = new Utils(this); // Make enemyManager a property of the class.
        // Check for collisions between bullet and enemy
        this.physics.add.overlap(this.hero, this.enemyManager.enemies, this.heroHitenemy, null, this);
        this.physics.add.collider(this.enemyManager.enemies, this.enemyManager.enemies, null, null, this);


       // this.physics.add.collider(this.hero.currentWeapon.bullets, this.enemyManager.enemies, this.bulletHitenemy, null, this);
        this.heroFSM = this.createHeroFSM();
        this.assetLoader.createAllAnimations();
        this.initKeyboardControls();
        this.cameras.main.startFollow(this.hero, true, this.cameraLerpFactor, this.cameraLerpFactor);
    }

    bulletHitenemy(bullet, enemy) {
        const damage = bullet.weaponStats.getDamage(); // Ensure your weaponStats has a method getDamage()
        enemy.decreaseHealth(damage);
        this.scene.displayDamageText(enemy.x, enemy.y, damage, bullet.weaponStats.isCriticalHit);
        bullet.destroyBullet(); // Using the bullet's destroyBullet method
    }

    displayDamageText(x, y, damage, isCritical) {
        const style = isCritical ? { color: 'red', fontSize: '16px' } : { color: 'white', fontSize: '16px' };
        const damageText = this.add.text(x, y, `${damage}`, style).setOrigin(0.5, 0.5); // Centering the text
        damageText.setDepth(10)
        // Animate the text: Move upwards while fading out over 0.5 seconds
        this.tweens.add({
            targets: damageText,
            y: y - 50,     // Move 50 pixels up
            alpha: 0,      // Fade out
            duration: 500, // 0.5 seconds
            onComplete: () => {
                damageText.destroy();
            }
        });
    }

    findNearestEnemy(hero) {
        let nearestEnemy = null;
        let nearestDistance = Infinity;
    
        this.enemyManager.enemies.getChildren().forEach(enemy => {
            const distance = Phaser.Math.Distance.Between(hero.x, hero.y, enemy.x, enemy.y);
            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearestEnemy = enemy;
            }
        });
    
        return nearestEnemy;
    }

    heroHitenemy(hero, enemy) {
        
        if(this.heroFSM.state != 'dash') {
            hero.setTint(0xFF0000);
            this.heroIsTouchingenemy = true;
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

        this.keys.WKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keys.WKey.on('down', () => {
            this.hero.switchWeapon();
        });
    }
    
    update(time, delta) {
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

        this.enemyManager.updateEnemies(this.hero);
        this.enemyManager.manageWaves(delta)
        this.totalTime += delta / 1000; 
        this.ui.updateTimerDisplay(); // We'll create this in the UI class

     
      

    }

    executeDebuggerReport() {
        if (!this.gameDebugger) {
            this.gameDebugger = new Debugger(this, this.hero, this.chunkManager);
        }
        this.gameDebugger.executeFullReport();
    }
}
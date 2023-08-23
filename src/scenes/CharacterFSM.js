
//CharacterFSM.js
class CharacterFSM extends Phaser.Scene {
    constructor() {
        super("characterFSMScene");
        this.assetPath = './assets/';
        this.chunkSize = 16;
        this.tileSize = 16;
        this.chunkManager = new ChunkManager(this);
        this.assetLoader = new AssetLoader(this);
        this.cameraLerpFactor = 0.1;  // Factor to adjust camera smoothness. Closer to 1 is faster, closer to 0 is slower.
        this.lastBulletFired = 0;
        this.bulletCooldown = 500; // Delay in ms between bullet fires

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
        this.heroFSM = this.createHeroFSM();
        this.assetLoader.createAllAnimations();
        this.initKeyboardControls();
        this.cameras.main.startFollow(this.hero, true, this.cameraLerpFactor, this.cameraLerpFactor);
        this.bullets = this.add.group({
            classType: Bullet,
            removeCallback: (bullet) => bullet.scene.sys.updateList.remove(bullet)
        });
        // Create an enemy instance.
        this.enemy = new Enemy(this, 400, 300);

        // Set up collision detection between bullets and the enemy.
        this.physics.add.collider(this.hero.currentWeapon.bullets, this.enemy, this.bulletHitEnemy, null, this);
    }

    bulletHitEnemy(enemy, bullet) {
        // Destroy the bullet.
        bullet.destroy();

        // Calculate damage based on weapon stats (assuming you have a getDamage() method in your weapon stats).
        const damageAmount = this.hero.currentWeapon.weaponStats.getDamage();

        // Let the enemy take damage.
        enemy.takeDamage(damageAmount);
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

        // Enhance FSM with an event dispatcher for state change
        fsm.onStateChange = new Phaser.Events.EventEmitter();

        // Override the `transition` method to notify about state changes
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
        this.keys.FKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        // Fire weapon event listener
        this.keys.FKey.on('down', () => {
            console.log('F key pressed: Firing weapon');
            this.hero.fireWeapon();
        });

        // Switch weapon event listener
        this.keys.WKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keys.WKey.on('down', () => {
            
            this.hero.switchWeapon();
        });
    }
    
    update(time,delta) {
        if (this.heroFSM && typeof this.heroFSM.step === 'function') {
            this.heroFSM.step();
        }

        if (this.chunkManager && typeof this.chunkManager.update === 'function') {
            this.chunkManager.update(this.hero);
        }
        if (this.keys.KKey.isDown) {
            this.executeDebuggerReport();
        }

        // Update all weapons' bullets
        for (let weapon of this.hero.weapons) {
            weapon.update(delta, this.hero);
        }
    }

    executeDebuggerReport() {
        if (!this.gameDebugger) {  // Initialize the Debugger class if not done yet.
            this.gameDebugger = new Debugger(this, this.hero, this.chunkManager);
        }
        this.gameDebugger.executeFullReport();
    }

}
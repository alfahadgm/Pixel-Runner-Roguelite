
class EnemyManager {
    constructor(scene) {
        this.scene = scene;

        this.enemyBudget = 0;
        this.currentWave = 0;
        this.enemies = this.scene.add.group({
            classType: Enemy,
            maxSize: 100,
        });
        this.setupEnemyData();  
        this.setupWaveConfigurations();
    }

    updateEnemies(hero) {
        this.enemies.getChildren().forEach(enemy => {
            enemy.follow(hero);
        });
    }

    setupEnemyData() {
        this.enemyData = {
            enemy1: { cost: 2, class: Enemy1, spawnProbability: 0.5 },
            enemy2: { cost: 5, class: Enemy2, spawnProbability: 0.3 }
        };
    }

    setupWaveConfigurations() {
        this.waveConfigurations = [
            { duration: 60, enemyBudget: 100, spawnCooldownRange: [1.5, 2.5] },
            { duration: 90, enemyBudget: 150, spawnCooldownRange: [1.3, 2.3] }
            // ... add more wave configurations as needed
        ];
    }

    startWave(waveNumber) {
        
        if (waveNumber < this.waveConfigurations.length) {
            this.currentWave = waveNumber;
            const waveConfig = this.waveConfigurations[waveNumber];
            this.enemyBudget = waveConfig.enemyBudget;
            
            this.spawnEnemies(waveConfig);
        } else {
            console.warn('Wave number exceeds configured waves');
        }
    }

    selectEnemyTypeByProbability() {
        const rnd = Math.random();
        let cumulativeProbability = 0;
    
        for (const type in this.enemyData) {
            const enemyInfo = this.enemyData[type];
            cumulativeProbability += enemyInfo.spawnProbability;
            if (rnd <= cumulativeProbability) return type;
        }
    
        // Fallback to a default enemy type if none is selected
        console.warn('Defaulting to enemy1 due to probability mismatch.');
        return 'enemy1';
    }

    spawnEnemies(waveConfig) {
        if (this.enemyBudget <= 0) return;

        const selectedEnemyType = this.selectEnemyTypeByProbability();
        

        // Ensure we have a valid enemy type
        if (selectedEnemyType === null) {
            console.warn('Failed to select enemy type based on probabilities.');
            return; 
        }

        const enemyInfo = this.enemyData[selectedEnemyType];
        if (this.enemyBudget >= enemyInfo.cost) {
            this.spawnEnemyOfType(enemyInfo);
            this.enemyBudget -= enemyInfo.cost;
        }

        const cooldown = Phaser.Math.Between(waveConfig.spawnCooldownRange[0] * 1000, waveConfig.spawnCooldownRange[1] * 1000);
        this.scene.time.delayedCall(cooldown, () => this.spawnEnemies(waveConfig), [], this);
    }


    spawnEnemyOfType(enemyInfo) {
        const SAFE_ZONE = 200;
        const { x, y } = this.computeSpawnPosition(SAFE_ZONE, this.scene.hero);
        
        
        const enemy = new enemyInfo.class(this.scene, x, y);
        this.enemies.add(enemy);
        

    }

    computeSpawnPosition(safeZone, hero) {
        const angle = Phaser.Math.DegToRad(Phaser.Math.Between(0, 360));
        const distanceFromHero = safeZone + Phaser.Math.Between(50, 150);
        let x = hero.x + Math.cos(angle) * distanceFromHero;
        let y = hero.y + Math.sin(angle) * distanceFromHero;
    
        // Ensure spawn position is within the world bounds
        x = Phaser.Math.Clamp(x, 0, this.scene.scale.width);
        y = Phaser.Math.Clamp(y, 0, this.scene.scale.height);
    
        return {
            x: x,
            y: y
        };
    }

    removeAllEnemies() {
        this.enemies.clear(true, true);
    }

    getEnemyCount() {
        return this.enemies.getLength();
    }
}
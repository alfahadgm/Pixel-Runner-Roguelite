
class EnemyManager {
    constructor(scene) {
        this.scene = scene;
        this.enemyBudget = 0;
        this.currentWave = -1; // Initialize with -1 to ensure wave 0 starts properly
        this.endTimeOfLastWave = 0; // Add this new property
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
    
            if (this.scene.utils.isOutOfBounds(enemy, this.scene)) {
                // Remove the enemy that went out of bounds
                enemy.destroy();
    
                // Spawn a new enemy close to the hero
                const enemyInfo = this.enemyData[this.selectEnemyTypeByProbability()];
                this.spawnEnemyOfType(enemyInfo);
            }
        });
    }

    setupEnemyData() {
        this.enemyData = {
            enemy1: { cost: 2, class: Enemy1, spawnProbability: 0.6 },
            enemy2: { cost: 5, class: Enemy2, spawnProbability: 0.4 }
        };
    }

    manageWaves() {
        if (this.currentWave >= this.waveConfigurations.length - 1) {
            return;  // If all waves have been processed, exit the function.
        }
        
        const nextWave = this.currentWave + 1;
        const nextWaveStartTime = this.endTimeOfLastWave;
        const nextWaveEndTime = nextWaveStartTime + this.waveConfigurations[nextWave].duration;
        
        if (this.scene.totalTime >= nextWaveStartTime && this.scene.totalTime < nextWaveEndTime) {
            this.startWave(nextWave);
            this.endTimeOfLastWave = nextWaveEndTime;
        }
    }

    setupWaveConfigurations() {
        this.waveConfigurations = [
            { 
                duration: 60, 
                enemyBudget: 100, 
                spawnCooldownRange: [2, 3], 
                allowedEnemies: [
                    { type: 'enemy1', probability: 1 } // Only 'enemy1' in this wave with 100% probability
                ]
            },
            { 
                duration: 60, 
                enemyBudget: 200, 
                spawnCooldownRange: [1.8, 2.8], 
                allowedEnemies: [
                    { type: 'enemy1', probability: 0.7 }, // 70% chance for 'enemy1'
                    { type: 'enemy2', probability: 0.3 }  // 30% chance for 'enemy2'
                ]
            },
            { 
                duration: 60, 
                enemyBudget: 300, 
                spawnCooldownRange: [1.5, 2.5], 
                allowedEnemies: [
                    { type: 'enemy1', probability: 0.5 }, // 50% chance for 'enemy1'
                    { type: 'enemy2', probability: 0.5 }  // 50% chance for 'enemy2'
                ]
            },
            { 
                duration: 60, 
                enemyBudget: 400, 
                spawnCooldownRange: [1.3, 2.3], 
                allowedEnemies: [
                    { type: 'enemy1', probability: 0.4 }, // 40% chance for 'enemy1'
                    { type: 'enemy2', probability: 0.6 }  // 60% chance for 'enemy2'
                ]
            }
            // ... add more wave configurations as needed
        ];
    }
    

    startWave(waveNumber) {
        

        if (waveNumber >= this.waveConfigurations.length) {
            
            return;
        }

        this.currentWave = waveNumber;
        this.scene.ui.displayWave(this.currentWave);  // Display the wave number

        const waveConfig = this.waveConfigurations[waveNumber];
        this.enemyBudget = waveConfig.enemyBudget;
        
        this.spawnEnemies(waveConfig);
    }

    selectEnemyTypeByProbability() {
        const rnd = Math.random();
        let cumulativeProbability = 0;
        const currentWaveConfig = this.waveConfigurations[this.currentWave];
        const allowedEnemies = currentWaveConfig.allowedEnemies || [];

        for (const enemy of allowedEnemies) {
            cumulativeProbability += enemy.probability;
            if (rnd <= cumulativeProbability) return enemy.type;
        }

        
        return 'enemy1';
    }

    spawnEnemies(waveConfig) {
        if (this.enemyBudget <= 0) return;
    
        const randomChance = Math.random();
        const BATCH_SPAWN_PROBABILITY = 0.1; // 10% chance to spawn a batch of enemies
    
        if (this.currentWave >= 3 && randomChance <= BATCH_SPAWN_PROBABILITY) {
            const BATCH_BUDGET = 30; // Decide how much budget to allocate for a single batch
            this.EnemiesBatch(Math.min(this.enemyBudget, BATCH_BUDGET));
        } else {
            const selectedEnemyType = this.selectEnemyTypeByProbability();
            const enemyInfo = this.enemyData[selectedEnemyType];
    
            if (this.enemyBudget >= enemyInfo.cost) {
                this.spawnEnemyOfType(enemyInfo);
                this.enemyBudget -= enemyInfo.cost;
            }
        }
    
        const cooldown = Phaser.Math.Between(waveConfig.spawnCooldownRange[0] * 1000, waveConfig.spawnCooldownRange[1] * 1000);
        this.scene.time.delayedCall(cooldown, () => this.spawnEnemies(waveConfig), [], this);
    }
    

    EnemiesBatch(batchBudget) {
        // Loop until the budget for this batch is exhausted or below the cost of the cheapest enemy
        while (batchBudget > 0) {
            const selectedEnemyType = this.selectEnemyTypeByProbability();
            const enemyInfo = this.enemyData[selectedEnemyType];
            
            if (batchBudget >= enemyInfo.cost) {
                this.spawnEnemyOfType(enemyInfo);
                batchBudget -= enemyInfo.cost;
            } else {
                break; // If we can't afford any enemy, break out
            }
        }
    }
    

    spawnEnemyOfType(enemyInfo) {
        if (this.enemyBudget < enemyInfo.cost) {
            return;
        }
    
        const SAFE_ZONE = 200;
        const { x, y } = this.computeSpawnPosition(SAFE_ZONE, this.scene.hero);
    
        const enemy = new enemyInfo.class(this.scene, x, y);
        
        this.enemies.add(enemy);
    
        this.enemyBudget -= enemyInfo.cost;
    }


    computeSpawnPosition(safeZone, hero) {
        const screenWidth = this.scene.game.config.width;
        const screenHeight = this.scene.game.config.height;
    
        // Calculate the maximum possible distance a spawn can be based on the diagonal of the screen
        const maxDistanceFromHero = Math.sqrt(screenWidth * screenWidth + screenHeight * screenHeight);
    
        // Generate a random angle for the spawn direction
        const angle = Phaser.Math.DegToRad(Phaser.Math.Between(0, 360));
    
        // The minimum distance from the hero is the half of the diagonal of the screen (to make sure it's out of screen)
        const distanceFromHero = (maxDistanceFromHero / 2) + Phaser.Math.Between(50, 150);
        
        const x = hero.x + Math.cos(angle) * distanceFromHero;
        const y = hero.y + Math.sin(angle) * distanceFromHero;
    
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
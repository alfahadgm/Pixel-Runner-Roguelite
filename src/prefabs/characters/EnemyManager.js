
class EnemyManager {
    constructor(scene) {
        this.scene = scene;
        this.enemyBudget = 0;
        this.currentWave = -1; // Initialize with -1 to ensure wave 0 starts properly
        this.endTimeOfLastWave = 0; // Add this new property
        this.enemies = this.scene.add.group({
            classType: Enemy,
            maxSize: 100000,
        });
        
        this.setupEnemyData();
        this.setupWaveConfigurations();     
        this.initializeEnemyCounter();  
    }

    // FOR DEBUGGING
    initializeEnemyCounter() {
        this.enemyCounterText = this.scene.add.text(10, 10, 'Enemies: 0', { font: '16px Arial', fill: '#ffffff' }).setScrollFactor(0).setDepth(4);
    }
    updateEnemyCounterDisplay() {
        const enemyCount = this.getEnemyCount();
        this.enemyCounterText.setText('Enemies: ' + enemyCount);
    }

    updateEnemies(hero) {
        this.updateEnemyCounterDisplay()
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
            bat: { cost: 2, class: Bat, spawnProbability: 0.6 },
            skeleton: { cost: 4, class: Skeleton, spawnProbability: 0.4 },
            bee: { cost: 6, class: Bee, spawnProbability: 0.5 },
            smallWorm: { cost: 6, class: SmallWorm, spawnProbability: 0.4 },
            bigWorm: { cost: 8, class: BigWorm, spawnProbability: 0.3 },
            eyeBall: { cost: 15, class: EyeBall, spawnProbability: 0.5 },
            ghost: { cost: 15, class: Ghost, spawnProbability: 0.5 },
            flower: { cost: 30, class: Flower, spawnProbability: 0.2 },
            pumpking: { cost: 25, class: Pumpking, spawnProbability: 0.15 },
            slime: { cost: 25, class: Slime, spawnProbability: 0.1 },
            miniSlime: { cost: 20, class: MiniSlime, spawnProbability: 0.15 },
            snake: { cost: 25, class: Snake, spawnProbability: 0.1 }
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
                duration: 45, 
                enemyBudget: 100, 
                spawnCooldownRange: [2, 3], 
                allowedEnemies: [
                    { type: 'bat', probability: 1 } // Only 'bat' in this wave with 100% probability
                ]
            },
            { 
                duration: 45, 
                enemyBudget: 200, 
                spawnCooldownRange: [1.8, 2.8], 
                allowedEnemies: [
                    { type: 'bat', probability: 0.7 }, // 70% chance for 'bat'
                    { type: 'skeleton', probability: 0.3 }  // 30% chance for 'skeleton'
                ]
            },
            { 
                duration: 45, 
                enemyBudget: 300, 
                spawnCooldownRange: [1.5, 2.5], 
                allowedEnemies: [
                    { type: 'bat', probability: 0.5 }, // 50% chance for 'bat'
                    { type: 'skeleton', probability: 0.5 }  // 50% chance for 'skeleton'
                ]
            },
            { 
                duration: 45, 
                enemyBudget: 400, 
                spawnCooldownRange: [1.3, 2.3], 
                allowedEnemies: [
                    { type: 'bat', probability: 0.3 }, // 40% chance for 'bat'
                    { type: 'skeleton', probability: 0.6 },  // 60% chance for 'skeleton'
                    { type: 'bee', probability: 0.1 }
                ]
            },
            {
                duration: 60,
                enemyBudget: 500,
                spawnCooldownRange: [1.2, 2.2],
                allowedEnemies: [
                    { type: 'bat', probability: 0.2 },
                    { type: 'skeleton', probability: 0.4 },
                    { type: 'bee', probability: 0.4 }
                ]
            },
            // Wave 6
            {
                duration: 60,
                enemyBudget: 600,
                spawnCooldownRange: [1.1, 2.1],
                allowedEnemies: [
                    { type: 'bee', probability: 0.6 },
                    { type: 'smallWorm', probability: 0.4 }
                ]
            },
            // Wave 8
            {
                duration: 60,
                enemyBudget: 800,
                spawnCooldownRange: [1, 2],
                allowedEnemies: [
                    { type: 'smallWorm', probability: 0.5 },
                    { type: 'eyeBall', probability: 0.5 },
                ]
            },
            // Wave 9
            {
                duration: 60,
                enemyBudget: 1000,
                spawnCooldownRange: [0.9, 1.9],
                allowedEnemies: [
                    { type: 'eyeBall', probability: 0.7 },
                    { type: 'bigWorm', probability: 0.3 }
                ]
            },
            // Wave 11
            {
                duration: 60,
                enemyBudget: 1200,
                spawnCooldownRange: [0.8, 1.8],
                allowedEnemies: [
                    { type: 'ghost', probability: 0.6 },
                    { type: 'eyeBall', probability: 0.4 },
                ]
            },
            // Wave 13
            {
                duration: 60,
                enemyBudget: 1400,
                spawnCooldownRange: [0.7, 1.7],
                allowedEnemies: [
                    { type: 'flower', probability: 0.5 },
                    { type: 'ghost', probability: 0.5 }
                ]
            },
            // Wave 14
            {
                duration: 60,
                enemyBudget: 1600,
                spawnCooldownRange: [0.7, 1.6],
                allowedEnemies: [
                    { type: 'pumpking', probability: 0.6 },
                    { type: 'flower', probability: 0.4 }
                ]
            },
            // Wave 16
            {
                duration: 90,
                enemyBudget: 1800,
                spawnCooldownRange: [0.6, 1.5],
                allowedEnemies: [
                    { type: 'slime', probability: 0.7 },
                    { type: 'pumpking', probability: 0.3 }
                ]
            },
            {
                duration: 90,
                enemyBudget: 2000,
                spawnCooldownRange: [0.6, 1.5],
                allowedEnemies: [
                    { type: 'miniSlime', probability: 1 } // 100% miniSlime
                ]
            },
            {
                duration: 95,
                enemyBudget: 2200,
                spawnCooldownRange: [0.5, 1.4],
                allowedEnemies: [
                    { type: 'snake', probability: 0.7 },
                    { type: 'eyeBall', probability: 0.3 }
                ]
            },
            {
                duration: 100,
                enemyBudget: 2400,
                spawnCooldownRange: [0.5, 1.3],
                allowedEnemies: [
                    { type: 'eyeBall', probability: 0.2 },
                    { type: 'snake', probability: 0.4 },
                    { type: 'slime', probability: 0.4 }
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

        
        return 'bat';
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
            console.log('Selected Enemy Type:', selectedEnemyType); // Add this log
            const enemyInfo = this.enemyData[selectedEnemyType];
         // Throw Error if not found
            if (enemyInfo && this.enemyBudget >= enemyInfo.cost) {

            if (this.enemyBudget >= enemyInfo.cost) {
                this.spawnEnemyOfType(enemyInfo);
                this.enemyBudget -= enemyInfo.cost;
            }
        } else {
            console.error('Enemy Info not found for:', selectedEnemyType);
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
class Utils {

    constructor(scene) {
        this.scene = scene;
    }
    isOutOfBounds(entity, scene) {
        const screenWidth = scene.game.config.width;
        const screenHeight = scene.game.config.height;
    
        // Calculate the maximum allowable distance as twice the screen's diagonal 
        const maxDistance = Math.sqrt(screenWidth * screenWidth + screenHeight * screenHeight) * 2;
    
        // Calculate the actual distance between the hero and the entity
        const dx = scene.hero.x - entity.x;
        const dy = scene.hero.y - entity.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
    
        // Return true if the entity is farther than the allowable distance
        return distance > maxDistance;
    }
    
    
    calculateDistance(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    }

    normalizeVector(vector) {
        const magnitude = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
        return {
            x: vector.x / magnitude,
            y: vector.y / magnitude
        };
    }

    findNearestEnemy(x, y, excludeEnemy = null) {
        let nearestEnemy = null;
        let nearestDistance = Infinity;
    
        this.scene.enemyManager.enemies.getChildren().forEach(enemy => {
            if (excludeEnemy && enemy === excludeEnemy) return; // Skip the current enemy
    
            const distance = Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y);
            
            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearestEnemy = enemy;
            }
        });
        
        return nearestEnemy;
    }
}    
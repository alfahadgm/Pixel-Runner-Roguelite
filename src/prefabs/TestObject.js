class ColliderBlock extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'block'); 
        scene.add.existing(this);
        scene.physics.add.existing(this, true); 

        this.setImmovable(true);

        // Initialize block health
        this.health = 100000;
    }

    // Decrease health and handle when it reaches 0
    decreaseHealth(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.health = 0;
            this.handleDestroy();
        }
        
    }

    // Handle block destruction or any other logic you want when health reaches 0
    handleDestroy() {
        this.health = 100000
    }
}

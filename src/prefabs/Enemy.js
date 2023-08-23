class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'enemy'); // Replace 'null' with the key of the enemy image in the preload scene.
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCircle(25); // Setting a circular hitbox with a radius of 25 pixels.
        
        const color = new Phaser.Display.Color(150, 0, 0); // Custom color
        this.setTint(color.color); // Use setTint to change the tint color.

        this.setInteractive();

        // Damage display text.
        this.damageDisplayText = scene.add.text(this.x, this.y - 40, '0', {
            fontSize: '16px',
            fill: '#ffffff'
        });
        this.damageDisplayText.setOrigin(0.5, 0.5);

        this.setDepth(5); // Set the depth to 5.

    }

    takeDamage(damageAmount) {
        // Update the text to display the damage amount.
        this.damageDisplayText.setText(damageAmount);
    }
}

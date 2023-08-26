

'use strict';

const config = {
    parent: 'phaser-game',  // for info text
    type: Phaser.WEBGL,     // for tinting
    width: 600,
    height: 400,
    pixelArt: true,
    backgroundColor: "black",
    zoom: 2,
    physics: {
        default: "arcade",
        arcade: {
            debug: true,
            Gravity: { x: 0, y: 0 }
        }
    },
    scene: [ GameScene ]
};


const game = new Phaser.Game(config);
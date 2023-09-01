

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
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 720,
        height: 480
    },
    render: {
        antialias: true,
        antialiasGL: true,
        pixelArt: true
    },
    fps: {
        min: 10,
        target: 60,
        forceSetTimeOut: false,
        deltaHistory: 10
    },
    
    autoRound: false,
    scene: [ GameScene ]
};


const game = new Phaser.Game(config);
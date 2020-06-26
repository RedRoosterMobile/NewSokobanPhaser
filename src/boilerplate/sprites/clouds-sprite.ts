export class Clouds extends Phaser.Physics.Arcade.Sprite  {

    constructor(scene,x,y,spriteName) {
        super(scene,x,y,null);
        // screen size?
    }

    initClouds():void {
        // load all the stuff
        
        // layer 1 small clouds
        // layer 2 big clouds

        // idea: put in container and only move layer 2 relative to layer 1?
    }

    updateClouds(playerVelocityX:number, playerVelocityY:number):void {
        // do slight vertical scrolling (dampen)
        // main focus horizontal scrolling
    } 
}
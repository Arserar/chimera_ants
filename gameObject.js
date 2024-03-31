export default class GameObject {
    constructor(game) {
        // Instance of a GameWorld class.
        this.game = game;

        // Collision hit box center coordinates
        this.collisionX = 0;
        this.collisionY = 0;

        //Hit box radius
        this.collisionRadius = 5;

        // Dimensions of the object on the game screen.
        this.width = this.collisionRadius;
        this.height = this.collisionRadius;
    }

    update() {

    }

    draw(context) {
        this.debug(context);
    }

    // Draw collision hit box when we're in a debug mode.
    debug(context) {
        if (this.game.debug) {
            context.beginPath();
            context.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2);
            context.save();
            context.globalAlpha = 0.5;
            context.fill();
            context.restore();
            context.stroke();
        }
    }
}
import { getRandomPointOutsideRectangle } from "./helpers.js";
import MovingObject from "./movingObject.js";

export default class Enemy extends MovingObject {
    constructor(game) {
        super(game);

        this.image = document.getElementById('enemy');

        this.spriteWidth = 150;
        this.spriteHeight = 180;
        this.width = this.spriteWidth;
        this.height = this.spriteHeight;
        
        // Gets random coordinates outside of game borders
        const randomCoordinates = getRandomPointOutsideRectangle(-this.width, this.game.width + this.width, -this.height, this.game.height + this.height);
        this.collisionX = randomCoordinates.x;
        this.collisionY = randomCoordinates.y;

        this.speedModifier = Math.random() * 7 + 0.5;
    }


    // We need to get distance between hit box centers and angle between x axis and the distance.
    // Knowing angle and distance we can determine in which direction enemy should go to reach player.
    update() {
        // Distances between hit box center coordinates of player and enemy.
        this.dx = this.game.player.collisionX - this.collisionX;
        this.dy = this.game.player.collisionY - this.collisionY;


        // Angle between x axis and distance of hit box centers.
        this.angle = Math.atan2(this.dy, this.dx) * (180 / Math.PI);

        // We need to do (this.rotationAngle + 360) % 360 to make sure that angle is within 360 degrees.
        // Also we need to add 90 because in our case 0 degrees is on the top.
        this.angle = ((this.angle + 360) + 90) % 360;

        // Distance between hit box centers.
        const distance = Math.hypot(this.dy, this.dx);

        // We do this.dx/distance and this.dy/distance to determine the direction enemy should go.
        // If enemy is close enough we stop its movement.
        if (distance > this.speedModifier) {
            this.speedX = this.dx/distance || 0;
            this.speedY = this.dy/distance || 0;
        } else {
            this.speedX = 0;
            this.speedY = 0;
        }

        this.collisionX += this.speedX * this.speedModifier;
        this.collisionY += this.speedY * this.speedModifier;

        // We center sprite around the hit box center.
        this.spriteX = this.collisionX - this.width * 0.5;
        this.spriteY = this.collisionY - this.height * 0.5;
    }
}
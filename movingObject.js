import GameObject from "./gameObject.js";

export default class MovingObject extends GameObject {
    constructor(game) {
        super(game);

        // Image from which we're going to take our sprites.
        this.image;

        // Top left coordinates of the sprite on the game screen.
        this.spriteX = 0;
        this.spriteY = 0;

        // Speed of change of x and y coordinates.
        this.speedX = 0;
        this.speedY = 0;

        // Factor by which we multiply speedX and speedY when changing the coordinates.
        this.speedModifier = 0;

        // Dimensions of every sprite in the image.
        this.spriteWidth = 0;
        this.spriteHeight = 0;

        // Sprtie coordinates in the image.
        this.frameX = 0;
        this.frameY = 0;

        // Angle by which we rotate moving object depending on which keys has been pressed.
        this.angle = 0;
    }

    draw(context) {
        context.save();

        // Convert the angle to radians
        const radians = (this.angle * Math.PI) / 180;

        context.translate(this.spriteX + this.width / 2, this.spriteY + this.height / 2);
        context.rotate(radians);

        context.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, -this.width / 2, -this.height / 2, this.width, this.height);

        context.restore();
    
        
        this.debug(context);
    }
}
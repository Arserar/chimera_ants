import MovingObject from "./movingObject.js";

export default class Player extends MovingObject {
    constructor(game) {
        super(game);

        this.image = document.getElementById("player");
        
        this.eKeyPressed = false;

        this.collisionX = this.game.width * 0.5;
        this.collisionY = this.game.height * 0.5;

        this.speedModifier = 3;

        this.spriteWidth = 150;
        this.spriteHeight = 180;
        this.width = this.spriteWidth;
        this.height = this.spriteHeight;

        // These three properties are needed to leave the rotation angle the same as before releasing keys.
        this.YKeyUpTime = 25;
        this.XKeyUpTime = 0;
        this.angleBeforeReleasingKeys = 0;


        this.hp = 100;

        // Rotation angle we should reach by changing current angle. 
        // By doing that we create smooth rotation.
        this.targetAngle = 0;

        
        this.targetX = 0;
        this.targetY = 0;

        // Change the direction of movement depending on which keys were pressed.
        window.addEventListener('keydown', (e) => {
            switch(e.key) {
                case "ArrowUp":
                    this.speedY = -1;
                    break;
                case "ArrowRight":
                    this.speedX = 1;
                    break;
                case "ArrowDown":
                    this.speedY = 1;
                    break;
                case "ArrowLeft":
                    this.speedX = -1;
                    break;
                case "e":
                    this.eKeyPressed = true;
                    break;
            }
        });


        addEventListener('keyup', (e) => {
            switch(e.key) {
                case "ArrowUp":
                    if (this.speedY === -1) {
                        this.speedY = 0;
                        this.YKeyUpTime = Date.now();
                    }
                    break;
                case "ArrowRight":
                    if (this.speedX === 1) {
                        this.speedX = 0;
                        this.XKeyUpTime = Date.now();
                    }
                    break;
                case "ArrowDown":
                    if (this.speedY === 1) {
                        this.speedY = 0;
                        this.YKeyUpTime = Date.now();
                    }
                    break;
                case "ArrowLeft":
                    if (this.speedX === -1) {
                        this.speedX = 0;
                        this.XKeyUpTime = Date.now();
                    }
                    break;
                case "e":
                    this.eKeyPressed = false;
                    break;
            }
        });
    }

    update() {
        // Determining the rotation angle based on which key were pressed.
        if (Math.abs(this.XKeyUpTime - this.YKeyUpTime) < 50) {
            this.YKeyUpTime -= 3000;
            this.targetAngle = this.angleBeforeReleasingKeys;
        } else {
            if (this.speedY === -1 && this.speedX === 0) this.targetAngle = 0;
            else if (this.speedY === -1 && this.speedX === 1) this.angleBeforeReleasingKeys = this.targetAngle = 45;
            else if (this.speedY === 0 && this.speedX === 1) this.targetAngle = 90;
            else if (this.speedY === 1 && this.speedX === 1) this.angleBeforeReleasingKeys = this.targetAngle = 135;
            else if (this.speedY === 1 && this.speedX === 0) this.targetAngle = 180;
            else if (this.speedY === 1 && this.speedX === -1) this.angleBeforeReleasingKeys = this.targetAngle = 225;
            else if (this.speedY === 0 && this.speedX === -1) this.targetAngle = 270;
            else if (this.speedY === -1 && this.speedX === -1) this.angleBeforeReleasingKeys = this.targetAngle = 315;
        }

        // Calculate the difference between the current angle and the target angle
        let angleDifference = this.targetAngle - this.angle;
        const angleDifferenceSign = Math.sign(angleDifference);
        angleDifference = Math.abs(angleDifference);

        
        let coterminalOfDifference = 360 - angleDifference;

        // When angleDifference and coterminalOfDifference are the 
        // same the formula for determining shortest possible rotation doesn't work properly.
        // That's why we need to increment coterminalOfDifference to solve this problem.
        if (angleDifference === coterminalOfDifference) coterminalOfDifference++;

        // Determines shortest possible rotation we should do to get from current rotation angle to the target angle.
        this.angle += Math.sign(coterminalOfDifference - angleDifference) * angleDifferenceSign * Math.min(angleDifference, coterminalOfDifference) * 0.1;

        // if (coterminalOfDifference < Math.abs(angleDifference)) {
        //     this.angle += -1 * Math.sign(angleDifference) * coterminalOfDifference * 0.1;
        // } else if (coterminalOfDifference > Math.abs(angleDifference)) {
        //     this.angle += Math.sign(angleDifference) * Math.abs(angleDifference) * 0.1;
        // }

        // This is needed to make sure that rotation angle stays withing 360 degrees range. 
        this.angle = (this.angle + 360) % 360;

        // If enemy pushed player we get target position on the screen player should move to.
        if (this.targetX || this.targetY) {
            const changingSpeedX = (this.targetX - this.collisionX) * 0.1;
            const changingSpeedY = (this.targetY - this.collisionY) * 0.1;
            this.collisionX += changingSpeedX;
            this.collisionY += changingSpeedY;
        }

        // If there is a movement stop the pushing effect.
        if (this.speedX || this.speedY) {
            this.targetX = 0;
            this.targetY = 0;
        }

        this.collisionX += this.speedX * this.speedModifier;
        this.collisionY += this.speedY * this.speedModifier;

        // We center sprite around the hit box center.
        this.spriteX = this.collisionX - this.width * 0.5;
        this.spriteY = this.collisionY - this.height * 0.5;

        // Horizontal boundaries
        if (this.collisionX < this.height * 0.5) {
            this.collisionX = this.height * 0.5;
        } else if (this.collisionX > this.game.width - this.height * 0.5) {
            this.collisionX = this.game.width - this.height * 0.5;
        }

        // Vertical boundaries
        if (this.collisionY < this.height * 0.5) {
            this.collisionY = this.height * 0.5;
        } else if (this.collisionY > this.game.height - this.height * 0.5) {
            this.collisionY = this.game.height - this.height * 0.5;
        }

        for (let i = 0; i < this.game.enemies.length; i++) {
            const enemy = this.game.enemies[i];


            let [collision, distance, sumOfRadii, dx, dy] = this.game.checkCollision(this, enemy);

            if (distance < 100) {
                if (this.eKeyPressed) {
                    this.frameX = 1;

                    this.game.score += 1;

                    this.hp += 1;
                    if (this.hp > 100) this.hp = 100;

                    this.speedModifier += enemy.speedModifier * 0.1;

                    if (this.speedModifier > 7) this.speedModifier = 7;

                    this.game.amountOfEnemies = this.game.amountOfEnemies + 1;

                    if (this.game.amountOfEnemies > 1000) this.game.amountOfEnemies = 1000;

                    this.game.enemies.splice(i, 1);
                    break;
                }
            }

            if (collision) {
                this.hp -= 1;

                if (this.hp < 0) this.hp = 0;

                // Here we determine  direction of player it should move after being pushed by enemy.
                const unit_x = dx / distance;
                const unit_y = dy / distance;

                // After being pushed player gets position on the game screen it should move to.
                this.targetX = enemy.collisionX + (sumOfRadii + 200) * unit_x;
                this.targetY = enemy.collisionY + (sumOfRadii + 200) * unit_y;
            }
        }
    }
}
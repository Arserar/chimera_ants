import Enemy from "./enemy.js";
import Player from "./player.js";
import TileMap from "./tileMap.js";

export default class GameWorld {
    constructor(canvas, context, width, height) {
        // Dimensions
        this.width = width;
        this.height = height;
        this.canvas = canvas;
        this.context = context;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        // If this propery is true we draw collision hit boxes
        this.debug = false;


        // FPS
        this.fps = 70;
        this.lastRenderTime = 0;

        // gameMap propery stores a reference to a buffer canvas element
        this.gameMap = new TileMap(this.canvas, this.context, 20, 20).generate();

        this.init();

        this.context.fillStyle = 'white';
        this.context.lineWidth = 3;
        this.context.strokeStyle = 'black';
        this.context.font = '40px Arial';
        this.context.textAlign = 'center';

        window.addEventListener('keydown', (e) => {
            if (e.key === 'd') this.debug = !this.debug;
            else if (e.key === 'r' && this.gameOver) {
                this.init();
                this.gameLoop();
            }
        });
    }

    init() {
        this.player = new Player(this);
        this.score = 0;
        this.enemies = [];
        this.amountOfEnemies = 1;
        this.gameOver = false;
    }

    checkCollision(a, b) {
        const dx = a.collisionX - b.collisionX;
        const dy = a.collisionY - b.collisionY;
        const distance = Math.hypot(dy, dx);
        const sumOfRadii = a.collisionRadius + b.collisionRadius;
        return [(distance < sumOfRadii), distance, sumOfRadii, dx, dy];
    }

    addEnemy() {
        this.enemies.push(new Enemy(this));
    }

    gameLoop(currentTime = 0) {
        if (this.gameOver) return;

        window.requestAnimationFrame(this.gameLoop.bind(this));

        const secondsSinceLastRender = (currentTime - this.lastRenderTime) / 1000;
        if (secondsSinceLastRender < 1 / this.fps) return;

        this.lastRenderTime = currentTime;

        // Add new enemies to the game after the player have eaten them.
        const amountOfNewEnemies = Math.floor(this.amountOfEnemies) - this.enemies.length;
        if (amountOfNewEnemies > 0) {
            for (let i = 0; i < amountOfNewEnemies; i++) {
                this.addEnemy();
            }
        }


        this.context.clearRect(0, 0, this.width, this.height);
        this.context.drawImage(this.gameMap, 0, 0, this.width, this.height);

        this.gameObjects = [this.player, ...this.enemies];

        // Sort by vertical position. By doing this we create illusion of depth in the game.
        // Game objects that are on the bottom of the screen are drawn on top of objects that are on the top of the scree.
        this.gameObjects.sort((a, b) => {
            return a.collisionY - b.collisionY;
        })

        this.gameObjects.forEach(object => {
            object.update();
            object.draw(this.context);
        });

        this.context.fillText("Press E to eat", this.width - 200, 50);

        // Draw status text
        this.context.save();
        this.context.textAlign = 'left';
        this.context.fillText('Score: ' + this.score, 25, 50);
        this.context.fillText(`HP: ${this.player.hp}`, 25, 100);
        this.context.restore();

        //Lose message
        if (this.player.hp <= 0) {
            this.gameOver = true;

            this.context.save();
            this.context.fillStyle = 'rgba(0, 0, 0, 0.5)';
            this.context.fillRect(0, 0, this.width, this.height);
            this.context.fillStyle = 'white';
            this.context.textAlign = 'center';
            this.context.shadowOffsetX = 4;
            this.context.shadowOffsetY = 4;
            this.context.shadowColor = 'black';
            this.context.fillText("Game over! Your score is " + this.score + ". Press 'R' to play again!", this.width * 0.5, this.height * 0.5);
            this.context.restore();
        }
    }
}
import GameWorld from "./gameWorld.js";

window.addEventListener('load', function() {
    const canvas = this.document.getElementById('gameBoard');
    const ctx = canvas.getContext('2d');
    const gameWorld = new GameWorld(canvas, ctx, document.documentElement.clientWidth, document.documentElement.clientHeight);
    gameWorld.gameLoop();
});
export function getRandomPointOutsideRectangle(xMin, xMax, yMin, yMax) {
    let randomX, randomY;
  
    // Randomly decide whether to generate a point above/below or left/right of the rectangle
    let aboveOrBelow = Math.random() < 0.5;
    let leftOrRight = Math.random() < 0.5;
  
    if (aboveOrBelow) {
      // Generate a point above or below the rectangle
      randomX = Math.random() * (xMax - xMin) + xMin;
      randomY = leftOrRight ? yMin - Math.random() : yMax + Math.random();
    } else {
      // Generate a point left or right of the rectangle
      randomX = leftOrRight ? xMin - Math.random() : xMax + Math.random();
      randomY = Math.random() * (yMax - yMin) + yMin;
    }
  
    return { x: randomX, y: randomY };
}
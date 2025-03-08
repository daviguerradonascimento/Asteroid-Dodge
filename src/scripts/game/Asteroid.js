import * as PIXI from "pixi.js";

export class Asteroid {
    constructor(resources) {
        this.sprite = new PIXI.Sprite(resources.asteroid.texture);
        this.sprite.anchor.set(0.5);
        this.resetPosition();
        this.rotationSpeed = (Math.random() - 1) * 0.1;
    }

    // Reset asteroid position to the top of the screen
    resetPosition() {
        this.sprite.x = Math.random() * window.innerWidth;  // Random horizontal position
        this.sprite.y = -50;  // Position it above the screen

        this.randomizeDirection();
    }

    randomizeDirection() {
        // Random horizontal speed (between a given range) for left/right movement
        this.speedX = (Math.random() - 0.5) * 0.2; // Random between -0.25 and 0.25 for a slower horizontal speed
        
        // Constant downward speed (between a controlled range)
        this.speedY = Math.random() * 2 + 3; // Random speed downwards (between 3 and 5)
    }

    update(delta, speed) {
        // Move based on the random speed and direction
        this.sprite.x += this.speedX * delta * 100; // Adjust with delta for smooth movement
        this.sprite.y += this.speedY * delta * speed;  // Move downward constantly

        this.sprite.rotation += this.rotationSpeed * delta;


        // Check for bouncing off the screen edges (left or right)
        if (this.sprite.x < 0 || this.sprite.x > window.innerWidth) {
            this.speedX = -this.speedX;  // Reverse horizontal direction
        }

        // If the asteroid moves off the bottom of the screen, reset its position
        if (this.sprite.y > window.innerHeight + 50) {
            this.resetPosition();
        }
    }

    destroy() {
        // Check if the sprite is not null before removing it from the parent
        if (this.sprite && this.sprite.parent) {
            this.sprite.parent.removeChild(this.sprite);
        }
        this.sprite = null;
    }
}
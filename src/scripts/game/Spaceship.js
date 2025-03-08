import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { App } from "../system/App";

export class Spaceship {
    constructor(resources) {
        // Create a container for the spaceship
        this.container = new PIXI.Container();

        // Create the spaceship sprite
        this.sprite = new PIXI.Sprite(resources.spaceship.texture);  // Assuming you have a 'spaceship' sprite in your assets
        this.sprite.anchor.set(0.5);
        this.container.addChild(this.sprite);

        this.sprite.scale.set(0.25);

        // Set initial position
        this.container.x = window.innerWidth / 2;
        this.container.y = window.innerHeight - 100;  // Position at the bottom


        gsap.to(this.container, {
            y: this.container.y - 10,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }

    moveLeft() {
        // Move the spaceship to the left, limit its movement to the window boundaries
        if (this.container.x > 0) {
            gsap.to(this.container, {
                x: this.container.x - 100,
                duration: 0.3,
                rotation: -0.1, // Tilt left
                onComplete: () => gsap.to(this.container, { rotation: 0, duration: 0.2 }) // Reset rotation
            });  // Move speed with animation
        }
    }

    moveRight() {
        // Move the spaceship to the right, limit its movement to the window boundaries
        if (this.container.x < window.innerWidth) {
            gsap.to(this.container, {
                x: this.container.x + 100,
                duration: 0.3,
                rotation: 0.1, // Tilt right
                onComplete: () => gsap.to(this.container, { rotation: 0, duration: 0.2 }) // Reset rotation
            });  // Move speed with animation
        }
    }

    collidesWith(asteroid) {
        const spaceshipBounds = this.sprite.getBounds(); // Gets the actual size after scaling
        const asteroidBounds = asteroid.sprite.getBounds();

        return (
            spaceshipBounds.x < asteroidBounds.x + asteroidBounds.width &&
            spaceshipBounds.x + spaceshipBounds.width > asteroidBounds.x &&
            spaceshipBounds.y < asteroidBounds.y + asteroidBounds.height &&
            spaceshipBounds.y + spaceshipBounds.height > asteroidBounds.y
        );
    }
}

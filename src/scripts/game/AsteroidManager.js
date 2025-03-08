import * as PIXI from "pixi.js"; // Import PixiJS
import { Asteroid } from "./Asteroid";

export class AsteroidManager {
    constructor(container, resources) {
        this.container = container;
        this.resources = resources;
        this.asteroids = [];  // Array to hold asteroids
        this.asteroidSpeed = 2; // Initial asteroid speed
        this.asteroidFrequency = 5; // Initial asteroid frequency
        this.elapsedTime = 0;

        // Initialize a few asteroids
        this.createAsteroids(this.asteroidFrequency);  // Let's start with 5 asteroids
    }

    // Create a certain number of asteroids and add them to the container
    createAsteroids(count) {
        for (let i = 0; i < count; i++) {
            const asteroid = new Asteroid(this.resources);
            this.container.addChild(asteroid.sprite);
            this.asteroids.push(asteroid);
        }
    }

    // Update all the asteroids
    update(delta) {
        this.elapsedTime += delta;

        // Increase difficulty every 10 seconds
        if (this.elapsedTime > 600) {
            this.increaseDifficulty();
            this.elapsedTime = 0;
        }

        // Loop through each asteroid and update its position
        this.asteroids.forEach(asteroid => {
            asteroid.update(delta, this.asteroidSpeed);
        });
    }

    increaseDifficulty() {
        // Increase asteroid speed
        this.asteroidSpeed += 0.5;

        // Increase asteroid frequency
        this.asteroidFrequency += 1;
        this.createAsteroids(1);
    }

    // Reset the asteroid manager
   reset() {
        // Remove all asteroids from the container
        this.asteroids.forEach(asteroid => {
            asteroid.destroy();
        });

        // Clear the asteroids array
        this.asteroids = [];

        // Reset asteroid speed and frequency
        this.asteroidSpeed = 2;
        this.asteroidFrequency = 5;

        // Create new asteroids
        this.createAsteroids(this.asteroidFrequency);
    }
}
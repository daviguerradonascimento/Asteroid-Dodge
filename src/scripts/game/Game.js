import { App } from "../system/App";
import { Scene } from "../system/Scene";
import { Spaceship } from "./Spaceship";
import { Asteroid } from "./Asteroid.js";

export class Game extends Scene {
    create() {
        this.createBackground();
        this.createSpaceship();
        this.createAsteroids();
        this.startGameLoop();
    }

    createBackground() {
        this.bg = App.sprite("bg"); 
        this.bg.width = window.innerWidth;
        this.bg.height = window.innerHeight;
        this.container.addChild(this.bg);
    }

    createSpaceship() {
        this.spaceship = new Spaceship();
        this.container.addChild(this.spaceship);
    }

    createAsteroids() {
        this.asteroids = [];
        this.asteroidSpawnInterval = setInterval(() => {
            const asteroid = new Asteroid();
            this.asteroids.push(asteroid);
            this.container.addChild(asteroid);
        }, 1000); // Spawn an asteroid every second
    }

    startGameLoop() {
        App.ticker.add(() => {
            this.asteroids.forEach(asteroid => asteroid.update());

            // Collision check
            this.asteroids.forEach(asteroid => {
                if (this.spaceship.checkCollision(asteroid)) {
                    this.gameOver();
                }
            });
        });
    }

    gameOver() {
        alert("Game Over!");
        App.scene.start("Game"); // Restart game
    }
}
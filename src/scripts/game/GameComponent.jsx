import React, { useEffect, useRef, useState } from "react";
import * as PIXI from "pixi.js";
import {Spaceship} from "./Spaceship";
import AsteroidManager from "./AsteroidManager"; // Import without curly braces
import spaceshipImage from "../../sprites/spaceship.png";
import asteroidImage from "../../sprites/asteroid.png";
import backgroundImage from "../../sprites/bg.png";
import musicFile from "../../sprites/music.mp3"; // Import your music file

const GameComponent = () => {
    var score = 0;
    const [gameOver, setGameOver] = useState(false);
    const gameOverRef = useRef(false);
    const containerRef = useRef(null);
    const appRef = useRef(null);
    const spaceshipRef = useRef(null);
    const scoreTextRef = useRef(null);
    const resourcesRef = useRef(null);
    const backgroundRef = useRef(null);
    const musicRef = useRef(null); // Ref for the audio element
    const [musicAllowed, setMusicAllowed] = useState(false);
    const [asteroids, setAsteroids] = useState([]);
    const asteroidManagerRef = useRef(null);
    const [resourcesLoaded, setResourcesLoaded] = useState(false); // Add a state variable

    const handleUserInteraction = () => {
        if (musicRef.current && !musicAllowed) {
            musicRef.current.play()
                .then(() => {
                    console.log("Music started playing after user interaction");
                    setMusicAllowed(true);
                    // Remove the event listener after the first interaction
                })
                .catch(error => {
                    console.error("Error playing music:", error);
                });
        }
    };

    useEffect(() => {
        // Initialize PixiJS and set up game scene
        const app = new PIXI.Application({ resizeTo: window });
        appRef.current = app;
        containerRef.current.appendChild(app.view);

        const container = new PIXI.Container();
        app.stage.addChild(container);

        // Load resources
        const loader = new PIXI.Loader();
        loader.add("spaceship", spaceshipImage);
        loader.add("asteroid", asteroidImage);
        loader.add("background", backgroundImage);
        loader.load((loader, resources) => {
            resourcesRef.current = resources;
            setResourcesLoaded(true); // Set the state to true when resources are loaded

            // Access appRef.current here, after it's been initialized
            const background = new PIXI.Sprite(resources.background.texture);
            background.width = appRef.current.screen.width;
            background.height = appRef.current.screen.height;
            app.stage.addChildAt(background, 0);
            backgroundRef.current = background;

            // Initialize spaceship
            spaceshipRef.current = new Spaceship(resources);
            container.addChild(spaceshipRef.current.container);

            // Set up score display
            const scoreText = new PIXI.Text("Score: 0", {
                fontFamily: "Arial",
                fontSize: 36,
                fill: 0xffffff,
            });
            scoreText.x = 20;
            scoreText.y = 20;
            container.addChild(scoreText);
            scoreTextRef.current = scoreText;

            // Set up game loop
            app.ticker.add((delta) => update(delta));
        });

        // Load and set up music
        const music = new Audio(musicFile);
        music.loop = true;
        music.volume = 0.5; // Adjust volume as needed
        musicRef.current = music;

        music.addEventListener("loadeddata", () => {
            console.log("Music file loaded successfully");
        });

        music.addEventListener("error", (error) => {
            console.error("Error loading music file:", error);
        });

        // Add event listeners for user interaction
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("mousedown", handleUserInteraction);

        // Clean up on unmount
        return () => {
            app.destroy(true, { children: true });
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keydown", handleUserInteraction);
            window.removeEventListener("mousedown", handleUserInteraction);
            if (musicRef.current) {
                musicRef.current.pause(); // Pause the music
                musicRef.current.currentTime = 0; // Reset the music
            }
        };
    }, []);

    const handleKeyDown = (e) => {
        if (e.key === "ArrowLeft") {
            spaceshipRef.current.moveLeft();
        } else if (e.key === "ArrowRight") {
            spaceshipRef.current.moveRight();
        }
    };

    const update = (delta) => {
        if (gameOverRef.current) return;
        // Update asteroid manager and check collisions
        // asteroidManagerRef.current.update(delta); // No direct update call
        checkCollisions(delta);
        asteroidManagerRef.current.update(delta);
        scoreTextRef.current.text = `Score: ${Math.floor(score)}`;
        score += delta * 0.1;
    };

     

    const checkCollisions = (delta) => {
        // asteroidManagerRef.current.asteroids.forEach((asteroid) => { // Accessing asteroids through state
        setAsteroids(currentAsteroids => {
          currentAsteroids.forEach((asteroid) => {
              if (spaceshipRef.current && spaceshipRef.current.collidesWith(asteroid)) {
                  gameOverRef.current = true;
                  setGameOver(true);
                  endGame();
              }
          });
          return currentAsteroids; // Return the current state to avoid modifying it
        });

    };

    const endGame = () => {

        appRef.current.ticker.stop();
        window.removeEventListener("keydown", handleKeyDown);
        // Create a semi-transparent overlay
        const overlay = new PIXI.Graphics();
        overlay.beginFill(0x000000, 0.7);
        overlay.drawRect(0, 0, window.innerWidth, window.innerHeight);
        overlay.endFill();
        appRef.current.stage.addChild(overlay);

        // Display "Game Over" message
        const gameOverText = new PIXI.Text("Game Over", {
            fontFamily: "Arial",
            fontSize: 48,
            fill: 0xffffff,
            align: "center",
        });
        gameOverText.anchor.set(0.5);
        gameOverText.x = window.innerWidth / 2;
        gameOverText.y = window.innerHeight / 3;
        appRef.current.stage.addChild(gameOverText);
        const finalScoreText = new PIXI.Text(`Score: ${Math.floor(score)}`, {
            fontFamily: "Arial",
            fontSize: 36,
            fill: 0xffffff,
            align: "center",
        });
        finalScoreText.anchor.set(0.5);
        finalScoreText.x = window.innerWidth / 2;
        finalScoreText.y = window.innerHeight / 2 + 50;
        appRef.current.stage.addChild(finalScoreText);

        // Create a restart button
        const restartButton = new PIXI.Text("Restart", {
            fontFamily: "Arial",
            fontSize: 36,
            fill: 0xff0000,
            align: "center",
            fontWeight: "bold",
        });
        restartButton.anchor.set(0.5);
        restartButton.x = window.innerWidth / 2;
        restartButton.y = window.innerHeight / 2 + 100;
        restartButton.interactive = true;
        restartButton.buttonMode = true;
        restartButton.on("pointerdown", restartGame);
        appRef.current.stage.addChild(restartButton);
    };

    const restartGame = () => {
        appRef.current.ticker.deltaTime = 0;
        appRef.current.ticker.start();
        setGameOver(false);
        gameOverRef.current = false;
        score = 0


        // Destroy existing asteroids
        asteroids.forEach(asteroid => {
          asteroid.sprite.destroy();
      });

      // Clear the asteroids array
      setAsteroids([]);

        // Reset the game logic (spaceship, asteroids)
        spaceshipRef.current = new Spaceship(resourcesRef.current);
        appRef.current.stage.removeChildren();
        asteroidManagerRef.current.reset();

        // Clear game over display
      

        appRef.current.stage.addChild(spaceshipRef.current.container);

        const scoreText = new PIXI.Text("Score: 0", {
            fontFamily: "Arial",
            fontSize: 36,
            fill: 0xffffff,
        });
        scoreText.x = 20;
        scoreText.y = 20;
        appRef.current.stage.addChild(scoreText);
        scoreTextRef.current = scoreText;
        appRef.current.stage.addChildAt(backgroundRef.current, 0);

        window.addEventListener("keydown", handleKeyDown);

        musicRef.current.play();
    };

    return (
        <div ref={containerRef} >
            {resourcesLoaded && (
                <AsteroidManager
                    container={appRef.current?.stage}
                    resources={resourcesRef.current}
                    setAsteroids={setAsteroids}
                    ref={asteroidManagerRef}
                />
            )}
        </div>
    );
};

export default GameComponent;
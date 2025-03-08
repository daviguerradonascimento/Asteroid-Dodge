import React, { useEffect, useRef, useState } from "react";
import * as PIXI from "pixi.js";
import { Spaceship } from "./Spaceship";
import { AsteroidManager } from "./AsteroidManager";
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
  const asteroidManagerRef = useRef(null);
  const scoreTextRef = useRef(null);
  const resourcesRef = useRef(null);
  const backgroundRef = useRef(null);
  const musicRef = useRef(null); // Ref for the audio element
  const [musicAllowed, setMusicAllowed] = useState(false);

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
      const background = new PIXI.Sprite(resources.background.texture);
      background.width = app.screen.width;
      background.height = app.screen.height;
      app.stage.addChildAt(background, 0);
      backgroundRef.current = background;

      // Initialize spaceship and asteroid manager
      spaceshipRef.current = new Spaceship(resources);
      container.addChild(spaceshipRef.current.container);
      
      asteroidManagerRef.current = new AsteroidManager(container, resources);

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
    asteroidManagerRef.current.update(delta);
    checkCollisions(delta);
    scoreTextRef.current.text = `Score: ${Math.floor(score)}`;
    score += delta * 0.1;
  };

  const checkCollisions = (delta) => {
    asteroidManagerRef.current.asteroids.forEach((asteroid) => {
      if (spaceshipRef.current.collidesWith(asteroid)) {
        gameOverRef.current = true; 
        setGameOver(true);
        endGame();
      }
          
    });

  };

  const endGame = () => {
    
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
    setGameOver(false);
    gameOverRef.current = false; 
    score = 0

    // Reset the game logic (spaceship, asteroids)
    spaceshipRef.current = new Spaceship(resourcesRef.current);
    asteroidManagerRef.current = new AsteroidManager(appRef.current.stage, resourcesRef.current);

    // Clear game over display
    appRef.current.stage.removeChildren();
    
    appRef.current.stage.addChild(spaceshipRef.current.container);
    asteroidManagerRef.current.reset();

    const scoreText = new PIXI.Text("Score: 0", {
        fontFamily: "Arial",
        fontSize: 36,
        fill: 0xffffff,
      });
      scoreText.x = 20;
      scoreText.y = 20;
      appRef.current.stage.addChild(scoreText);
      scoreTextRef.current = scoreText;
      console.log(backgroundRef);
      appRef.current.stage.addChildAt(backgroundRef.current, 0);

      window.addEventListener("keydown", handleKeyDown);

      musicRef.current.play();
  };

  return <div ref={containerRef}></div>;
};

export default GameComponent;
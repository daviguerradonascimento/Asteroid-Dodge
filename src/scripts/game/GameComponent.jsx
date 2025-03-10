import React, { useEffect, useRef, useState, useCallback } from "react";
import * as PIXI from "pixi.js";
import Spaceship from "./Spaceship";
import AsteroidManager from "./AsteroidManager";
import spaceshipImage from "../../sprites/spaceship.png";
import asteroidImage from "../../sprites/asteroid.png";
import backgroundImage from "../../sprites/bg.png";
import musicFile from "../../sprites/music.mp3";

const GameComponent = () => {
    var score = 0;
    const [gameOver, setGameOver] = useState(false);
    const gameOverRef = useRef(false);
    const containerRef = useRef(null);
    const appRef = useRef(null);
    const [spaceship, setSpaceship] = useState(null);
    const spaceshipRef = useRef(null);
    const scoreTextRef = useRef(null);
    const resourcesRef = useRef(null);
    const backgroundRef = useRef(null);
    const musicRef = useRef(null);
    const [musicAllowed, setMusicAllowed] = useState(false);
    const [asteroids, setAsteroids] = useState([]);
    const asteroidManagerRef = useRef(null);
    const [resourcesLoaded, setResourcesLoaded] = useState(false);

    const handleUserInteraction = () => {
        if (musicRef.current && !musicAllowed) {
            musicRef.current.play()
                .catch(error => {
                    console.error("Error playing music:", error);
                    setMusicAllowed(true);
                });
        }
    };

    useEffect(() => {
        const app = new PIXI.Application({ resizeTo: window });
        appRef.current = app;
        containerRef.current.appendChild(app.view);

        const container = new PIXI.Container();
        app.stage.addChild(container);

        const loader = new PIXI.Loader();
        loader.add("spaceship", spaceshipImage);
        loader.add("asteroid", asteroidImage);
        loader.add("background", backgroundImage);
        loader.load((loader, resources) => {
            resourcesRef.current = resources;
            setResourcesLoaded(true);

            const background = new PIXI.Sprite(resources.background.texture);
            background.width = appRef.current.screen.width;
            background.height = appRef.current.screen.height;
            app.stage.addChildAt(background, 0);
            backgroundRef.current = background;

            const scoreText = new PIXI.Text("Score: 0", {
                fontFamily: "Arial",
                fontSize: 36,
                fill: 0xffffff,
            });
            scoreText.x = 20;
            scoreText.y = 20;
            container.addChild(scoreText);
            scoreTextRef.current = scoreText;

            app.ticker.add((delta) => update(delta));
        });

        const music = new Audio(musicFile);
        music.loop = true;
        music.volume = 0.5;
        musicRef.current = music;

        music.addEventListener("loadeddata", () => {
            console.log("Music file loaded successfully");
        });

        music.addEventListener("error", (error) => {
            console.error("Error loading music file:", error);
        });

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("mousedown", handleUserInteraction);

        return () => {
            app.destroy(true, { children: true });
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keydown", handleUserInteraction);
            if (musicRef.current) {
                musicRef.current.pause();
                musicRef.current.currentTime = 0;
            }
        };
    }, []);

    useEffect(() => {
        if (resourcesRef.current) {
            // Initialize spaceship after resources are loaded
            setSpaceship(<Spaceship
                resources={resourcesRef.current}
                ref={spaceshipRef}
            />);
        }
    }, [resourcesRef.current]);

    useEffect(() => {
        if (spaceshipRef.current) {
            // Access the container from the Spaceship component
            appRef.current.stage.addChild(spaceshipRef.current.container);
        }
    }, [spaceship]);

    const handleKeyDown = (e) => {
        if (spaceshipRef.current) {
            if (e.key === "ArrowLeft") {
                spaceshipRef.current.moveLeft();
            } else if (e.key === "ArrowRight") {
                spaceshipRef.current.moveRight();
            }
        }
    };

    const update = (delta) => {
        if (gameOverRef.current) return;
        checkCollisions(delta);
        if (asteroidManagerRef.current) {
            asteroidManagerRef.current.update(delta);
        }
        scoreTextRef.current.text = `Score: ${Math.floor(score)}`;
        score += delta * 0.1;
    };

    const checkCollisions = (delta) => {
        setAsteroids(currentAsteroids => {
            currentAsteroids.forEach((asteroid) => {
                if (spaceshipRef.current && spaceshipRef.current.collidesWith(asteroid)) {
                    gameOverRef.current = true;
                    setGameOver(true);
                    endGame();
                }
            });
            return currentAsteroids;
        });
    };

    const endGame = () => {
        appRef.current.ticker.stop();
        window.removeEventListener("keydown", handleKeyDown);

        const overlay = new PIXI.Graphics();
        overlay.beginFill(0x000000, 0.7);
        overlay.drawRect(0, 0, window.innerWidth, window.innerHeight);
        overlay.endFill();
        appRef.current.stage.addChild(overlay);

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
        score = 0;

        asteroids.forEach(asteroid => {
            asteroid.sprite.destroy();
        });

        setAsteroids([]);

        appRef.current.stage.removeChildren();
        if (spaceshipRef.current) {
            appRef.current.stage.removeChild(spaceshipRef.current.container);
        }

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
        appRef.current.stage.addChildAt(backgroundRef.current, 0);

        if (spaceshipRef.current) {
            // Access the container from the Spaceship component
            appRef.current.stage.addChild(spaceshipRef.current.container);
        }

        window.addEventListener("keydown", handleKeyDown);

        musicRef.current.play();
    };

    return (
        <div ref={containerRef} >
            {resourcesLoaded && (
                <>
                    <AsteroidManager
                        container={appRef.current?.stage}
                        resources={resourcesRef.current}
                        setAsteroids={setAsteroids}
                        ref={asteroidManagerRef}
                    />
                    {spaceship}
                </>
            )}
        </div>
    );
};

export default GameComponent;
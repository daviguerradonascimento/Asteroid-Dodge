import React, { useEffect, useRef, useImperativeHandle } from 'react';
import * as PIXI from "pixi.js";

const AsteroidManager = React.forwardRef(({ container, resources, setAsteroids }, ref) => {
    const asteroidsRef = useRef([]);
    const asteroidSpeedRef = useRef(2);
    const asteroidFrequencyRef = useRef(5);
    const elapsedTimeRef = useRef(0);
    const asteroids = [];

    useEffect(() => {
        const createAsteroids = (count) => {
            for (let i = 0; i < count; i++) {
                const asteroidSprite = new PIXI.Sprite(resources.asteroid.texture);
                asteroidSprite.anchor.set(0.5);
                asteroidSprite.x = Math.random() * window.innerWidth;
                asteroidSprite.y = -50;
                const asteroidData = { // Create an object with sprite and other properties
                    sprite: asteroidSprite,
                    speedX: (Math.random() - 0.5) * 0.2,
                    speedY: Math.random() * 2 + 3,
                    rotationSpeed: (Math.random() - 1) * 0.1
                };
                asteroids.push(asteroidData);
                container.addChild(asteroidSprite);
            }
            asteroidsRef.current = asteroids;
            setAsteroids(asteroids);
        };

        createAsteroids(asteroidFrequencyRef.current);

        return () => {
            asteroidsRef.current.forEach(asteroid => {
                container.removeChild(asteroid.sprite);
                asteroid.sprite.destroy();
            });
        };
    }, [container, resources, setAsteroids]);

    
    const update = (delta) => {
        elapsedTimeRef.current += delta;
        if (elapsedTimeRef.current > 600) {
            increaseDifficulty();
            elapsedTimeRef.current = 0;
        }

        asteroidsRef.current.forEach(asteroid => {
            asteroid.sprite.x += asteroid.speedX * delta * 100;
            asteroid.sprite.y += asteroid.speedY * delta * asteroidSpeedRef.current;
            asteroid.sprite.rotation += asteroid.rotationSpeed * delta;

            if (asteroid.sprite.x < 0 || asteroid.sprite.x > window.innerWidth) {
                asteroid.speedX = -asteroid.speedX;
            }

            if (asteroid.sprite.y > window.innerHeight + 50) {
                asteroid.sprite.x = Math.random() * window.innerWidth;
                asteroid.sprite.y = -50;
            }
        });
    };

    const increaseDifficulty = () => {
        asteroidSpeedRef.current += 0.5;
        asteroidFrequencyRef.current += 1;
        createAdditionalAsteroid(1);
    };

    const createAdditionalAsteroid = (count) => {
        for (let i = 0; i < count; i++) {
            const asteroidSprite = new PIXI.Sprite(resources.asteroid.texture);
            asteroidSprite.anchor.set(0.5);
            asteroidSprite.x = Math.random() * window.innerWidth;
            asteroidSprite.y = -50;
                const asteroidData = { // Create an object with sprite and other properties
                sprite: asteroidSprite,
                speedX: (Math.random() - 0.5) * 0.2,
                speedY: Math.random() * 2 + 3,
                rotationSpeed: (Math.random() - 1) * 0.1
            };
            asteroidsRef.current.push(asteroidData);
            container.addChild(asteroidSprite);
        }
        setAsteroids([...asteroidsRef.current]);
    };


    const reset = () => {
        asteroidsRef.current.forEach(asteroid => {
            container.removeChild(asteroid.sprite);
            asteroid.sprite.destroy();
        });
        asteroidsRef.current = [];
        asteroidSpeedRef.current = 2;
        asteroidFrequencyRef.current = 5;
        elapsedTimeRef.current = 0;
    
        const newAsteroids = []; // Create a new array to hold the new asteroids
    
        createAdditionalAsteroid(asteroidFrequencyRef.current);
    };

    useImperativeHandle(ref, () => ({
        reset: reset,
        update: update,
        createAdditionalAsteroid: createAdditionalAsteroid
    }));

    return null; // This component doesn't render anything directly
});

export default AsteroidManager;
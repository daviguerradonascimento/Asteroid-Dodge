import React, { useRef, useEffect } from "react";
import * as PIXI from "pixi.js";
import { gsap } from "gsap";

const Spaceship = ({ resources }) => {
    const containerRef = useRef(null);
    const spriteRef = useRef(null);

    useEffect(() => {
        // Create a container for the spaceship
        const container = new PIXI.Container();
        containerRef.current = container;

        // Create the spaceship sprite
        const sprite = new PIXI.Sprite(resources.spaceship.texture);  // Assuming you have a 'spaceship' sprite in your assets
        sprite.anchor.set(0.5);
        container.addChild(sprite);
        spriteRef.current = sprite;

        sprite.scale.set(0.25);

        // Set initial position
        container.x = window.innerWidth / 2;
        container.y = window.innerHeight - 100;  // Position at the bottom

        gsap.to(container, {
            y: container.y - 10,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
        console.log(resources)
        return () => {
            // Clean up resources on unmount
            container.destroy({ children: true });
        };
    }, [resources]);

    const moveLeft = () => {
        // Move the spaceship to the left, limit its movement to the window boundaries
        if (containerRef.current && containerRef.current.x > 0) {
            gsap.to(containerRef.current, {
                x: containerRef.current.x - 100,
                duration: 0.3,
                rotation: -0.1, // Tilt left
                onComplete: () => gsap.to(containerRef.current, { rotation: 0, duration: 0.2 }) // Reset rotation
            });  // Move speed with animation
        }
    };

    const moveRight = () => {
        // Move the spaceship to the right, limit its movement to the window boundaries
        if (containerRef.current && containerRef.current.x < window.innerWidth) {
            gsap.to(containerRef.current, {
                x: containerRef.current.x + 100,
                duration: 0.3,
                rotation: 0.1, // Tilt right
                onComplete: () => gsap.to(containerRef.current, { rotation: 0, duration: 0.2 }) // Reset rotation
            });  // Move speed with animation
        }
    };

    const collidesWith = (asteroid) => {
        if (!spriteRef.current || !asteroid.sprite) return false;

        const spaceshipBounds = spriteRef.current.getBounds(); // Gets the actual size after scaling
        const asteroidBounds = asteroid.sprite.getBounds();

        return (
            spaceshipBounds.x < asteroidBounds.x + asteroidBounds.width &&
            spaceshipBounds.x + spaceshipBounds.width > asteroidBounds.x &&
            spaceshipBounds.y < asteroidBounds.y + asteroidBounds.height &&
            spaceshipBounds.y + spaceshipBounds.height > asteroidBounds.y
        );
    };

    // Expose methods and container to parent
    React.useImperativeHandle(React.useRef(), () => ({
        moveLeft: moveLeft,
        moveRight: moveRight,
        collidesWith: collidesWith,
        container: containerRef.current,
    }));

    return null; // This component doesn't render any DOM elements
};

export default React.forwardRef(Spaceship);
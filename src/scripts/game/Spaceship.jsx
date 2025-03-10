import React, { useRef, useEffect, useImperativeHandle } from 'react';
import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';

const Spaceship = React.forwardRef(({ resources }, ref) => {
    const containerRef = useRef(new PIXI.Container());
    const spriteRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;

        // Create the spaceship sprite
        const sprite = new PIXI.Sprite(resources.spaceship.texture);
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

        return () => {
            // Clean up resources
            gsap.killTweensOf(container);
            container.destroy({ children: true });
        };
    }, [resources]);

    const moveLeft = () => {
        const container = containerRef.current;
        if (container.x > 0) {
            gsap.to(container, {
                x: container.x - 100,
                duration: 0.3,
                rotation: -0.1, // Tilt left
                onComplete: () => gsap.to(container, { rotation: 0, duration: 0.2 }) // Reset rotation
            });
        }
    };

    const moveRight = () => {
        const container = containerRef.current;
        if (container.x < window.innerWidth) {
            gsap.to(container, {
                x: container.x + 100,
                duration: 0.3,
                rotation: 0.1, // Tilt right
                onComplete: () => gsap.to(container, { rotation: 0, duration: 0.2 }) // Reset rotation
            });
        }
    };

    const collidesWith = (asteroid) => {
        const sprite = spriteRef.current;
        if (!sprite) return false; // Ensure sprite is available

        const spaceshipBounds = sprite.getBounds(); // Gets the actual size after scaling
        const asteroidBounds = asteroid.sprite.getBounds();
        return (
            spaceshipBounds.x < asteroidBounds.x + asteroidBounds.width &&
            spaceshipBounds.x + spaceshipBounds.width > asteroidBounds.x &&
            spaceshipBounds.y < asteroidBounds.y + asteroidBounds.height &&
            spaceshipBounds.y + spaceshipBounds.height > asteroidBounds.y
        );
    };

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
        moveLeft: moveLeft,
        moveRight: moveRight,
        collidesWith: collidesWith,
        container: containerRef.current,
    }), [moveLeft, moveRight, collidesWith]);

    return null; // This component doesn't render any visible content
});

export default Spaceship;
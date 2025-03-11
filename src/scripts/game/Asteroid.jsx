import React, { useRef, useEffect } from 'react';
import * as PIXI from "pixi.js";

const Asteroid = ({ resources }) => {
    const spriteRef = useRef(null);
    const speedXRef = useRef(0);
    const speedYRef = useRef(0);
    const rotationSpeedRef = useRef(0);

    useEffect(() => {
        const sprite = new PIXI.Sprite(resources.asteroid.texture);
        sprite.anchor.set(0.5);
        resetPosition(sprite);
        rotationSpeedRef.current = (Math.random() - 1) * 0.1;
        spriteRef.current = sprite;

        return () => {
            if (sprite && sprite.parent) {
                sprite.parent.removeChild(sprite);
            }
        };
    }, [resources]);

    const resetPosition = (sprite) => {
        sprite.x = Math.random() * window.innerWidth;
        sprite.y = -50;
        randomizeDirection(sprite);
    };

    const randomizeDirection = (sprite) => {
        speedXRef.current = (Math.random() - 0.5) * 0.2;
        speedYRef.current = Math.random() * 2 + 3;
    };

    return null; // This component doesn't render anything directly
};

export default Asteroid;
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

    const update = (delta, speed) => {
        if (!spriteRef.current) return;

        spriteRef.current.x += speedXRef.current * delta * 100;
        spriteRef.current.y += speedYRef.current * delta * speed;
        spriteRef.current.rotation += rotationSpeedRef.current * delta;

        if (spriteRef.current.x < 0 || spriteRef.current.x > window.innerWidth) {
            speedXRef.current = -speedXRef.current;
        }

        if (spriteRef.current.y > window.innerHeight + 50) {
            resetPosition(spriteRef.current);
        }
    };

    const destroy = () => {
        if (spriteRef.current && spriteRef.current.parent) {
            spriteRef.current.parent.removeChild(spriteRef.current);
        }
        spriteRef.current = null;
    };

    return null; // This component doesn't render anything directly
};

export default Asteroid;
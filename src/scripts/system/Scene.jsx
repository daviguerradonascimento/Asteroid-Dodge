import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';
import App from './App';

const Scene = ({ create, update, destroy }) => {
    const containerRef = useRef(new PIXI.Container());

    useEffect(() => {
        const container = containerRef.current;
        container.interactive = true;

        create?.(container); // Call create if it exists
        App.app.ticker.add(update, container);

        return () => {
            App.app.ticker.remove(update, container);
            destroy?.(container); // Call destroy if it exists
            container.destroy({ children: true });
        };
    }, [create, update, destroy]);

    return null; // This component doesn't render anything directly
};

export default Scene;
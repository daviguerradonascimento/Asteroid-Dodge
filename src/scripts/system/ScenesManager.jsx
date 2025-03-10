import React, { useState, useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';
import App from './App';

const ScenesManager = () => {
    const [scene, setScene] = useState(null);
    const containerRef = useRef(new PIXI.Container());

    useEffect(() => {
        const container = containerRef.current;
        container.interactive = true;

        return () => {
            // Cleanup function
            if (scene) {
                scene.remove();
            }
            container.destroy({ children: true });
        };
    }, [scene]);

    const start = (sceneName) => {
        setScene(prevScene => {
            if (prevScene) {
                prevScene.remove();
            }

            const newScene = new App.config.scenes[sceneName]();
            containerRef.current.addChild(newScene.container);
            return newScene;
        });
    };

    return (
        <React.Fragment>
            {}
        </React.Fragment>
    );
};

export default ScenesManager;
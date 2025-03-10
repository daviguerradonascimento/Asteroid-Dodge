import React, { useEffect, useState } from 'react';
import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';
import { PixiPlugin } from 'gsap/PixiPlugin';
import  Loader  from './Loader';

function Application({ config }) {
    const [app, setApp] = useState(null);
    const [scene, setScene] = useState(null);
    const [loader, setLoader] = useState(null);

    useEffect(() => {
        gsap.registerPlugin(PixiPlugin);
        PixiPlugin.registerPIXI(PIXI);

        const newApp = new PIXI.Application({ resizeTo: window });
        document.body.appendChild(newApp.view);
        setApp(newApp);

        const newLoader = new Loader(newApp.loader, config);
        setLoader(newLoader);

        newLoader.preload().then(() => {
            start(newApp, newLoader, config, setScene);
        });

        return () => {
            if (app) {
                app.destroy(true); // Clean up PIXI app on unmount
            }
        };
    }, [config]);

    const res = (key) => {
        return loader?.resources[key]?.texture;
    };

    const sprite = (key) => {
        const texture = res(key);
        return texture ? new PIXI.Sprite(texture) : null;
    };

    const renderer = () => {
        return app?.renderer;
    };

    return null; // This component doesn't render any visible content
}

function start(app, loader, config, setScene) {
    const StartScene = config["startScene"];
    const newScene = new StartScene(loader.resources);
    app.stage.addChild(newScene.container);
    setScene(newScene);
}

export default Application;
import { useEffect, useState } from 'react';

const LoaderComponent = ({ loaderConfig }) => {
    const [resources, setResources] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAssets = async () => {
            const loader = new PIXI.Loader();

            for (const asset of loaderConfig) {
                let key = asset.key.substr(asset.key.lastIndexOf('/') + 1);
                key = key.substring(0, key.indexOf('.'));
                if (asset.key.indexOf(".png") !== -1 || asset.key.indexOf(".jpg") !== -1) {
                    loader.add(key, asset.data.default);
                }
            }

            return new Promise(resolve => {
                loader.load((loader, loadedResources) => {
                    setResources(loadedResources);
                    resolve();
                });
            });
        };

        loadAssets().then(() => setLoading(false));

        return () => {
            // Clean up resources if needed
        };
    }, [loaderConfig]);

    return loading ? (
        <div>Loading...</div> // Or any loading indicator
    ) : (
        <React.Fragment>
            {/* Resources are loaded, you can access them through the `resources` state */}
        </React.Fragment>
    );
};

export default LoaderComponent;
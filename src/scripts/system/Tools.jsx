import React from 'react';

const Tools = {
    randomNumber: (min, max) => {
        if (!max) {
            max = min;
            min = 0;
        }
        return Math.floor(Math.random() * (max - min + 1) + min);
    },

    massiveRequire: (req) => {
        const files = [];
        req.keys().forEach(key => {
            files.push({
                key, data: req(key)
            });
        });
        return files;
    }
};

export default Tools;
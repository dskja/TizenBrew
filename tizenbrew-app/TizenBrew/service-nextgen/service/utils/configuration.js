"use strict";

const fs = require('fs');

function readConfig() {
    var defaultConfig = {
        modules: ["npm/@dskja/tizentube"],
        autoLaunchServiceList: [],
        autoLaunchModule: '', 
    };
    if (!fs.existsSync('/home/owner/share/tizenbrewConfig.json')) {
        return defaultConfig;
    }
    try {
        return JSON.parse(fs.readFileSync('/home/owner/share/tizenbrewConfig.json', 'utf8'));
    } catch (e) {
        console.error('Failed to parse config, using defaults:', e);
        return defaultConfig;
    }
}

function writeConfig(config) {
    try {
        fs.writeFileSync('/home/owner/share/tizenbrewConfig.json', JSON.stringify(config, null, 4));
    } catch (e) {
        console.error('Failed to write config:', e);
    }
}

module.exports = {
    readConfig,
    writeConfig
};
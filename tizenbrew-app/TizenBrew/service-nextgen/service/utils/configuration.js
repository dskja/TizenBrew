"use strict";

const fs = require('fs');
const os = require('os');
const path = require('path');

var configPath = (typeof tizen !== 'undefined')
    ? '/home/owner/share/tizenbrewConfig.json'
    : path.join(os.homedir(), 'share', 'tizenbrewConfig.json');

function readConfig() {
    var defaultConfig = {
        modules: ["gh/dskja/TizenBrew-Twitch"],
        autoLaunchServiceList: [],
        autoLaunchModule: '', 
    };
    if (!fs.existsSync(configPath)) {
        return defaultConfig;
    }
    try {
        var parsed = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        return Object.assign(defaultConfig, parsed);
    } catch (e) {
        console.error('Failed to parse config, using defaults:', e);
        return defaultConfig;
    }
}

function writeConfig(config) {
    try {
        fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
    } catch (e) {
        console.error('Failed to write config:', e);
    }
}

module.exports = {
    readConfig,
    writeConfig
};
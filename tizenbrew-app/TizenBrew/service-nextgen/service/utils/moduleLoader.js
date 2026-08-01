"use strict";

const { readConfig } = require('./configuration.js');
const fetch = require('node-fetch');

const FETCH_TIMEOUT = 15000;

function fetchWithTimeout(url, options) {
    return new Promise(function(resolve, reject) {
        var timer = setTimeout(function() {
            reject(new Error('Request timeout: ' + url));
        }, FETCH_TIMEOUT);
        fetch(url, options).then(function(res) {
            clearTimeout(timer);
            resolve(res);
        }).catch(function(err) {
            clearTimeout(timer);
            reject(err);
        });
    });
}

function loadModules() {
    const config = readConfig();
    const modules = config.modules;

    function splitModule(module) {
        var slashIdx = module.indexOf('/');
        if (slashIdx === -1) return ['', module];
        return [module.substring(0, slashIdx), module.substring(slashIdx + 1)];
    }

    const modulePromises = modules.map(module => {
        return fetchWithTimeout(`https://cdn.jsdelivr.net/${module}/package.json`)
            .then(res => {
                if (!res.ok) throw new Error(`Failed to fetch module ${module}: ${res.status}`);
                return res.json();
            })
            .then(moduleJson => {
                let moduleData;
                const splitData = splitModule(module);
                const moduleMetadata = {
                    name: splitData[1],
                    type: splitData[0]
                }
                if (moduleJson.packageType === 'app') {
                    moduleData = {
                        fullName: module,
                        appName: moduleJson.appName,
                        version: moduleJson.version,
                        name: moduleMetadata.name,
                        appPath: `http://127.0.0.1:8081/module/${encodeURIComponent(module)}/${moduleJson.appPath}`,
                        keys: moduleJson.keys ? moduleJson.keys : [],
                        moduleType: moduleMetadata.type,
                        packageType: moduleJson.packageType,
                        description: moduleJson.description,
                        serviceFile: moduleJson.serviceFile
                    }
                } else if (moduleJson.packageType === 'mods') {
                    moduleData = {
                        fullName: module,
                        appName: moduleJson.appName,
                        version: moduleJson.version,
                        name: moduleMetadata.name,
                        appPath: moduleJson.websiteURL,
                        keys: moduleJson.keys ? moduleJson.keys : [],
                        moduleType: moduleMetadata.type,
                        packageType: moduleJson.packageType,
                        description: moduleJson.description,
                        serviceFile: moduleJson.serviceFile,
                        tizenAppId: moduleJson.tizenAppId,
                        mainFile: moduleJson.main,
                        evaluateScriptOnDocumentStart: moduleJson.evaluateScriptOnDocumentStart
                    }
                } else return {
                    appName: 'Unknown Module',
                    name: moduleMetadata.name,
                    fullName: module,
                    appPath: '',
                    keys: [],
                    moduleType: moduleMetadata.type,
                    packageType: 'app',
                    description: `Unknown module ${module}. Please check the module name and try again.`
                }

                return moduleData;
            })
            .catch(e => {
                console.error(e);

                const splitData = splitModule(module);

                const moduleMetadata = {
                    name: splitData[1],
                    type: splitData[0]
                }

                return {
                    appName: 'Unknown Module',
                    name: moduleMetadata.name,
                    fullName: module,
                    appPath: '',
                    keys: [],
                    moduleType: moduleMetadata.type,
                    packageType: 'app',
                    description: `Unknown module ${module}. Please check the module name and try again.`
                }
            });
    });

    return Promise.all(modulePromises)
        .then(modules => {
            return modules;
        });
}

module.exports = loadModules;
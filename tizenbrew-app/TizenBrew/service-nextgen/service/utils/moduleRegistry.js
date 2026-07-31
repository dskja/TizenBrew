"use strict";

const fetch = require('node-fetch');

const REGISTRY_URL = 'https://raw.githubusercontent.com/dskja/TizenBrew/main/registry.json';

function browseModules(installedModuleNames) {
    return fetch(REGISTRY_URL)
        .then(res => {
            if (!res.ok) throw new Error('Failed to fetch registry: ' + res.status);
            return res.json();
        })
        .then(registry => {
            if (!registry || !registry.modules || !Array.isArray(registry.modules)) {
                return { categories: [], modules: [] };
            }
            var modulePromises = registry.modules.map(function(mod) {
                return fetch('https://cdn.jsdelivr.net/' + mod.id + '/package.json')
                    .then(function(res) {
                        if (!res.ok) throw new Error('Failed to fetch package.json for ' + mod.id);
                        return res.json();
                    })
                    .then(function(pkg) {
                        var isInstalled = installedModuleNames.indexOf(mod.id) !== -1;
                        return {
                            fullName: mod.id,
                            appName: pkg.appName || mod.name,
                            version: pkg.version,
                            description: pkg.description || mod.description,
                            category: mod.category,
                            tags: mod.tags || [],
                            featured: mod.featured || false,
                            packageType: pkg.packageType,
                            author: typeof pkg.author === 'string' ? pkg.author : (pkg.author && pkg.author.name) || 'Unknown',
                            keys: pkg.keys || [],
                            serviceFile: pkg.serviceFile,
                            websiteURL: pkg.websiteURL,
                            appPath: pkg.appPath,
                            main: pkg.main,
                            tizenAppId: pkg.tizenAppId,
                            evaluateScriptOnDocumentStart: pkg.evaluateScriptOnDocumentStart,
                            installed: isInstalled
                        };
                    })
                    .catch(function(e) {
                        return {
                            fullName: mod.id,
                            appName: mod.name,
                            version: null,
                            description: mod.description,
                            category: mod.category,
                            tags: mod.tags || [],
                            featured: mod.featured || false,
                            installed: installedModuleNames.indexOf(mod.id) !== -1,
                            error: e.message
                        };
                    });
            });
            return Promise.all(modulePromises).then(function(modules) {
                return {
                    categories: registry.categories,
                    modules: modules
                };
            });
        });
}

function checkForUpdates(installedModules) {
    var updatePromises = installedModules.map(function(module) {
        var packageName = module.fullName;
        var isNpm = packageName.indexOf('npm/') === 0;
        var isGh = packageName.indexOf('gh/') === 0;

        var fetchUrl;
        if (isNpm) {
            var npmName = packageName.substring(4);
            fetchUrl = 'https://registry.npmjs.org/' + npmName;
        } else if (isGh) {
            fetchUrl = 'https://cdn.jsdelivr.net/' + packageName + '/package.json';
        } else {
            fetchUrl = 'https://cdn.jsdelivr.net/' + packageName + '/package.json';
        }

        return fetch(fetchUrl)
            .then(function(res) {
                if (!res.ok) throw new Error('Failed to fetch version info: ' + res.status);
                if (isNpm) {
                    return res.json().then(function(regData) {
                        var latestVersion = regData['dist-tags'] && regData['dist-tags'].latest;
                        return {
                            fullName: module.fullName,
                            currentVersion: module.version,
                            latestVersion: latestVersion,
                            updateAvailable: latestVersion && module.version && latestVersion !== module.version
                        };
                    });
                } else {
                    return res.json().then(function(pkg) {
                        return {
                            fullName: module.fullName,
                            currentVersion: module.version,
                            latestVersion: pkg.version,
                            updateAvailable: pkg.version && module.version && pkg.version !== module.version
                        };
                    });
                }
            })
            .catch(function(e) {
                return {
                    fullName: module.fullName,
                    currentVersion: module.version,
                    latestVersion: null,
                    updateAvailable: false,
                    error: e.message
                };
            });
    });

    return Promise.all(updatePromises).then(function(updates) {
        return updates.filter(function(u) { return u.updateAvailable; });
    });
}

module.exports = {
    browseModules: browseModules,
    checkForUpdates: checkForUpdates
};

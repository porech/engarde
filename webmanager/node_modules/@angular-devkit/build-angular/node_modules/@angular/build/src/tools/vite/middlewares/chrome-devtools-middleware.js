"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createChromeDevtoolsMiddleware = createChromeDevtoolsMiddleware;
const node_assert_1 = __importDefault(require("node:assert"));
const node_crypto_1 = require("node:crypto");
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const CHROME_DEVTOOLS_ROUTE = '/.well-known/appspecific/com.chrome.devtools.json';
function createChromeDevtoolsMiddleware(cacheDir, projectRoot) {
    let devtoolsConfig;
    const devtoolsConfigPath = (0, node_path_1.join)(cacheDir, 'com.chrome.devtools.json');
    return function chromeDevtoolsMiddleware(req, res, next) {
        if (req.url !== CHROME_DEVTOOLS_ROUTE) {
            next();
            return;
        }
        if (!devtoolsConfig) {
            // We store the UUID and re-use it to ensure Chrome does not repeatedly ask for permissions when restarting the dev server.
            try {
                devtoolsConfig = (0, node_fs_1.readFileSync)(devtoolsConfigPath, 'utf-8');
                const devtoolsConfigJson = JSON.parse(devtoolsConfig);
                node_assert_1.default.equal(projectRoot, devtoolsConfigJson?.workspace.root);
            }
            catch {
                const devtoolsConfigJson = {
                    workspace: {
                        root: projectRoot,
                        uuid: (0, node_crypto_1.randomUUID)(),
                    },
                };
                devtoolsConfig = JSON.stringify(devtoolsConfigJson, undefined, 2);
                try {
                    (0, node_fs_1.mkdirSync)(cacheDir, { recursive: true });
                    (0, node_fs_1.writeFileSync)(devtoolsConfigPath, devtoolsConfig);
                }
                catch { }
            }
        }
        res.setHeader('Content-Type', 'application/json');
        res.end(devtoolsConfig);
    };
}

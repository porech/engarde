"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheInfoCommandModule = void 0;
const core_1 = require("@angular-devkit/core");
const fs = __importStar(require("node:fs/promises"));
const node_path_1 = require("node:path");
const command_module_1 = require("../../../command-builder/command-module");
const environment_options_1 = require("../../../utilities/environment-options");
const utilities_1 = require("../utilities");
class CacheInfoCommandModule extends command_module_1.CommandModule {
    command = 'info';
    describe = 'Prints persistent disk cache configuration and statistics in the console.';
    longDescriptionPath;
    scope = command_module_1.CommandScope.In;
    builder(localYargs) {
        return localYargs.strict();
    }
    async run() {
        const { path, environment, enabled } = (0, utilities_1.getCacheConfig)(this.context.workspace);
        this.context.logger.info(core_1.tags.stripIndents `
      Enabled: ${enabled ? 'yes' : 'no'}
      Environment: ${environment}
      Path: ${path}
      Size on disk: ${await this.getSizeOfDirectory(path)}
      Effective status on current machine: ${this.effectiveEnabledStatus() ? 'enabled' : 'disabled'}
    `);
    }
    async getSizeOfDirectory(path) {
        const directoriesStack = [path];
        let size = 0;
        while (directoriesStack.length) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const dirPath = directoriesStack.pop();
            let entries = [];
            try {
                entries = await fs.readdir(dirPath);
            }
            catch { }
            for (const entry of entries) {
                const entryPath = (0, node_path_1.join)(dirPath, entry);
                const stats = await fs.stat(entryPath);
                if (stats.isDirectory()) {
                    directoriesStack.push(entryPath);
                }
                size += stats.size;
            }
        }
        return this.formatSize(size);
    }
    formatSize(size) {
        if (size <= 0) {
            return '0 bytes';
        }
        const abbreviations = ['bytes', 'kB', 'MB', 'GB'];
        const index = Math.floor(Math.log(size) / Math.log(1024));
        const roundedSize = size / Math.pow(1024, index);
        // bytes don't have a fraction
        const fractionDigits = index === 0 ? 0 : 2;
        return `${roundedSize.toFixed(fractionDigits)} ${abbreviations[index]}`;
    }
    effectiveEnabledStatus() {
        const { enabled, environment } = (0, utilities_1.getCacheConfig)(this.context.workspace);
        if (enabled) {
            switch (environment) {
                case 'ci':
                    return environment_options_1.isCI;
                case 'local':
                    return !environment_options_1.isCI;
            }
        }
        return enabled;
    }
}
exports.CacheInfoCommandModule = CacheInfoCommandModule;

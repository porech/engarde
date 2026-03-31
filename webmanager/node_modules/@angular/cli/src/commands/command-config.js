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
exports.RootCommandsAliases = exports.RootCommands = void 0;
exports.RootCommands = {
    'add': {
        factory: () => Promise.resolve().then(() => __importStar(require('./add/cli'))),
    },
    'analytics': {
        factory: () => Promise.resolve().then(() => __importStar(require('./analytics/cli'))),
    },
    'build': {
        factory: () => Promise.resolve().then(() => __importStar(require('./build/cli'))),
        aliases: ['b'],
    },
    'cache': {
        factory: () => Promise.resolve().then(() => __importStar(require('./cache/cli'))),
    },
    'completion': {
        factory: () => Promise.resolve().then(() => __importStar(require('./completion/cli'))),
    },
    'config': {
        factory: () => Promise.resolve().then(() => __importStar(require('./config/cli'))),
    },
    'deploy': {
        factory: () => Promise.resolve().then(() => __importStar(require('./deploy/cli'))),
    },
    'e2e': {
        factory: () => Promise.resolve().then(() => __importStar(require('./e2e/cli'))),
        aliases: ['e'],
    },
    'extract-i18n': {
        factory: () => Promise.resolve().then(() => __importStar(require('./extract-i18n/cli'))),
    },
    'generate': {
        factory: () => Promise.resolve().then(() => __importStar(require('./generate/cli'))),
        aliases: ['g'],
    },
    'lint': {
        factory: () => Promise.resolve().then(() => __importStar(require('./lint/cli'))),
    },
    'make-this-awesome': {
        factory: () => Promise.resolve().then(() => __importStar(require('./make-this-awesome/cli'))),
    },
    'mcp': {
        factory: () => Promise.resolve().then(() => __importStar(require('./mcp/cli'))),
    },
    'new': {
        factory: () => Promise.resolve().then(() => __importStar(require('./new/cli'))),
        aliases: ['n'],
    },
    'run': {
        factory: () => Promise.resolve().then(() => __importStar(require('./run/cli'))),
    },
    'serve': {
        factory: () => Promise.resolve().then(() => __importStar(require('./serve/cli'))),
        aliases: ['dev', 's'],
    },
    'test': {
        factory: () => Promise.resolve().then(() => __importStar(require('./test/cli'))),
        aliases: ['t'],
    },
    'update': {
        factory: () => Promise.resolve().then(() => __importStar(require('./update/cli'))),
    },
    'version': {
        factory: () => Promise.resolve().then(() => __importStar(require('./version/cli'))),
        aliases: ['v'],
    },
};
exports.RootCommandsAliases = Object.values(exports.RootCommands).reduce((prev, current) => {
    current.aliases?.forEach((alias) => {
        prev[alias] = current;
    });
    return prev;
}, {});

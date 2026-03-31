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
exports.MissingFileReplacementException = void 0;
exports.normalizeFileReplacements = normalizeFileReplacements;
const node_fs_1 = require("node:fs");
const path = __importStar(require("node:path"));
class MissingFileReplacementException extends Error {
    constructor(path) {
        super(`The ${path} path in file replacements does not exist.`);
    }
}
exports.MissingFileReplacementException = MissingFileReplacementException;
function normalizeFileReplacements(fileReplacements, workspaceRoot) {
    if (fileReplacements.length === 0) {
        return [];
    }
    const normalizedReplacement = fileReplacements.map((replacement) => normalizeFileReplacement(replacement, workspaceRoot));
    for (const { replace, with: replacementWith } of normalizedReplacement) {
        if (!(0, node_fs_1.existsSync)(replacementWith)) {
            throw new MissingFileReplacementException(replacementWith);
        }
        if (!(0, node_fs_1.existsSync)(replace)) {
            throw new MissingFileReplacementException(replace);
        }
    }
    return normalizedReplacement;
}
function normalizeFileReplacement(fileReplacement, root) {
    let replacePath;
    let withPath;
    if (fileReplacement.src && fileReplacement.replaceWith) {
        replacePath = fileReplacement.src;
        withPath = fileReplacement.replaceWith;
    }
    else if (fileReplacement.replace && fileReplacement.with) {
        replacePath = fileReplacement.replace;
        withPath = fileReplacement.with;
    }
    else {
        throw new Error(`Invalid file replacement: ${JSON.stringify(fileReplacement)}`);
    }
    return {
        replace: path.join(root, replacePath),
        with: path.join(root, withPath),
    };
}

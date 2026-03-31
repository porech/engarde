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
exports.migrateTestFile = migrateTestFile;
exports.searchForGlobalZoneless = searchForGlobalZoneless;
const fs = __importStar(require("node:fs"));
const promises_1 = require("node:fs/promises");
const node_path_1 = require("node:path");
const prompts_1 = require("./prompts");
const ts_utils_1 = require("./ts_utils");
async function migrateTestFile(sourceFile) {
    const ts = await (0, ts_utils_1.loadTypescript)();
    // Check if tests use zoneless either by default through `initTestEnvironment` or by explicitly calling `provideZonelessChangeDetection`.
    let testsUseZonelessChangeDetection = await searchForGlobalZoneless(sourceFile.fileName);
    if (!testsUseZonelessChangeDetection) {
        ts.forEachChild(sourceFile, function visit(node) {
            if (ts.isCallExpression(node) &&
                node.expression.getText(sourceFile) === 'provideZonelessChangeDetection') {
                testsUseZonelessChangeDetection = true;
                return;
            }
            ts.forEachChild(node, visit);
        });
    }
    if (!testsUseZonelessChangeDetection) {
        // Tests do not use zoneless, so we provide instructions to set it up.
        return (0, prompts_1.createProvideZonelessForTestsSetupPrompt)(sourceFile.fileName);
    }
    // At this point, tests are using zoneless, so we look for any explicit uses of `provideZoneChangeDetection` that need to be fixed.
    return (0, prompts_1.createFixResponseForZoneTests)(sourceFile);
}
async function searchForGlobalZoneless(startPath) {
    const angularJsonDir = findAngularJsonDir(startPath);
    if (!angularJsonDir) {
        // Cannot determine project root, fallback to original behavior or assume false.
        // For now, let's assume no global setup if angular.json is not found.
        return false;
    }
    try {
        const files = (0, promises_1.glob)(`${angularJsonDir}/**/*.ts`);
        for await (const file of files) {
            const content = fs.readFileSync(file, 'utf-8');
            if (content.includes('initTestEnvironment') &&
                content.includes('provideZonelessChangeDetection')) {
                return true;
            }
        }
    }
    catch (e) {
        return false;
    }
    return false;
}
function findAngularJsonDir(startDir) {
    let currentDir = startDir;
    while (true) {
        if (fs.existsSync((0, node_path_1.join)(currentDir, 'angular.json'))) {
            return currentDir;
        }
        const parentDir = (0, node_path_1.dirname)(currentDir);
        if (parentDir === currentDir) {
            return null;
        }
        currentDir = parentDir;
    }
}

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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addDependency = exports.InstallBehavior = exports.ExistingBehavior = exports.DependencyType = exports.AngularBuilder = exports.writeWorkspace = exports.updateWorkspace = exports.readWorkspace = void 0;
// Workspace related rules and types
var workspace_1 = require("./workspace");
Object.defineProperty(exports, "readWorkspace", { enumerable: true, get: function () { return workspace_1.getWorkspace; } });
Object.defineProperty(exports, "updateWorkspace", { enumerable: true, get: function () { return workspace_1.updateWorkspace; } });
Object.defineProperty(exports, "writeWorkspace", { enumerable: true, get: function () { return workspace_1.writeWorkspace; } });
var workspace_models_1 = require("./workspace-models");
Object.defineProperty(exports, "AngularBuilder", { enumerable: true, get: function () { return workspace_models_1.Builders; } });
__exportStar(require("./standalone"), exports);
// Package dependency related rules and types
var dependency_1 = require("./dependency");
Object.defineProperty(exports, "DependencyType", { enumerable: true, get: function () { return dependency_1.DependencyType; } });
Object.defineProperty(exports, "ExistingBehavior", { enumerable: true, get: function () { return dependency_1.ExistingBehavior; } });
Object.defineProperty(exports, "InstallBehavior", { enumerable: true, get: function () { return dependency_1.InstallBehavior; } });
Object.defineProperty(exports, "addDependency", { enumerable: true, get: function () { return dependency_1.addDependency; } });

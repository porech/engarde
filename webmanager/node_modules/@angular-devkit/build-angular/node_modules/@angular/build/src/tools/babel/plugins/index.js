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
exports.markTopLevelPure = exports.elideAngularMetadata = exports.adjustTypeScriptEnums = exports.adjustStaticMembers = void 0;
var adjust_static_class_members_1 = require("./adjust-static-class-members");
Object.defineProperty(exports, "adjustStaticMembers", { enumerable: true, get: function () { return __importDefault(adjust_static_class_members_1).default; } });
var adjust_typescript_enums_1 = require("./adjust-typescript-enums");
Object.defineProperty(exports, "adjustTypeScriptEnums", { enumerable: true, get: function () { return __importDefault(adjust_typescript_enums_1).default; } });
var elide_angular_metadata_1 = require("./elide-angular-metadata");
Object.defineProperty(exports, "elideAngularMetadata", { enumerable: true, get: function () { return __importDefault(elide_angular_metadata_1).default; } });
var pure_toplevel_functions_1 = require("./pure-toplevel-functions");
Object.defineProperty(exports, "markTopLevelPure", { enumerable: true, get: function () { return __importDefault(pure_toplevel_functions_1).default; } });

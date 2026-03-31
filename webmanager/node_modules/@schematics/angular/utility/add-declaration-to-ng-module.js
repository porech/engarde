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
exports.addDeclarationToNgModule = addDeclarationToNgModule;
const schematics_1 = require("@angular-devkit/schematics");
const ts = __importStar(require("../third_party/github.com/Microsoft/TypeScript/lib/typescript"));
const ast_utils_1 = require("./ast-utils");
const change_1 = require("./change");
const find_module_1 = require("./find-module");
function addDeclarationToNgModule(options) {
    return (host) => {
        const modulePath = options.module;
        if (options.skipImport || options.standalone || !modulePath) {
            return host;
        }
        const typeSeparator = options.typeSeparator ?? '.';
        const sourceText = host.readText(modulePath);
        const source = ts.createSourceFile(modulePath, sourceText, ts.ScriptTarget.Latest, true);
        const filePath = `/${options.path}/` +
            (options.flat ? '' : schematics_1.strings.dasherize(options.name) + '/') +
            schematics_1.strings.dasherize(options.name) +
            (options.type ? typeSeparator + schematics_1.strings.dasherize(options.type) : '');
        const importPath = (0, find_module_1.buildRelativePath)(modulePath, filePath);
        const classifiedName = schematics_1.strings.classify(options.name) + (options.type ? schematics_1.strings.classify(options.type) : '');
        const changes = (0, ast_utils_1.addDeclarationToModule)(source, modulePath, classifiedName, importPath);
        if (options.export) {
            changes.push(...(0, ast_utils_1.addSymbolToNgModuleMetadata)(source, modulePath, 'exports', classifiedName));
        }
        const recorder = host.beginUpdate(modulePath);
        for (const change of changes) {
            if (change instanceof change_1.InsertChange) {
                recorder.insertLeft(change.pos, change.toAdd);
            }
        }
        host.commitUpdate(recorder);
        return host;
    };
}

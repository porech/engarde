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
exports.default = default_1;
const schematics_1 = require("@angular-devkit/schematics");
const posix_1 = require("node:path/posix");
const typescript_1 = __importDefault(require("../third_party/github.com/Microsoft/TypeScript/lib/typescript"));
const ast_utils_1 = require("../utility/ast-utils");
const change_1 = require("../utility/change");
const ng_ast_utils_1 = require("../utility/ng-ast-utils");
const project_targets_1 = require("../utility/project-targets");
const util_1 = require("../utility/standalone/util");
const workspace_1 = require("../utility/workspace");
function getSourceFile(host, path) {
    const content = host.readText(path);
    const source = typescript_1.default.createSourceFile(path, content, typescript_1.default.ScriptTarget.Latest, true);
    return source;
}
function getServerModulePath(host, sourceRoot, mainPath) {
    const mainSource = getSourceFile(host, (0, posix_1.join)(sourceRoot, mainPath));
    const allNodes = (0, ast_utils_1.getSourceNodes)(mainSource);
    const expNode = allNodes.find((node) => typescript_1.default.isExportDeclaration(node));
    if (!expNode) {
        return null;
    }
    const relativePath = expNode.moduleSpecifier;
    const modulePath = (0, posix_1.join)(sourceRoot, `${relativePath.text}.ts`);
    return modulePath;
}
function getComponentTemplateInfo(host, componentPath) {
    const compSource = getSourceFile(host, componentPath);
    const compMetadata = (0, ast_utils_1.getDecoratorMetadata)(compSource, 'Component', '@angular/core')[0];
    return {
        templateProp: getMetadataProperty(compMetadata, 'template'),
        templateUrlProp: getMetadataProperty(compMetadata, 'templateUrl'),
    };
}
function getComponentTemplate(host, compPath, tmplInfo) {
    let template = '';
    if (tmplInfo.templateProp) {
        template = tmplInfo.templateProp.getFullText();
    }
    else if (tmplInfo.templateUrlProp) {
        const templateUrl = tmplInfo.templateUrlProp.initializer.text;
        const dir = (0, posix_1.dirname)(compPath);
        const templatePath = (0, posix_1.join)(dir, templateUrl);
        try {
            template = host.readText(templatePath);
        }
        catch { }
    }
    return template;
}
function getBootstrapComponentPath(host, mainPath) {
    let bootstrappingFilePath;
    let bootstrappingSource;
    let componentName;
    if ((0, ng_ast_utils_1.isStandaloneApp)(host, mainPath)) {
        // Standalone Application
        const bootstrapCall = (0, util_1.findBootstrapApplicationCall)(host, mainPath);
        componentName = bootstrapCall.arguments[0].getText();
        bootstrappingFilePath = mainPath;
        bootstrappingSource = getSourceFile(host, mainPath);
    }
    else {
        // NgModule Application
        const modulePath = (0, ng_ast_utils_1.getAppModulePath)(host, mainPath);
        const moduleSource = getSourceFile(host, modulePath);
        const metadataNode = (0, ast_utils_1.getDecoratorMetadata)(moduleSource, 'NgModule', '@angular/core')[0];
        const bootstrapProperty = getMetadataProperty(metadataNode, 'bootstrap');
        const arrLiteral = bootstrapProperty.initializer;
        componentName = arrLiteral.elements[0].getText();
        bootstrappingSource = moduleSource;
        bootstrappingFilePath = modulePath;
    }
    const componentRelativeFilePath = (0, ast_utils_1.getSourceNodes)(bootstrappingSource)
        .filter(typescript_1.default.isImportDeclaration)
        .filter((imp) => {
        return (0, ast_utils_1.findNode)(imp, typescript_1.default.SyntaxKind.Identifier, componentName);
    })
        .map((imp) => {
        const pathStringLiteral = imp.moduleSpecifier;
        return pathStringLiteral.text;
    })[0];
    return (0, posix_1.join)((0, posix_1.dirname)(bootstrappingFilePath), componentRelativeFilePath + '.ts');
}
// end helper functions.
function validateProject(mainPath) {
    return (host) => {
        const routerOutletCheckRegex = /<router-outlet.*?>([\s\S]*?)(?:<\/router-outlet>)?/;
        const componentPath = getBootstrapComponentPath(host, mainPath);
        const tmpl = getComponentTemplateInfo(host, componentPath);
        const template = getComponentTemplate(host, componentPath, tmpl);
        if (!routerOutletCheckRegex.test(template)) {
            throw new schematics_1.SchematicsException(`Prerequisite for application shell is to define a router-outlet in your root component.`);
        }
    };
}
function getMetadataProperty(metadata, propertyName) {
    const properties = metadata.properties;
    const property = properties.filter(typescript_1.default.isPropertyAssignment).filter((prop) => {
        const name = prop.name;
        switch (name.kind) {
            case typescript_1.default.SyntaxKind.Identifier:
                return name.getText() === propertyName;
            case typescript_1.default.SyntaxKind.StringLiteral:
                return name.text === propertyName;
        }
        return false;
    })[0];
    return property;
}
function addServerRoutingConfig(options, isStandalone) {
    return async (host) => {
        const workspace = await (0, workspace_1.getWorkspace)(host);
        const project = workspace.projects.get(options.project);
        if (!project) {
            throw new schematics_1.SchematicsException(`Project name "${options.project}" doesn't not exist.`);
        }
        const configFilePath = isStandalone
            ? (0, posix_1.join)(project.sourceRoot ?? 'src', 'app/app.config.server.ts')
            : getServerModulePath(host, project.sourceRoot || 'src', 'main.server.ts');
        if (!configFilePath || !host.exists(configFilePath)) {
            throw new schematics_1.SchematicsException(`Cannot find "${configFilePath}".`);
        }
        let recorder = host.beginUpdate(configFilePath);
        const configSourceFile = getSourceFile(host, configFilePath);
        const functionCall = (0, ast_utils_1.findNodes)(configSourceFile, typescript_1.default.isCallExpression, 
        /** max */ undefined, 
        /** recursive */ true).find((n) => typescript_1.default.isIdentifier(n.expression) && n.expression.getText() === 'provideServerRendering');
        if (!functionCall) {
            throw new schematics_1.SchematicsException(`Cannot find the "provideServerRendering" function call in "${configFilePath}".`);
        }
        recorder = host.beginUpdate(configFilePath);
        recorder.insertLeft(functionCall.end - 1, `, withAppShell(AppShell)`);
        (0, change_1.applyToUpdateRecorder)(recorder, [
            (0, ast_utils_1.insertImport)(configSourceFile, configFilePath, 'withAppShell', '@angular/ssr'),
            (0, ast_utils_1.insertImport)(configSourceFile, configFilePath, 'AppShell', './app-shell/app-shell'),
        ]);
        host.commitUpdate(recorder);
    };
}
function default_1(options) {
    return async (tree) => {
        const browserEntryPoint = await (0, util_1.getMainFilePath)(tree, options.project);
        const isStandalone = (0, ng_ast_utils_1.isStandaloneApp)(tree, browserEntryPoint);
        const workspace = await (0, workspace_1.getWorkspace)(tree);
        const project = workspace.projects.get(options.project);
        if (!project) {
            throw (0, project_targets_1.targetBuildNotFoundError)();
        }
        return (0, schematics_1.chain)([
            validateProject(browserEntryPoint),
            (0, schematics_1.schematic)('server', options),
            addServerRoutingConfig(options, isStandalone),
            (0, schematics_1.schematic)('component', {
                name: 'app-shell',
                module: 'app.module.server.ts',
                project: options.project,
                standalone: isStandalone,
            }),
        ]);
    };
}

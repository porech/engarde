"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Builders = exports.ProjectType = void 0;
var ProjectType;
(function (ProjectType) {
    ProjectType["Application"] = "application";
    ProjectType["Library"] = "library";
})(ProjectType || (exports.ProjectType = ProjectType = {}));
/**
 * An enum of the official Angular builders.
 * Each enum value provides the fully qualified name of the associated builder.
 * This enum can be used when analyzing the `builder` fields of project configurations from the
 * `angular.json` workspace file.
 */
var Builders;
(function (Builders) {
    Builders["Application"] = "@angular-devkit/build-angular:application";
    Builders["AppShell"] = "@angular-devkit/build-angular:app-shell";
    Builders["Server"] = "@angular-devkit/build-angular:server";
    Builders["Browser"] = "@angular-devkit/build-angular:browser";
    Builders["SsrDevServer"] = "@angular-devkit/build-angular:ssr-dev-server";
    Builders["Prerender"] = "@angular-devkit/build-angular:prerender";
    Builders["BrowserEsbuild"] = "@angular-devkit/build-angular:browser-esbuild";
    Builders["Karma"] = "@angular-devkit/build-angular:karma";
    Builders["BuildKarma"] = "@angular/build:karma";
    Builders["TsLint"] = "@angular-devkit/build-angular:tslint";
    Builders["NgPackagr"] = "@angular-devkit/build-angular:ng-packagr";
    Builders["BuildNgPackagr"] = "@angular/build:ng-packagr";
    Builders["DevServer"] = "@angular-devkit/build-angular:dev-server";
    Builders["BuildDevServer"] = "@angular/build:dev-server";
    Builders["ExtractI18n"] = "@angular-devkit/build-angular:extract-i18n";
    Builders["BuildExtractI18n"] = "@angular/build:extract-i18n";
    Builders["Protractor"] = "@angular-devkit/build-angular:private-protractor";
    Builders["BuildApplication"] = "@angular/build:application";
})(Builders || (exports.Builders = Builders = {}));

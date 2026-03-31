"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertCompatibleAngularVersion = assertCompatibleAngularVersion;
/* eslint-disable no-console */
const node_module_1 = require("node:module");
const semver_1 = require("semver");
function assertCompatibleAngularVersion(projectRoot) {
    let angularPkgJson;
    // Create a custom require function for ESM compliance.
    // NOTE: The trailing slash is significant.
    const projectRequire = (0, node_module_1.createRequire)(projectRoot + '/');
    try {
        angularPkgJson = projectRequire('@angular/core/package.json');
    }
    catch {
        console.error('Error: It appears that "@angular/core" is missing as a dependency. Please ensure it is included in your project.');
        process.exit(2);
    }
    if (!angularPkgJson?.['version']) {
        console.error('Error: Unable to determine the versions of "@angular/core".\n' +
            'This likely indicates a corrupted local installation. Please try reinstalling your packages.');
        process.exit(2);
    }
    const supportedAngularSemver = '^20.0.0';
    if (angularPkgJson['version'] === '0.0.0' || supportedAngularSemver.startsWith('0.0.0')) {
        // Internal CLI and FW testing version.
        return;
    }
    const angularVersion = new semver_1.SemVer(angularPkgJson['version']);
    if (!(0, semver_1.satisfies)(angularVersion, supportedAngularSemver, { includePrerelease: true })) {
        console.error(`Error: The current version of "@angular/build" supports Angular versions ${supportedAngularSemver},\n` +
            `but detected Angular version ${angularVersion} instead.\n` +
            'Please visit the link below to find instructions on how to update Angular.\nhttps://update.angular.dev/');
        process.exit(3);
    }
}

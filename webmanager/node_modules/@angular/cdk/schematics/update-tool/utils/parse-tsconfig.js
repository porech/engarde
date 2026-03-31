"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TsconfigParseError = void 0;
exports.parseTsconfigFile = parseTsconfigFile;
const ts = require("typescript");
const virtual_host_1 = require("./virtual-host");
const path_1 = require("path");
const diagnostics_1 = require("./diagnostics");
/** Code of the error raised by TypeScript when a tsconfig doesn't match any files. */
const NO_INPUTS_ERROR_CODE = 18003;
/** Class capturing a tsconfig parse error. */
class TsconfigParseError extends Error {
}
exports.TsconfigParseError = TsconfigParseError;
/**
 * Attempts to parse the specified tsconfig file.
 *
 * @throws {TsconfigParseError} If the tsconfig could not be read or parsed.
 */
function parseTsconfigFile(tsconfigPath, fileSystem) {
    if (!fileSystem.fileExists(tsconfigPath)) {
        throw new TsconfigParseError(`Tsconfig cannot not be read: ${tsconfigPath}`);
    }
    const { config, error } = ts.readConfigFile(tsconfigPath, p => fileSystem.read(fileSystem.resolve(p)));
    // If there is a config reading error, we never attempt to parse the config.
    if (error) {
        throw new TsconfigParseError((0, diagnostics_1.formatDiagnostics)([error], fileSystem));
    }
    const parsed = ts.parseJsonConfigFileContent(config, new virtual_host_1.FileSystemHost(fileSystem), (0, path_1.dirname)(tsconfigPath), {});
    // Skip the "No inputs found..." error since we don't want to interrupt the migration if a
    // tsconfig doesn't match a file. This will result in an empty `Program` which is still valid.
    const errors = parsed.errors.filter(diag => diag.code !== NO_INPUTS_ERROR_CODE);
    if (errors.length) {
        throw new TsconfigParseError((0, diagnostics_1.formatDiagnostics)(errors, fileSystem));
    }
    return parsed;
}
//# sourceMappingURL=parse-tsconfig.js.map
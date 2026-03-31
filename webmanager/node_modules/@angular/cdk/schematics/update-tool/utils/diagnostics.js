"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDiagnostics = formatDiagnostics;
const ts = require("typescript");
const virtual_host_1 = require("./virtual-host");
/** Formats the specified diagnostics with respect to the given file system. */
function formatDiagnostics(diagnostics, fileSystem) {
    const formatHost = (0, virtual_host_1.createFormatDiagnosticHost)(fileSystem);
    return ts.formatDiagnosticsWithColorAndContext(diagnostics, formatHost);
}
//# sourceMappingURL=diagnostics.js.map
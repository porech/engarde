"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoopCompilation = exports.createAngularCompilation = exports.DiagnosticModes = exports.AngularCompilation = void 0;
var angular_compilation_1 = require("./angular-compilation");
Object.defineProperty(exports, "AngularCompilation", { enumerable: true, get: function () { return angular_compilation_1.AngularCompilation; } });
Object.defineProperty(exports, "DiagnosticModes", { enumerable: true, get: function () { return angular_compilation_1.DiagnosticModes; } });
var factory_1 = require("./factory");
Object.defineProperty(exports, "createAngularCompilation", { enumerable: true, get: function () { return factory_1.createAngularCompilation; } });
var noop_compilation_1 = require("./noop-compilation");
Object.defineProperty(exports, "NoopCompilation", { enumerable: true, get: function () { return noop_compilation_1.NoopCompilation; } });

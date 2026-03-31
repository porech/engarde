"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobDoesNotExistException = exports.JobNameAlreadyRegisteredException = void 0;
const core_1 = require("@angular-devkit/core");
class JobNameAlreadyRegisteredException extends core_1.BaseException {
    constructor(name) {
        super(`Job named ${JSON.stringify(name)} already exists.`);
    }
}
exports.JobNameAlreadyRegisteredException = JobNameAlreadyRegisteredException;
class JobDoesNotExistException extends core_1.BaseException {
    constructor(name) {
        super(`Job name ${JSON.stringify(name)} does not exist.`);
    }
}
exports.JobDoesNotExistException = JobDoesNotExistException;

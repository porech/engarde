"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileEmitterCollection = exports.FileEmitterRegistration = exports.AngularPluginSymbol = void 0;
exports.AngularPluginSymbol = Symbol.for('@ngtools/webpack[angular-compiler]');
class FileEmitterRegistration {
    #fileEmitter;
    update(emitter) {
        this.#fileEmitter = emitter;
    }
    emit(file) {
        if (!this.#fileEmitter) {
            throw new Error('Emit attempted before Angular Webpack plugin initialization.');
        }
        return this.#fileEmitter(file);
    }
}
exports.FileEmitterRegistration = FileEmitterRegistration;
class FileEmitterCollection {
    #registrations = [];
    register() {
        const registration = new FileEmitterRegistration();
        this.#registrations.push(registration);
        return registration;
    }
    async emit(file) {
        if (this.#registrations.length === 1) {
            return this.#registrations[0].emit(file);
        }
        for (const registration of this.#registrations) {
            const result = await registration.emit(file);
            if (result) {
                return result;
            }
        }
    }
}
exports.FileEmitterCollection = FileEmitterCollection;

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
exports.Spinner = void 0;
const ora_1 = __importDefault(require("ora"));
const color_1 = require("./color");
const tty_1 = require("./tty");
class Spinner {
    spinner;
    /** When false, only fail messages will be displayed. */
    enabled = true;
    #isTTY = (0, tty_1.isTTY)();
    constructor(text) {
        this.spinner = (0, ora_1.default)({
            text: text === undefined ? undefined : text + '\n',
            // The below 2 options are needed because otherwise CTRL+C will be delayed
            // when the underlying process is sync.
            hideCursor: false,
            discardStdin: false,
            isEnabled: this.#isTTY,
        });
    }
    set text(text) {
        this.spinner.text = text;
    }
    get isSpinning() {
        return this.spinner.isSpinning || !this.#isTTY;
    }
    succeed(text) {
        if (this.enabled) {
            this.spinner.succeed(text);
        }
    }
    fail(text) {
        this.spinner.fail(text && color_1.colors.redBright(text));
    }
    stop() {
        this.spinner.stop();
    }
    start(text) {
        if (this.enabled) {
            this.spinner.start(text);
        }
    }
}
exports.Spinner = Spinner;

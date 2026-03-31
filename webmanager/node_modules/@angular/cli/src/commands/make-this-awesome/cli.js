"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const command_module_1 = require("../../command-builder/command-module");
const color_1 = require("../../utilities/color");
class AwesomeCommandModule extends command_module_1.CommandModule {
    command = 'make-this-awesome';
    describe = false;
    deprecated = false;
    longDescriptionPath;
    builder(localYargs) {
        return localYargs;
    }
    run() {
        const pickOne = (of) => of[Math.floor(Math.random() * of.length)];
        const phrase = pickOne([
            `You're on it, there's nothing for me to do!`,
            `Let's take a look... nope, it's all good!`,
            `You're doing fine.`,
            `You're already doing great.`,
            `Nothing to do; already awesome. Exiting.`,
            `Error 418: As Awesome As Can Get.`,
            `I spy with my little eye a great developer!`,
            `Noop... already awesome.`,
        ]);
        this.context.logger.info(color_1.colors.green(phrase));
    }
}
exports.default = AwesomeCommandModule;

"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsPackageSafelist = void 0;
exports.isPackageNameSafeForAnalytics = isPackageNameSafeForAnalytics;
exports.setAnalyticsConfig = setAnalyticsConfig;
exports.promptAnalytics = promptAnalytics;
exports.getAnalyticsUserId = getAnalyticsUserId;
exports.getAnalyticsInfoString = getAnalyticsInfoString;
const core_1 = require("@angular-devkit/core");
const node_crypto_1 = require("node:crypto");
const color_1 = require("../utilities/color");
const config_1 = require("../utilities/config");
const environment_options_1 = require("../utilities/environment-options");
const prompt_1 = require("../utilities/prompt");
const tty_1 = require("../utilities/tty");
/* eslint-disable no-console */
/**
 * This is the ultimate safelist for checking if a package name is safe to report to analytics.
 */
exports.analyticsPackageSafelist = [
    /^@angular\//,
    /^@angular-devkit\//,
    /^@nguniversal\//,
    '@schematics/angular',
];
function isPackageNameSafeForAnalytics(name) {
    return exports.analyticsPackageSafelist.some((pattern) => {
        if (typeof pattern == 'string') {
            return pattern === name;
        }
        else {
            return pattern.test(name);
        }
    });
}
/**
 * Set analytics settings. This does not work if the user is not inside a project.
 * @param global Which config to use. "global" for user-level, and "local" for project-level.
 * @param value Either a user ID, true to generate a new User ID, or false to disable analytics.
 */
async function setAnalyticsConfig(global, value) {
    const level = global ? 'global' : 'local';
    const workspace = await (0, config_1.getWorkspace)(level);
    if (!workspace) {
        throw new Error(`Could not find ${level} workspace.`);
    }
    const cli = (workspace.extensions['cli'] ??= {});
    if (!workspace || !core_1.json.isJsonObject(cli)) {
        throw new Error(`Invalid config found at ${workspace.filePath}. CLI should be an object.`);
    }
    cli.analytics = value === true ? (0, node_crypto_1.randomUUID)() : value;
    await workspace.save();
}
/**
 * Prompt the user for usage gathering permission.
 * @param force Whether to ask regardless of whether or not the user is using an interactive shell.
 * @return Whether or not the user was shown a prompt.
 */
async function promptAnalytics(context, global, force = false) {
    const level = global ? 'global' : 'local';
    const workspace = await (0, config_1.getWorkspace)(level);
    if (!workspace) {
        throw new Error(`Could not find a ${level} workspace. Are you in a project?`);
    }
    if (force || (0, tty_1.isTTY)()) {
        const answer = await (0, prompt_1.askConfirmation)(`
Would you like to share pseudonymous usage data about this project with the Angular Team
at Google under Google's Privacy Policy at https://policies.google.com/privacy. For more
details and how to change this setting, see https://angular.dev/cli/analytics.

  `, false);
        await setAnalyticsConfig(global, answer);
        if (answer) {
            console.log('');
            console.log(core_1.tags.stripIndent `
         Thank you for sharing pseudonymous usage data. Should you change your mind, the following
         command will disable this feature entirely:

             ${color_1.colors.yellow(`ng analytics disable${global ? ' --global' : ''}`)}
       `);
            console.log('');
        }
        process.stderr.write(await getAnalyticsInfoString(context));
        return true;
    }
    return false;
}
/**
 * Get the analytics user id.
 *
 * @returns
 * - `string` user id.
 * - `false` when disabled.
 * - `undefined` when not configured.
 */
async function getAnalyticsUserIdForLevel(level) {
    if (environment_options_1.analyticsDisabled) {
        return false;
    }
    const workspace = await (0, config_1.getWorkspace)(level);
    const analyticsConfig = workspace?.getCli()?.['analytics'];
    if (analyticsConfig === false) {
        return false;
    }
    else if (analyticsConfig === undefined || analyticsConfig === null) {
        return undefined;
    }
    else {
        if (typeof analyticsConfig == 'string') {
            return analyticsConfig;
        }
        else if (typeof analyticsConfig == 'object' && typeof analyticsConfig['uid'] == 'string') {
            return analyticsConfig['uid'];
        }
        return undefined;
    }
}
async function getAnalyticsUserId(context, skipPrompt = false) {
    const { workspace } = context;
    // Global config takes precedence over local config only for the disabled check.
    // IE:
    // global: disabled & local: enabled = disabled
    // global: id: 123 & local: id: 456 = 456
    // check global
    const globalConfig = await getAnalyticsUserIdForLevel('global');
    if (globalConfig === false) {
        return undefined;
    }
    // Not disabled globally, check locally or not set globally and command is run outside of workspace example: `ng new`
    if (workspace || globalConfig === undefined) {
        const level = workspace ? 'local' : 'global';
        let localOrGlobalConfig = await getAnalyticsUserIdForLevel(level);
        if (localOrGlobalConfig === undefined) {
            if (!skipPrompt) {
                // config is unset, prompt user.
                // TODO: This should honor the `no-interactive` option.
                // It is currently not an `ng` option but rather only an option for specific commands.
                // The concept of `ng`-wide options are needed to cleanly handle this.
                await promptAnalytics(context, !workspace /** global */);
                localOrGlobalConfig = await getAnalyticsUserIdForLevel(level);
            }
        }
        if (localOrGlobalConfig === false) {
            return undefined;
        }
        else if (typeof localOrGlobalConfig === 'string') {
            return localOrGlobalConfig;
        }
    }
    return globalConfig;
}
function analyticsConfigValueToHumanFormat(value) {
    if (value === false) {
        return 'disabled';
    }
    else if (typeof value === 'string' || value === true) {
        return 'enabled';
    }
    else {
        return 'not set';
    }
}
async function getAnalyticsInfoString(context) {
    const analyticsInstance = await getAnalyticsUserId(context, true /** skipPrompt */);
    const { globalConfiguration, workspace: localWorkspace } = context;
    const globalSetting = globalConfiguration?.getCli()?.['analytics'];
    const localSetting = localWorkspace?.getCli()?.['analytics'];
    return (core_1.tags.stripIndents `
     Global setting: ${analyticsConfigValueToHumanFormat(globalSetting)}
     Local setting: ${localWorkspace
        ? analyticsConfigValueToHumanFormat(localSetting)
        : 'No local workspace configuration file.'}
     Effective status: ${analyticsInstance ? 'enabled' : 'disabled'}
   ` + '\n');
}

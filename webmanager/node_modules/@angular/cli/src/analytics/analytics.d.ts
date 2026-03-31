/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import type { CommandContext } from '../command-builder/command-module';
/**
 * This is the ultimate safelist for checking if a package name is safe to report to analytics.
 */
export declare const analyticsPackageSafelist: (string | RegExp)[];
export declare function isPackageNameSafeForAnalytics(name: string): boolean;
/**
 * Set analytics settings. This does not work if the user is not inside a project.
 * @param global Which config to use. "global" for user-level, and "local" for project-level.
 * @param value Either a user ID, true to generate a new User ID, or false to disable analytics.
 */
export declare function setAnalyticsConfig(global: boolean, value: string | boolean): Promise<void>;
/**
 * Prompt the user for usage gathering permission.
 * @param force Whether to ask regardless of whether or not the user is using an interactive shell.
 * @return Whether or not the user was shown a prompt.
 */
export declare function promptAnalytics(context: CommandContext, global: boolean, force?: boolean): Promise<boolean>;
export declare function getAnalyticsUserId(context: CommandContext, skipPrompt?: boolean): Promise<string | undefined>;
export declare function getAnalyticsInfoString(context: CommandContext): Promise<string>;

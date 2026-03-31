/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
/** Disables all analytics reporting when the `NG_CLI_ANALYTICS` environment variable is set to '0' or 'false'. */
export declare const analyticsDisabled: boolean;
/** Identifies when the CLI is running in a Continuous Integration environment. */
export declare const isCI: boolean;
/** Disables the automatic version check when the `NG_DISABLE_VERSION_CHECK` environment variable is enabled. */
export declare const disableVersionCheck: boolean;
/** Enables debugging messages when the `NG_DEBUG` environment variable is enabled. */
export declare const ngDebug: boolean;
/**
 * Forces the autocomplete script to be generated.
 * The `NG_FORCE_AUTOCOMPLETE` environment variable can be 'true', 'false', or undefined (for default behavior).
 */
export declare const forceAutocomplete: boolean | undefined;
/**
 * When enabled, forces TTY mode.
 * The `NG_FORCE_TTY` environment variable can be 'true', 'false', or undefined (for default behavior).
 */
export declare const forceTty: boolean | undefined;

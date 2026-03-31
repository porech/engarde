/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import ts from 'typescript';
import { BazelAndG3Options, DiagnosticOptions, I18nOptions, LegacyNgcOptions, MiscOptions, TypeCheckingOptions, TargetOptions } from './public_options';
/**
 * Non-public options which are useful during testing of the compiler.
 */
export interface TestOnlyOptions {
    /**
     * Enable the Language Service APIs for template type-checking for tests.
     */
    _enableTemplateTypeChecker?: boolean;
    /**
     * Whether components that are poisoned should still be processed.
     * E.g. for generation of type check blocks and diagnostics.
     */
    _compilePoisonedComponents?: boolean;
    /**
     * An option to enable ngtsc's internal performance tracing.
     *
     * This should be a path to a JSON file where trace information will be written. This is sensitive
     * to the compiler's working directory, and should likely be an absolute path.
     *
     * This is currently not exposed to users as the trace format is still unstable.
     */
    tracePerformance?: string;
}
/**
 * Internal only options for compiler.
 */
export interface InternalOptions {
    /**
     * Whether to check the event side of two-way bindings.
     */
    _checkTwoWayBoundEvents?: boolean;
    /**
     * Whether this is a compilation of Angular core itself.
     *
     * By default, we detect this automatically based on the existence of `r3_symbols.ts`
     * in the compilation, but there are other test targets within the `core` package that
     * import e.g. `Component` relatively and should be detected by the compiler.
     */
    _isAngularCoreCompilation?: boolean;
}
/**
 * A merged interface of all of the various Angular compiler options, as well as the standard
 * `ts.CompilerOptions`.
 *
 * Also includes a few miscellaneous options.
 */
export interface NgCompilerOptions extends ts.CompilerOptions, LegacyNgcOptions, BazelAndG3Options, DiagnosticOptions, TypeCheckingOptions, TestOnlyOptions, I18nOptions, TargetOptions, InternalOptions, MiscOptions {
    [prop: string]: any;
}

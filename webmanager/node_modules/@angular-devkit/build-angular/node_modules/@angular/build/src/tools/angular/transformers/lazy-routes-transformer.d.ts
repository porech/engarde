/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import ts from 'typescript';
/**
 * A transformer factory that adds a property to the lazy-loaded route object.
 * This property is used to allow for the retrieval of the module path during SSR.
 *
 * @param compilerOptions The compiler options.
 * @param compilerHost The compiler host.
 * @returns A transformer factory.
 *
 * @example
 * **Before:**
 * ```ts
 * const routes: Routes = [
 *   {
 *     path: 'lazy',
 *     loadChildren: () => import('./lazy/lazy.module').then(m => m.LazyModule)
 *   }
 * ];
 * ```
 *
 * **After:**
 * ```ts
 * const routes: Routes = [
 *   {
 *     path: 'lazy',
 *     loadChildren: () => import('./lazy/lazy.module').then(m => m.LazyModule),
 *     ...(typeof ngServerMode !== "undefined" && ngServerMode ? { ɵentryName: "./lazy/lazy.module.ts" }: {})
 *   }
 * ];
 * ```
 */
export declare function lazyRoutesTransformer(compilerOptions: ts.CompilerOptions, compilerHost: ts.CompilerHost): ts.TransformerFactory<ts.SourceFile>;

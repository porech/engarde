/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { Tree } from '@angular-devkit/schematics';
/** Data resolved for a bootstrapped component. */
interface BootstrappedComponentData {
    /** Original name of the component class. */
    componentName: string;
    /** Path under which the component was imported in the main entrypoint. */
    componentImportPathInSameFile: string;
    /** Original name of the NgModule being bootstrapped, null if the app isn't module-based. */
    moduleName: string | null;
    /**
     * Path under which the module was imported in the main entrypoint,
     * null if the app isn't module-based.
     */
    moduleImportPathInSameFile: string | null;
}
/**
 * Finds the original name and path relative to the `main.ts` of the bootrstrapped app component.
 * @param tree File tree in which to look for the component.
 * @param mainFilePath Path of the `main` file.
 */
export declare function resolveBootstrappedComponentData(tree: Tree, mainFilePath: string): BootstrappedComponentData | null;
export {};

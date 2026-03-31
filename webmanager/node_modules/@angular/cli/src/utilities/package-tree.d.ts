/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { NgAddSaveDependency } from './package-metadata';
interface PackageJson {
    name: string;
    version: string;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    peerDependencies?: Record<string, string>;
    optionalDependencies?: Record<string, string>;
    'ng-update'?: {
        migrations?: string;
    };
    'ng-add'?: {
        save?: NgAddSaveDependency;
    };
}
export interface PackageTreeNode {
    name: string;
    version: string;
    path: string;
    package: PackageJson | undefined;
}
export declare function readPackageJson(packageJsonPath: string): Promise<PackageJson | undefined>;
export declare function findPackageJson(workspaceDir: string, packageName: string): string | undefined;
export declare function getProjectDependencies(dir: string): Promise<Map<string, PackageTreeNode>>;
export {};

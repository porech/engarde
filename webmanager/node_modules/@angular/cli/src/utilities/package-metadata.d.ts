/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { logging } from '@angular-devkit/core';
import type { Manifest, Packument } from 'pacote';
export interface PackageMetadata extends Packument, NgPackageManifestProperties {
    tags: Record<string, PackageManifest>;
    versions: Record<string, PackageManifest>;
}
export interface NpmRepositoryPackageJson extends PackageMetadata {
    requestedName?: string;
}
export type NgAddSaveDependency = 'dependencies' | 'devDependencies' | boolean;
export interface PackageIdentifier {
    type: 'git' | 'tag' | 'version' | 'range' | 'file' | 'directory' | 'remote';
    name: string;
    scope: string | null;
    registry: boolean;
    raw: string;
    fetchSpec: string;
    rawSpec: string;
}
export interface NgPackageManifestProperties {
    'ng-add'?: {
        save?: NgAddSaveDependency;
    };
    'ng-update'?: {
        migrations?: string;
        packageGroup?: string[] | Record<string, string>;
        packageGroupName?: string;
        requirements?: string[] | Record<string, string>;
    };
}
export interface PackageManifest extends Manifest, NgPackageManifestProperties {
    deprecated?: boolean;
}
export declare function fetchPackageMetadata(name: string, logger: logging.LoggerApi, options?: {
    registry?: string;
    usingYarn?: boolean;
    verbose?: boolean;
}): Promise<PackageMetadata>;
export declare function fetchPackageManifest(name: string, logger: logging.LoggerApi, options?: {
    registry?: string;
    usingYarn?: boolean;
    verbose?: boolean;
}): Promise<PackageManifest>;
export declare function getNpmPackageJson(packageName: string, logger: logging.LoggerApi, options?: {
    registry?: string;
    usingYarn?: boolean;
    verbose?: boolean;
}): Promise<Partial<NpmRepositoryPackageJson>>;

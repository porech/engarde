/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { CompilerOptions } from 'typescript';
import type { Resolver } from 'webpack';
export interface TypeScriptPathsPluginOptions extends Pick<CompilerOptions, 'paths' | 'baseUrl'> {
}
type ResolverRequest = NonNullable<Parameters<Parameters<Resolver['resolve']>[4]>[2]>;
interface PathPluginResolverRequest extends ResolverRequest {
    context?: {
        issuer?: string;
    };
    typescriptPathMapped?: boolean;
}
export declare class TypeScriptPathsPlugin {
    private baseUrl?;
    private patterns?;
    constructor(options?: TypeScriptPathsPluginOptions);
    /**
     * Update the plugin with new path mapping option values.
     * The options will also be preprocessed to reduce the overhead of individual resolve actions
     * during a build.
     *
     * @param options The `paths` and `baseUrl` options from TypeScript's `CompilerOptions`.
     */
    update(options: TypeScriptPathsPluginOptions): void;
    apply(resolver: Resolver): void;
    findReplacements(originalRequest: string): IterableIterator<string>;
    createReplacementRequests(request: PathPluginResolverRequest, originalRequest: string): IterableIterator<PathPluginResolverRequest>;
}
export {};

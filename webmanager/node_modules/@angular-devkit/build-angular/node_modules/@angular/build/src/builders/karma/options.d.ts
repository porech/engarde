/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import type { BuilderContext } from '@angular-devkit/architect';
import { Schema as KarmaBuilderOptions } from './schema';
export type NormalizedKarmaBuilderOptions = ReturnType<typeof normalizeOptions>;
export declare function normalizeOptions(context: BuilderContext, options: KarmaBuilderOptions): {
    sourceMap: import("./schema").SourceMapUnion | undefined;
    karmaConfig: string | undefined;
    reporters: string[] | undefined;
    browsers: string[] | undefined;
    watch: boolean;
    include: string[];
    exclude: string[];
    aot?: boolean;
    assets?: import("./schema").AssetPattern[];
    codeCoverage?: boolean;
    codeCoverageExclude?: string[];
    define?: {
        [key: string]: string;
    };
    externalDependencies?: string[];
    fileReplacements?: import("./schema").FileReplacement[];
    inlineStyleLanguage?: import("./schema").InlineStyleLanguage;
    loader?: {
        [key: string]: any;
    };
    main?: string;
    poll?: number;
    polyfills?: string[];
    preserveSymlinks?: boolean;
    progress?: boolean;
    scripts?: import("./schema").ScriptElement[];
    stylePreprocessorOptions?: import("./schema").StylePreprocessorOptions;
    styles?: import("./schema").StyleElement[];
    tsConfig: string;
    webWorkerTsConfig?: string;
};

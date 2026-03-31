/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import type { CompilerOptions } from '@angular/compiler-cli';
import type { Compiler } from 'webpack';
export declare const imageDomains: Set<string>;
export interface AngularWebpackPluginOptions {
    tsconfig: string;
    compilerOptions?: CompilerOptions;
    fileReplacements: Record<string, string>;
    substitutions: Record<string, string>;
    directTemplateLoading: boolean;
    emitClassMetadata: boolean;
    emitNgModuleScope: boolean;
    emitSetClassDebugInfo?: boolean;
    jitMode: boolean;
    inlineStyleFileExtension?: string;
}
export declare class AngularWebpackPlugin {
    private readonly pluginOptions;
    private compilerCliModule?;
    private compilerCliToolingModule?;
    private watchMode?;
    private ngtscNextProgram?;
    private builder?;
    private sourceFileCache?;
    private webpackCache?;
    private webpackCreateHash?;
    private readonly fileDependencies;
    private readonly requiredFilesToEmit;
    private readonly requiredFilesToEmitCache;
    private readonly fileEmitHistory;
    constructor(options?: Partial<AngularWebpackPluginOptions>);
    private get compilerCli();
    private get compilerCliTooling();
    get options(): AngularWebpackPluginOptions;
    apply(compiler: Compiler): void;
    private setupCompilation;
    private registerWithCompilation;
    private markResourceUsed;
    private rebuildRequiredFiles;
    private loadConfiguration;
    private updateAotProgram;
    private updateJitProgram;
    private createFileEmitter;
    private initializeCompilerCli;
    private addFileEmitHistory;
    private getFileEmitHistory;
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
/**
 * Rewrites imports of symbols being written into generated code.
 */
export interface ImportRewriter {
    /**
     * Optionally rewrite a reference to an imported symbol, changing either the binding prefix or the
     * symbol name itself.
     */
    rewriteSymbol(symbol: string, specifier: string): string;
    /**
     * Optionally rewrite the given module specifier in the context of a given file.
     */
    rewriteSpecifier(specifier: string, inContextOfFile: string): string;
    /**
     * Optionally rewrite the identifier of a namespace import.
     */
    rewriteNamespaceImportIdentifier(specifier: string, moduleName: string): string;
}
/**
 * `ImportRewriter` that does no rewriting.
 */
export declare class NoopImportRewriter implements ImportRewriter {
    rewriteSymbol(symbol: string, specifier: string): string;
    rewriteSpecifier(specifier: string, inContextOfFile: string): string;
    rewriteNamespaceImportIdentifier(specifier: string): string;
}
/**
 * `ImportRewriter` that rewrites imports from '@angular/core' to be imported from the r3_symbols.ts
 * file instead.
 */
export declare class R3SymbolsImportRewriter implements ImportRewriter {
    private r3SymbolsPath;
    constructor(r3SymbolsPath: string);
    rewriteSymbol(symbol: string, specifier: string): string;
    rewriteSpecifier(specifier: string, inContextOfFile: string): string;
    rewriteNamespaceImportIdentifier(specifier: string): string;
}
export declare function validateAndRewriteCoreSymbol(name: string): string;

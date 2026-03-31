/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { Rule } from '@angular-devkit/schematics';
/** Generated code that hasn't been interpolated yet. */
export interface PendingCode {
    /** Code that will be inserted. */
    expression: string;
    /** Imports that need to be added to the file in which the code is inserted. */
    imports: PendingImports;
}
/** Map keeping track of imports and aliases under which they're referred to in an expression. */
type PendingImports = Map<string, Map<string, string>>;
/**
 * Callback invoked by a Rule that produces the code
 * that needs to be inserted somewhere in the app.
 */
export type CodeBlockCallback = (block: CodeBlock) => PendingCode;
/**
 * Utility class used to generate blocks of code that
 * can be inserted by the devkit into a user's app.
 */
export declare class CodeBlock {
    private _imports;
    /** Function used to tag a code block in order to produce a `PendingCode` object. */
    code: (strings: TemplateStringsArray, ...params: unknown[]) => PendingCode;
    /**
     * Used inside of a code block to mark external symbols and which module they should be imported
     * from. When the code is inserted, the required import statements will be produced automatically.
     * @param symbolName Name of the external symbol.
     * @param moduleName Module from which the symbol should be imported.
     */
    external: (symbolName: string, moduleName: string) => string;
    /**
     * Produces the necessary rules to transform a `PendingCode` object into valid code.
     * @param initialCode Code pending transformed.
     * @param filePath Path of the file in which the code will be inserted.
     */
    static transformPendingCode(initialCode: PendingCode, filePath: string): {
        code: {
            /** Code that will be inserted. */
            expression: string;
            /** Imports that need to be added to the file in which the code is inserted. */
            imports: PendingImports;
        };
        rules: Rule[];
    };
}
export {};

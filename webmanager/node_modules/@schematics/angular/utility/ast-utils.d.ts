/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import * as ts from '../third_party/github.com/Microsoft/TypeScript/lib/typescript';
import { Change } from './change';
/**
 * Add Import `import { symbolName } from fileName` if the import doesn't exit
 * already. Assumes fileToEdit can be resolved and accessed.
 * @param fileToEdit File we want to add import to.
 * @param symbolName Item to import.
 * @param fileName Path to the file.
 * @param isDefault If true, import follows style for importing default exports.
 * @param alias Alias that the symbol should be inserted under.
 * @return Change
 */
export declare function insertImport(source: ts.SourceFile, fileToEdit: string, symbolName: string, fileName: string, isDefault?: boolean, alias?: string): Change;
/**
 * Find all nodes from the AST in the subtree of node of SyntaxKind kind.
 * @param node
 * @param kind
 * @param max The maximum number of items to return.
 * @param recursive Continue looking for nodes of kind recursive until end
 * the last child even when node of kind has been found.
 * @return all nodes of kind, or [] if none is found
 */
export declare function findNodes(node: ts.Node, kind: ts.SyntaxKind, max?: number, recursive?: boolean): ts.Node[];
/**
 * Find all nodes from the AST in the subtree that satisfy a type guard.
 * @param node
 * @param guard
 * @param max The maximum number of items to return.
 * @param recursive Continue looking for nodes of kind recursive until end
 * the last child even when node of kind has been found.
 * @return all nodes that satisfy the type guard, or [] if none is found
 */
export declare function findNodes<T extends ts.Node>(node: ts.Node, guard: (node: ts.Node) => node is T, max?: number, recursive?: boolean): T[];
/**
 * Get all the nodes from a source.
 * @param sourceFile The source file object.
 * @returns {Array<ts.Node>} An array of all the nodes in the source.
 */
export declare function getSourceNodes(sourceFile: ts.SourceFile): ts.Node[];
export declare function findNode(node: ts.Node, kind: ts.SyntaxKind, text: string): ts.Node | null;
/**
 * Insert `toInsert` after the last occurence of `ts.SyntaxKind[nodes[i].kind]`
 * or after the last of occurence of `syntaxKind` if the last occurence is a sub child
 * of ts.SyntaxKind[nodes[i].kind] and save the changes in file.
 *
 * @param nodes insert after the last occurence of nodes
 * @param toInsert string to insert
 * @param file file to insert changes into
 * @param fallbackPos position to insert if toInsert happens to be the first occurence
 * @param syntaxKind the ts.SyntaxKind of the subchildren to insert after
 * @return Change instance
 * @throw Error if toInsert is first occurence but fall back is not set
 */
export declare function insertAfterLastOccurrence(nodes: ts.Node[] | ts.NodeArray<ts.Node>, toInsert: string, file: string, fallbackPos: number, syntaxKind?: ts.SyntaxKind): Change;
export declare function getDecoratorMetadata(source: ts.SourceFile, identifier: string, module: string): ts.Node[];
export declare function getMetadataField(node: ts.ObjectLiteralExpression, metadataField: string): ts.PropertyAssignment[];
export declare function addSymbolToNgModuleMetadata(source: ts.SourceFile, ngModulePath: string, metadataField: string, symbolName: string, importPath?: string | null): Change[];
/**
 * Custom function to insert a declaration (component, pipe, directive)
 * into NgModule declarations. It also imports the component.
 */
export declare function addDeclarationToModule(source: ts.SourceFile, modulePath: string, classifiedName: string, importPath: string): Change[];
/**
 * Custom function to insert an NgModule into NgModule imports. It also imports the module.
 */
export declare function addImportToModule(source: ts.SourceFile, modulePath: string, classifiedName: string, importPath: string): Change[];
/**
 * Custom function to insert a provider into NgModule. It also imports it.
 */
export declare function addProviderToModule(source: ts.SourceFile, modulePath: string, classifiedName: string, importPath: string): Change[];
/**
 * Custom function to insert an export into NgModule. It also imports it.
 */
export declare function addExportToModule(source: ts.SourceFile, modulePath: string, classifiedName: string, importPath: string): Change[];
/**
 * Custom function to insert an export into NgModule. It also imports it.
 */
export declare function addBootstrapToModule(source: ts.SourceFile, modulePath: string, classifiedName: string, importPath: string): Change[];
/**
 * Determine if an import already exists.
 */
export declare function isImported(source: ts.SourceFile, classifiedName: string, importPath: string): boolean;
/**
 * Returns the RouterModule declaration from NgModule metadata, if any.
 */
export declare function getRouterModuleDeclaration(source: ts.SourceFile): ts.Expression | undefined;
/**
 * Adds a new route declaration to a router module (i.e. has a RouterModule declaration)
 */
export declare function addRouteDeclarationToModule(source: ts.SourceFile, fileToAdd: string, routeLiteral: string): Change;
/**
 * Determines if a SourceFile has a top-level declaration whose name matches a specific symbol.
 * Can be used to avoid conflicts when inserting new imports into a file.
 * @param sourceFile File in which to search.
 * @param symbolName Name of the symbol to search for.
 * @param skipModule Path of the module that the symbol may have been imported from. Used to
 * avoid false positives where the same symbol we're looking for may have been imported.
 */
export declare function hasTopLevelIdentifier(sourceFile: ts.SourceFile, symbolName: string, skipModule?: string | null): boolean;

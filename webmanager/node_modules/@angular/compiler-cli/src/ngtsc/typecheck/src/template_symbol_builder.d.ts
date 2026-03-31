/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { AST, TmplAstComponent, TmplAstDirective, TmplAstElement, TmplAstLetDeclaration, TmplAstNode, TmplAstReference, TmplAstTemplate, TmplAstVariable } from '@angular/compiler';
import ts from 'typescript';
import { AbsoluteFsPath } from '../../file_system';
import { ComponentScopeReader } from '../../scope';
import { ElementSymbol, LetDeclarationSymbol, ReferenceSymbol, SelectorlessComponentSymbol, SelectorlessDirectiveSymbol, Symbol, TemplateSymbol, VariableSymbol } from '../api';
import { TypeCheckData } from './context';
/**
 * Generates and caches `Symbol`s for various template structures for a given component.
 *
 * The `SymbolBuilder` internally caches the `Symbol`s it creates, and must be destroyed and
 * replaced if the component's template changes.
 */
export declare class SymbolBuilder {
    private readonly tcbPath;
    private readonly tcbIsShim;
    private readonly typeCheckBlock;
    private readonly typeCheckData;
    private readonly componentScopeReader;
    private readonly getTypeChecker;
    private symbolCache;
    constructor(tcbPath: AbsoluteFsPath, tcbIsShim: boolean, typeCheckBlock: ts.Node, typeCheckData: TypeCheckData, componentScopeReader: ComponentScopeReader, getTypeChecker: () => ts.TypeChecker);
    getSymbol(node: TmplAstTemplate | TmplAstElement): TemplateSymbol | ElementSymbol | null;
    getSymbol(node: TmplAstReference | TmplAstVariable | TmplAstLetDeclaration): ReferenceSymbol | VariableSymbol | LetDeclarationSymbol | null;
    getSymbol(node: TmplAstComponent): SelectorlessComponentSymbol | null;
    getSymbol(node: TmplAstDirective): SelectorlessDirectiveSymbol | null;
    getSymbol(node: AST | TmplAstNode): Symbol | null;
    private getSymbolOfAstTemplate;
    private getSymbolOfElement;
    private getSymbolOfSelectorlessComponent;
    private getSymbolOfSelectorlessDirective;
    private getDirectivesOfNode;
    private addHostDirectiveSymbols;
    private getDirectiveMeta;
    private getDirectiveModule;
    private getSymbolOfBoundEvent;
    private getSymbolOfInputBinding;
    private getDirectiveSymbolForAccessExpression;
    private getSymbolOfVariable;
    private getSymbolOfReference;
    private getSymbolOfLetDeclaration;
    private getSymbolOfPipe;
    private getSymbolOfTemplateExpression;
    private getSymbolOfTsNode;
    private getTcbPositionForNode;
}

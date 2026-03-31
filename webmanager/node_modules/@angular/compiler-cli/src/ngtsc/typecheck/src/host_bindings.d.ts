/*!
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { TmplAstHostElement } from '@angular/compiler';
import ts from 'typescript';
import { ClassDeclaration } from '../../reflection';
/**
 * Creates an AST node that represents the host element of a directive.
 * Can return null if there are no valid bindings to be checked.
 * @param type Whether the host element is for a directive or a component.
 * @param selector Selector of the directive.
 * @param sourceNode Class declaration for the directive.
 * @param literal `host` object literal from the decorator.
 * @param bindingDecorators `HostBinding` decorators discovered on the node.
 * @param listenerDecorators `HostListener` decorators discovered on the node.
 */
export declare function createHostElement(type: 'component' | 'directive', selector: string | null, sourceNode: ClassDeclaration, literal: ts.ObjectLiteralExpression | null, bindingDecorators: Iterable<ts.Decorator>, listenerDecorators: Iterable<ts.Decorator>): TmplAstHostElement | null;
/**
 * Creates an AST node that can be used as a guard in `if` statements to distinguish TypeScript
 * nodes used for checking host bindings from ones used for checking templates.
 */
export declare function createHostBindingsBlockGuard(): ts.Expression;
/**
 * Determines if a given node is a guard that indicates that descendant nodes are used to check
 * host bindings.
 */
export declare function isHostBindingsBlockGuard(node: ts.Node): boolean;

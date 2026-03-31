/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import ts from 'typescript';
import { AbsoluteFsPath } from '../../file_system';
import { ClassDeclaration } from '../../reflection';
/**
 * Represents an resource for a component and contains the `AbsoluteFsPath`
 * to the file which was resolved by evaluating the `ts.Expression` (generally, a relative or
 * absolute string path to the resource).
 *
 * If the resource is inline, the `path` will be `null`.
 */
export interface Resource {
    path: AbsoluteFsPath | null;
    node: ts.Node;
}
export interface ExternalResource extends Resource {
    path: AbsoluteFsPath;
}
export declare function isExternalResource(resource: Resource): resource is ExternalResource;
/**
 * Represents the either inline or external resources of a directive.
 *
 * A resource with a `path` of `null` is considered inline.
 * The template will be present for components, but will be null for directives.
 */
export interface DirectiveResources {
    template: Resource | null;
    styles: ReadonlySet<Resource> | null;
    hostBindings: ReadonlySet<Resource> | null;
}
/**
 * Tracks the mapping between external resources and the directives(s) which use them.
 *
 * This information is produced during analysis of the program and is used mainly to support
 * external tooling, for which such a mapping is challenging to determine without compiler
 * assistance.
 */
export declare class ResourceRegistry {
    private externalTemplateToComponentsMap;
    private componentToTemplateMap;
    private componentToStylesMap;
    private externalStyleToComponentsMap;
    private directiveToHostBindingsMap;
    getComponentsWithTemplate(template: AbsoluteFsPath): ReadonlySet<ClassDeclaration>;
    registerResources(resources: DirectiveResources, directive: ClassDeclaration): void;
    private registerTemplate;
    getTemplate(component: ClassDeclaration): Resource | null;
    private registerStyle;
    getStyles(component: ClassDeclaration): Set<Resource>;
    getComponentsWithStyle(styleUrl: AbsoluteFsPath): ReadonlySet<ClassDeclaration>;
    getHostBindings(directive: ClassDeclaration): ReadonlySet<Resource> | null;
}

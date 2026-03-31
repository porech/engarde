/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { InterpolationConfig, ParsedTemplate, ParseSourceFile, TmplAstNode } from '@angular/compiler';
import ts from 'typescript';
import { FatalDiagnosticError } from '../../../diagnostics';
import { DependencyTracker } from '../../../incremental/api';
import { Resource } from '../../../metadata';
import { PartialEvaluator } from '../../../partial_evaluator';
import { ClassDeclaration, DeclarationNode, Decorator } from '../../../reflection';
import { CompilationMode } from '../../../transform';
import { SourceMapping } from '../../../typecheck/api';
import { ResourceLoader } from '../../common';
/**
 * The literal style url extracted from the decorator, along with metadata for diagnostics.
 */
export interface StyleUrlMeta {
    url: string;
    expression: ts.Expression;
    source: ResourceTypeForDiagnostics.StylesheetFromTemplate | ResourceTypeForDiagnostics.StylesheetFromDecorator;
}
/**
 * Information about the origin of a resource in the application code. This is used for creating
 * diagnostics, so we can point to the root cause of an error in the application code.
 *
 * A template resource comes from the `templateUrl` property on the component decorator.
 *
 * Stylesheets resources can come from either the `styleUrls` property on the component decorator,
 * or from inline `style` tags and style links on the external template.
 */
export declare const enum ResourceTypeForDiagnostics {
    Template = 0,
    StylesheetFromTemplate = 1,
    StylesheetFromDecorator = 2
}
/**
 * Information about the template which was extracted during parsing.
 *
 * This contains the actual parsed template as well as any metadata collected during its parsing,
 * some of which might be useful for re-parsing the template with different options.
 */
export interface ParsedComponentTemplate extends ParsedTemplate {
    /**
     * The template AST, parsed in a manner which preserves source map information for diagnostics.
     *
     * Not useful for emit.
     */
    diagNodes: TmplAstNode[];
    /**
     * The `ParseSourceFile` for the template.
     */
    file: ParseSourceFile;
}
export interface ParsedTemplateWithSource extends ParsedComponentTemplate {
    /** The string contents of the template. */
    content: string;
    sourceMapping: SourceMapping;
    declaration: TemplateDeclaration;
}
/**
 * Common fields extracted from the declaration of a template.
 */
interface CommonTemplateDeclaration {
    preserveWhitespaces: boolean;
    interpolationConfig: InterpolationConfig;
    templateUrl: string;
    resolvedTemplateUrl: string;
}
/**
 * Information extracted from the declaration of an inline template.
 */
export interface InlineTemplateDeclaration extends CommonTemplateDeclaration {
    isInline: true;
    expression: ts.Expression;
}
/**
 * Information extracted from the declaration of an external template.
 */
export interface ExternalTemplateDeclaration extends CommonTemplateDeclaration {
    isInline: false;
    templateUrlExpression: ts.Expression;
}
/**
 * The declaration of a template extracted from a component decorator.
 *
 * This data is extracted and stored separately to facilitate re-interpreting the template
 * declaration whenever the compiler is notified of a change to a template file. With this
 * information, `ComponentDecoratorHandler` is able to re-read the template and update the component
 * record without needing to parse the original decorator again.
 */
export type TemplateDeclaration = InlineTemplateDeclaration | ExternalTemplateDeclaration;
/** Determines the node to use for debugging purposes for the given TemplateDeclaration. */
export declare function getTemplateDeclarationNodeForError(declaration: TemplateDeclaration): ts.Expression;
export interface ExtractTemplateOptions {
    usePoisonedData: boolean;
    enableI18nLegacyMessageIdFormat: boolean;
    i18nNormalizeLineEndingsInICUs: boolean;
    enableBlockSyntax: boolean;
    enableLetSyntax: boolean;
    enableSelectorless: boolean;
    preserveSignificantWhitespace?: boolean;
}
export declare function extractTemplate(node: ClassDeclaration, template: TemplateDeclaration, evaluator: PartialEvaluator, depTracker: DependencyTracker | null, resourceLoader: ResourceLoader, options: ExtractTemplateOptions, compilationMode: CompilationMode): ParsedTemplateWithSource;
export declare function createEmptyTemplate(componentClass: ClassDeclaration, component: Map<string, ts.Expression>, containingFile: string): ParsedTemplateWithSource;
export declare function parseTemplateDeclaration(node: ClassDeclaration, decorator: Decorator, component: Map<string, ts.Expression>, containingFile: string, evaluator: PartialEvaluator, depTracker: DependencyTracker | null, resourceLoader: ResourceLoader, defaultPreserveWhitespaces: boolean): TemplateDeclaration;
export declare function preloadAndParseTemplate(evaluator: PartialEvaluator, resourceLoader: ResourceLoader, depTracker: DependencyTracker | null, preanalyzeTemplateCache: Map<DeclarationNode, ParsedTemplateWithSource>, node: ClassDeclaration, decorator: Decorator, component: Map<string, ts.Expression>, containingFile: string, defaultPreserveWhitespaces: boolean, options: ExtractTemplateOptions, compilationMode: CompilationMode): Promise<ParsedTemplateWithSource | null>;
export declare function makeResourceNotFoundError(file: string, nodeForError: ts.Node, resourceType: ResourceTypeForDiagnostics): FatalDiagnosticError;
/**
 * Transforms the given decorator to inline external resources. i.e. if the decorator
 * resolves to `@Component`, the `templateUrl` and `styleUrls` metadata fields will be
 * transformed to their semantically-equivalent inline variants.
 *
 * This method is used for serializing decorators into the class metadata. The emitted
 * class metadata should not refer to external resources as this would be inconsistent
 * with the component definitions/declarations which already inline external resources.
 *
 * Additionally, the references to external resources would require libraries to ship
 * external resources exclusively for the class metadata.
 */
export declare function transformDecoratorResources(dec: Decorator, component: Map<string, ts.Expression>, styles: string[], template: ParsedTemplateWithSource): Decorator;
export declare function extractComponentStyleUrls(evaluator: PartialEvaluator, component: Map<string, ts.Expression>): StyleUrlMeta[];
export declare function extractInlineStyleResources(component: Map<string, ts.Expression>): Set<Resource>;
export declare function _extractTemplateStyleUrls(template: ParsedTemplateWithSource): StyleUrlMeta[];
export {};

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { SchemaMetadata } from '@angular/compiler';
import ts from 'typescript';
import { PartialEvaluator } from '../../../partial_evaluator';
export declare function extractSchemas(rawExpr: ts.Expression, evaluator: PartialEvaluator, context: string): SchemaMetadata[];

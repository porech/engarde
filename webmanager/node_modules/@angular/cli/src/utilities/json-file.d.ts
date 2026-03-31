/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { JsonValue } from '@angular-devkit/core';
/** A function that returns an index to insert a new property in a JSON object. */
export type InsertionIndex = (properties: string[]) => number;
/** A JSON path. */
export type JSONPath = (string | number)[];
/**
 * Reads and parses a JSON file, supporting comments and trailing commas.
 * @param path The path to the JSON file.
 * @returns The parsed JSON object.
 */
export declare function readAndParseJson<T extends JsonValue>(path: string): T;
/**
 * Parses a JSON string, supporting comments and trailing commas.
 * @param content The JSON string to parse.
 * @returns The parsed JSON object.
 */
export declare function parseJson<T extends JsonValue>(content: string): T;

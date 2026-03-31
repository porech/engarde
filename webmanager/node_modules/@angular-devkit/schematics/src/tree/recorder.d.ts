/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { BaseException } from '@angular-devkit/core';
import MagicString from 'magic-string';
import { FileEntry, UpdateRecorder } from './interface';
export declare class IndexOutOfBoundException extends BaseException {
    constructor(index: number, min: number, max?: number);
}
export declare class UpdateRecorderBase implements UpdateRecorder {
    private readonly data;
    private readonly bom;
    protected _path: string;
    protected content: MagicString;
    constructor(data: Uint8Array, path: string, encoding?: string, bom?: boolean);
    static createFromFileEntry(entry: FileEntry): UpdateRecorderBase;
    get path(): string;
    protected _assertIndex(index: number): void;
    insertLeft(index: number, content: Buffer | string): UpdateRecorder;
    insertRight(index: number, content: Buffer | string): UpdateRecorder;
    remove(index: number, length: number): UpdateRecorder;
    apply(content: Buffer): Buffer;
}

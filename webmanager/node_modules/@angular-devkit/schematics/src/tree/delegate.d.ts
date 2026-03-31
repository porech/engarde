/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { JsonValue } from '@angular-devkit/core';
import { Action } from './action';
import { DirEntry, FileEntry, FileVisitor, MergeStrategy, Tree, TreeSymbol, UpdateRecorder } from './interface';
export declare class DelegateTree implements Tree {
    [TreeSymbol]: () => this;
    protected _other: Tree;
    constructor(_other: Tree);
    branch(): Tree;
    merge(other: Tree, strategy?: MergeStrategy): void;
    get root(): DirEntry;
    read(path: string): Buffer | null;
    readText(path: string): string;
    readJson(path: string): JsonValue;
    exists(path: string): boolean;
    get(path: string): FileEntry | null;
    getDir(path: string): DirEntry;
    visit(visitor: FileVisitor): void;
    overwrite(path: string, content: Buffer | string): void;
    beginUpdate(path: string): UpdateRecorder;
    commitUpdate(record: UpdateRecorder): void;
    create(path: string, content: Buffer | string): void;
    delete(path: string): void;
    rename(from: string, to: string): void;
    apply(action: Action, strategy?: MergeStrategy): void;
    get actions(): Action[];
}

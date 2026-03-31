/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { Reference } from '../../imports';
import { ClassDeclaration } from '../../reflection';
import { MetadataReader, MetadataReaderWithIndex, NgModuleIndex } from './api';
/**
 * An index of all NgModules that export or re-export a given trait.
 */
export declare class NgModuleIndexImpl implements NgModuleIndex {
    private metaReader;
    private localReader;
    constructor(metaReader: MetadataReader, localReader: MetadataReaderWithIndex);
    private ngModuleAuthoritativeReference;
    private typeToExportingModules;
    private indexed;
    private updateWith;
    private index;
    private indexTrait;
    getNgModulesExporting(directiveOrPipe: ClassDeclaration): Array<Reference<ClassDeclaration>>;
}

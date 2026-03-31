/*!
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { DirectiveMeta, MetadataReader } from '../../metadata/src/api';
/** Resolves the host directives of a directive to a flat array of matches. */
export declare class HostDirectivesResolver {
    private metaReader;
    private cache;
    constructor(metaReader: MetadataReader);
    /** Resolves all of the host directives that apply to a directive. */
    resolve(metadata: DirectiveMeta): ReadonlyArray<DirectiveMeta>;
    /**
     * Traverses all of the host directive chains and produces a flat array of
     * directive metadata representing the host directives that apply to the host.
     */
    private walkHostDirectives;
    /**
     * Filters the class property mappings so that only the allowed ones are present.
     * @param source Property mappings that should be filtered.
     * @param allowedProperties Property mappings that are allowed in the final results.
     * @param valueResolver Function used to resolve the value that is assigned to the final mapping.
     */
    private filterMappings;
}

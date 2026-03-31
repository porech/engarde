/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
interface JavaScriptTransformRequest {
    filename: string;
    data: string | Uint8Array;
    sourcemap: boolean;
    thirdPartySourcemaps: boolean;
    advancedOptimizations: boolean;
    skipLinker?: boolean;
    sideEffects?: boolean;
    jit: boolean;
    instrumentForCoverage?: boolean;
}
export default function transformJavaScript(request: JavaScriptTransformRequest): Promise<unknown>;
export {};

import * as i0 from '@angular/core';
import { InjectionToken } from '@angular/core';
import * as i1 from '@angular/cdk/bidi';

/**
 * Injection token that configures whether the Material sanity checks are enabled.
 * @deprecated No longer used and will be removed.
 * @breaking-change 21.0.0
 */
declare const MATERIAL_SANITY_CHECKS: InjectionToken<SanityChecks>;
/**
 * Possible sanity checks that can be enabled. If set to
 * true/false, all checks will be enabled/disabled.
 * @deprecated No longer used and will be removed.
 * @breaking-change 21.0.0
 */
type SanityChecks = boolean | GranularSanityChecks;
/**
 * Object that can be used to configure the sanity checks granularly.
 * @deprecated No longer used and will be removed.
 * @breaking-change 21.0.0
 */
interface GranularSanityChecks {
    doctype: boolean;
    theme: boolean;
    version: boolean;
}
/**
 * Module that captures anything that should be loaded and/or run for *all* Angular Material
 * components. This includes Bidi, etc.
 *
 * This module should be imported to each top-level component module (e.g., MatTabsModule).
 * @deprecated No longer used and will be removed.
 * @breaking-change 21.0.0
 */
declare class MatCommonModule {
    constructor(...args: any[]);
    static ɵfac: i0.ɵɵFactoryDeclaration<MatCommonModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<MatCommonModule, never, [typeof i1.BidiModule], [typeof i1.BidiModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<MatCommonModule>;
}

export { MATERIAL_SANITY_CHECKS, MatCommonModule };
export type { GranularSanityChecks, SanityChecks };

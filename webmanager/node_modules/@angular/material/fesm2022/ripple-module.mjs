import * as i0 from '@angular/core';
import { NgModule } from '@angular/core';
import { MatCommonModule } from './common-module.mjs';
import { MatRipple } from './ripple.mjs';

class MatRippleModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatRippleModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatRippleModule, imports: [MatCommonModule, MatRipple], exports: [MatRipple, MatCommonModule] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatRippleModule, imports: [MatCommonModule, MatCommonModule] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatRippleModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [MatCommonModule, MatRipple],
                    exports: [MatRipple, MatCommonModule],
                }]
        }] });

export { MatRippleModule };
//# sourceMappingURL=ripple-module.mjs.map

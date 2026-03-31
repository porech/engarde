import * as i0 from '@angular/core';
import { NgModule } from '@angular/core';
import { MatPseudoCheckbox } from './pseudo-checkbox.mjs';
import { MatCommonModule } from './common-module.mjs';

class MatPseudoCheckboxModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatPseudoCheckboxModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatPseudoCheckboxModule, imports: [MatCommonModule, MatPseudoCheckbox], exports: [MatPseudoCheckbox] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatPseudoCheckboxModule, imports: [MatCommonModule] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatPseudoCheckboxModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [MatCommonModule, MatPseudoCheckbox],
                    exports: [MatPseudoCheckbox],
                }]
        }] });

export { MatPseudoCheckboxModule };
//# sourceMappingURL=pseudo-checkbox-module.mjs.map

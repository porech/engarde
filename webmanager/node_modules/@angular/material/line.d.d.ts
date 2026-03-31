import * as i0 from '@angular/core';
import { QueryList, ElementRef } from '@angular/core';
import { MatCommonModule } from './common-module.d.js';

/**
 * Shared directive to count lines inside a text area, such as a list item.
 * Line elements can be extracted with a @ContentChildren(MatLine) query, then
 * counted by checking the query list's length.
 */
declare class MatLine {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatLine, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatLine, "[mat-line], [matLine]", never, {}, {}, never, never, true, never>;
}
/**
 * Helper that takes a query list of lines and sets the correct class on the host.
 * @docs-private
 */
declare function setLines(lines: QueryList<unknown>, element: ElementRef<HTMLElement>, prefix?: string): void;
declare class MatLineModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatLineModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<MatLineModule, never, [typeof MatCommonModule, typeof MatLine], [typeof MatLine, typeof MatCommonModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<MatLineModule>;
}

export { MatLine, MatLineModule, setLines };

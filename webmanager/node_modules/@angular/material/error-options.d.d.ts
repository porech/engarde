import { AbstractControl, FormGroupDirective, NgForm } from '@angular/forms';
import * as i0 from '@angular/core';

/** Error state matcher that matches when a control is invalid and dirty. */
declare class ShowOnDirtyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: AbstractControl | null, form: FormGroupDirective | NgForm | null): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<ShowOnDirtyErrorStateMatcher, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ShowOnDirtyErrorStateMatcher>;
}
/** Provider that defines how form controls behave with regards to displaying error messages. */
declare class ErrorStateMatcher {
    isErrorState(control: AbstractControl | null, form: FormGroupDirective | NgForm | null): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<ErrorStateMatcher, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ErrorStateMatcher>;
}

export { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher };

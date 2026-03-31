import { MatDialogRef, MatDialogContainer } from '../dialog.d.js';
export { AutoFocusTarget, DialogPosition, DialogRole, MAT_DIALOG_DATA, MAT_DIALOG_DEFAULT_OPTIONS, MAT_DIALOG_SCROLL_STRATEGY, MatDialog, MatDialogConfig, MatDialogState, _closeDialogVia } from '../dialog.d.js';
import * as i0 from '@angular/core';
import { OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import * as i5 from '@angular/cdk/scrolling';
import * as i1 from '@angular/cdk/dialog';
import * as i2 from '@angular/cdk/overlay';
import * as i3 from '@angular/cdk/portal';
import { MatCommonModule } from '../common-module.d.js';
import '@angular/cdk/bidi';
import '@angular/cdk/a11y';
import 'rxjs';

/**
 * Button that will close the current dialog.
 */
declare class MatDialogClose implements OnInit, OnChanges {
    dialogRef: MatDialogRef<any, any>;
    private _elementRef;
    private _dialog;
    /** Screen-reader label for the button. */
    ariaLabel: string;
    /** Default to "button" to prevents accidental form submits. */
    type: 'submit' | 'button' | 'reset';
    /** Dialog close input. */
    dialogResult: any;
    _matDialogClose: any;
    constructor(...args: unknown[]);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    _onButtonClick(event: MouseEvent): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatDialogClose, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatDialogClose, "[mat-dialog-close], [matDialogClose]", ["matDialogClose"], { "ariaLabel": { "alias": "aria-label"; "required": false; }; "type": { "alias": "type"; "required": false; }; "dialogResult": { "alias": "mat-dialog-close"; "required": false; }; "_matDialogClose": { "alias": "matDialogClose"; "required": false; }; }, {}, never, never, true, never>;
}
declare abstract class MatDialogLayoutSection implements OnInit, OnDestroy {
    protected _dialogRef: MatDialogRef<any, any>;
    private _elementRef;
    private _dialog;
    constructor(...args: unknown[]);
    protected abstract _onAdd(): void;
    protected abstract _onRemove(): void;
    ngOnInit(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatDialogLayoutSection, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatDialogLayoutSection, never, never, {}, {}, never, never, true, never>;
}
/**
 * Title of a dialog element. Stays fixed to the top of the dialog when scrolling.
 */
declare class MatDialogTitle extends MatDialogLayoutSection {
    id: string;
    protected _onAdd(): void;
    protected _onRemove(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatDialogTitle, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatDialogTitle, "[mat-dialog-title], [matDialogTitle]", ["matDialogTitle"], { "id": { "alias": "id"; "required": false; }; }, {}, never, never, true, never>;
}
/**
 * Scrollable content container of a dialog.
 */
declare class MatDialogContent {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatDialogContent, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatDialogContent, "[mat-dialog-content], mat-dialog-content, [matDialogContent]", never, {}, {}, never, never, true, [{ directive: typeof i5.CdkScrollable; inputs: {}; outputs: {}; }]>;
}
/**
 * Container for the bottom action buttons in a dialog.
 * Stays fixed to the bottom when scrolling.
 */
declare class MatDialogActions extends MatDialogLayoutSection {
    /**
     * Horizontal alignment of action buttons.
     */
    align?: 'start' | 'center' | 'end';
    protected _onAdd(): void;
    protected _onRemove(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatDialogActions, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatDialogActions, "[mat-dialog-actions], mat-dialog-actions, [matDialogActions]", never, { "align": { "alias": "align"; "required": false; }; }, {}, never, never, true, never>;
}

declare class MatDialogModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatDialogModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<MatDialogModule, never, [typeof i1.DialogModule, typeof i2.OverlayModule, typeof i3.PortalModule, typeof MatCommonModule, typeof MatDialogContainer, typeof MatDialogClose, typeof MatDialogTitle, typeof MatDialogActions, typeof MatDialogContent], [typeof MatCommonModule, typeof MatDialogContainer, typeof MatDialogClose, typeof MatDialogTitle, typeof MatDialogActions, typeof MatDialogContent]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<MatDialogModule>;
}

/**
 * Default parameters for the animation for backwards compatibility.
 * @docs-private
 * @deprecated Will stop being exported.
 * @breaking-change 21.0.0
 */
declare const _defaultParams: {
    params: {
        enterAnimationDuration: string;
        exitAnimationDuration: string;
    };
};
/**
 * Animations used by MatDialog.
 * @docs-private
 * @deprecated No longer used, will be removed.
 * @breaking-change 21.0.0
 */
declare const matDialogAnimations: {
    readonly dialogContainer: any;
};

export { MatDialogActions, MatDialogClose, MatDialogContainer, MatDialogContent, MatDialogModule, MatDialogRef, MatDialogTitle, _defaultParams, matDialogAnimations };

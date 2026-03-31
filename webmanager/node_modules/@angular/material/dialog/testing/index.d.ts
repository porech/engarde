import * as _angular_cdk_testing from '@angular/cdk/testing';
import { BaseHarnessFilters, ContentContainerComponentHarness, ComponentHarnessConstructor, HarnessPredicate } from '@angular/cdk/testing';
import { DialogRole, MatDialog, MatDialogConfig, MatDialogRef } from '../../dialog.d.js';
import { ComponentType } from '@angular/cdk/overlay';
import { OnDestroy } from '@angular/core';
import '@angular/cdk/bidi';
import '@angular/cdk/dialog';
import '@angular/cdk/a11y';
import 'rxjs';
import '@angular/cdk/portal';

/** A set of criteria that can be used to filter a list of `MatDialogHarness` instances. */
interface DialogHarnessFilters extends BaseHarnessFilters {
}

/** Selectors for different sections of the mat-dialog that can contain user content. */
declare enum MatDialogSection {
    TITLE = ".mat-mdc-dialog-title",
    CONTENT = ".mat-mdc-dialog-content",
    ACTIONS = ".mat-mdc-dialog-actions"
}
/** Harness for interacting with a standard `MatDialog` in tests. */
declare class MatDialogHarness extends ContentContainerComponentHarness<MatDialogSection | string> {
    /** The selector for the host element of a `MatDialog` instance. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a dialog with specific attributes.
     * @param options Options for filtering which dialog instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with<T extends MatDialogHarness>(this: ComponentHarnessConstructor<T>, options?: DialogHarnessFilters): HarnessPredicate<T>;
    protected _title: () => Promise<_angular_cdk_testing.TestElement | null>;
    protected _content: () => Promise<_angular_cdk_testing.TestElement | null>;
    protected _actions: () => Promise<_angular_cdk_testing.TestElement | null>;
    /** Gets the id of the dialog. */
    getId(): Promise<string | null>;
    /** Gets the role of the dialog. */
    getRole(): Promise<DialogRole | null>;
    /** Gets the value of the dialog's "aria-label" attribute. */
    getAriaLabel(): Promise<string | null>;
    /** Gets the value of the dialog's "aria-labelledby" attribute. */
    getAriaLabelledby(): Promise<string | null>;
    /** Gets the value of the dialog's "aria-describedby" attribute. */
    getAriaDescribedby(): Promise<string | null>;
    /**
     * Closes the dialog by pressing escape.
     *
     * Note: this method does nothing if `disableClose` has been set to `true` for the dialog.
     */
    close(): Promise<void>;
    /** Gets the dialog's text. */
    getText(): Promise<string>;
    /** Gets the dialog's title text. This only works if the dialog is using mat-dialog-title. */
    getTitleText(): Promise<string>;
    /** Gets the dialog's content text. This only works if the dialog is using mat-dialog-content. */
    getContentText(): Promise<string>;
    /** Gets the dialog's actions text. This only works if the dialog is using mat-dialog-actions. */
    getActionsText(): Promise<string>;
}

/** Test component that immediately opens a dialog when bootstrapped. */
declare class MatTestDialogOpener<T = unknown, R = unknown> implements OnDestroy {
    dialog: MatDialog;
    /** Component that should be opened with the MatDialog `open` method. */
    protected static component: ComponentType<unknown> | undefined;
    /** Config that should be provided to the MatDialog `open` method. */
    protected static config: MatDialogConfig | undefined;
    /** MatDialogRef returned from the MatDialog `open` method. */
    dialogRef: MatDialogRef<T, R>;
    /** Data passed to the `MatDialog` close method. */
    closedResult: R | undefined;
    private readonly _afterClosedSubscription;
    private readonly _ngZone;
    /** Static method that prepares this class to open the provided component. */
    static withComponent<T = unknown, R = unknown>(component: ComponentType<T>, config?: MatDialogConfig): ComponentType<MatTestDialogOpener<T, R>>;
    constructor(...args: unknown[]);
    ngOnDestroy(): void;
}
declare class MatTestDialogOpenerModule {
}

export { MatDialogHarness, MatDialogSection, MatTestDialogOpener, MatTestDialogOpenerModule };
export type { DialogHarnessFilters };

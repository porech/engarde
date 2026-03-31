import { BaseHarnessFilters, ContentContainerComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { AriaLivePoliteness } from '@angular/cdk/a11y';

/** A set of criteria that can be used to filter a list of `MatSnackBarHarness` instances. */
interface SnackBarHarnessFilters extends BaseHarnessFilters {
}

/** Harness for interacting with a mat-snack-bar in tests. */
declare class MatSnackBarHarness extends ContentContainerComponentHarness<string> {
    /** The selector for the host element of a `MatSnackBar` instance. */
    static hostSelector: string;
    private _messageSelector;
    private _actionButtonSelector;
    private _snackBarLiveRegion;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatSnackBarHarness` that meets
     * certain criteria.
     * @param options Options for filtering which snack bar instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: SnackBarHarnessFilters): HarnessPredicate<MatSnackBarHarness>;
    /**
     * Gets the role of the snack-bar. The role of a snack-bar is determined based
     * on the ARIA politeness specified in the snack-bar config.
     * @deprecated Use `getAriaLive` instead.
     * @breaking-change 13.0.0
     */
    getRole(): Promise<'alert' | 'status' | null>;
    /**
     * Gets the aria-live of the snack-bar's live region. The aria-live of a snack-bar is
     * determined based on the ARIA politeness specified in the snack-bar config.
     */
    getAriaLive(): Promise<AriaLivePoliteness>;
    /**
     * Whether the snack-bar has an action. Method cannot be used for snack-bar's with custom content.
     */
    hasAction(): Promise<boolean>;
    /**
     * Gets the description of the snack-bar. Method cannot be used for snack-bar's without action or
     * with custom content.
     */
    getActionDescription(): Promise<string>;
    /**
     * Dismisses the snack-bar by clicking the action button. Method cannot be used for snack-bar's
     * without action or with custom content.
     */
    dismissWithAction(): Promise<void>;
    /**
     * Gets the message of the snack-bar. Method cannot be used for snack-bar's with custom content.
     */
    getMessage(): Promise<string>;
    /** Gets whether the snack-bar has been dismissed. */
    isDismissed(): Promise<boolean>;
    /**
     * Asserts that the current snack-bar has an action defined. Otherwise the
     * promise will reject.
     */
    private _assertHasAction;
    /** Gets the simple snack bar action button. */
    private _getActionButton;
}

export { MatSnackBarHarness };
export type { SnackBarHarnessFilters };

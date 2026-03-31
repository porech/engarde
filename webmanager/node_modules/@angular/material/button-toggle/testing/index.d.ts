import { BaseHarnessFilters, ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { MatButtonToggleAppearance } from '../../button-toggle.d.js';
import '@angular/cdk/bidi';
import '@angular/core';
import '@angular/forms';

/** Criteria that can be used to filter a list of `MatButtonToggleHarness` instances. */
interface ButtonToggleHarnessFilters extends BaseHarnessFilters {
    /** Only find instances whose text matches the given value. */
    text?: string | RegExp;
    /** Only find instances whose name matches the given value. */
    name?: string | RegExp;
    /** Only find instances that are checked. */
    checked?: boolean;
    /** Only find instances which match the given disabled state. */
    disabled?: boolean;
}

/** Harness for interacting with a standard mat-button-toggle in tests. */
declare class MatButtonToggleHarness extends ComponentHarness {
    /** The selector for the host element of a `MatButton` instance. */
    static hostSelector: string;
    private _label;
    private _button;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatButtonToggleHarness` that meets
     * certain criteria.
     * @param options Options for filtering which button toggle instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: ButtonToggleHarnessFilters): HarnessPredicate<MatButtonToggleHarness>;
    /** Gets a boolean promise indicating if the button toggle is checked. */
    isChecked(): Promise<boolean>;
    /** Gets a boolean promise indicating if the button toggle is disabled. */
    isDisabled(): Promise<boolean>;
    /** Gets a promise for the button toggle's name. */
    getName(): Promise<string | null>;
    /** Gets a promise for the button toggle's aria-label. */
    getAriaLabel(): Promise<string | null>;
    /** Gets a promise for the button toggles's aria-labelledby. */
    getAriaLabelledby(): Promise<string | null>;
    /** Gets a promise for the button toggle's text. */
    getText(): Promise<string>;
    /** Gets the appearance that the button toggle is using. */
    getAppearance(): Promise<MatButtonToggleAppearance>;
    /** Focuses the toggle. */
    focus(): Promise<void>;
    /** Blurs the toggle. */
    blur(): Promise<void>;
    /** Whether the toggle is focused. */
    isFocused(): Promise<boolean>;
    /** Toggle the checked state of the buttons toggle. */
    toggle(): Promise<void>;
    /**
     * Puts the button toggle in a checked state by toggling it if it's
     * currently unchecked, or doing nothing if it is already checked.
     */
    check(): Promise<void>;
    /**
     * Puts the button toggle in an unchecked state by toggling it if it's
     * currently checked, or doing nothing if it's already unchecked.
     */
    uncheck(): Promise<void>;
}

/** Criteria that can be used to filter a list of `MatButtonToggleGroupHarness` instances. */
interface ButtonToggleGroupHarnessFilters extends BaseHarnessFilters {
    /** Only find instances which match the given disabled state. */
    disabled?: boolean;
}

/** Harness for interacting with a standard mat-button-toggle in tests. */
declare class MatButtonToggleGroupHarness extends ComponentHarness {
    /** The selector for the host element of a `MatButton` instance. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatButtonToggleGroupHarness`
     * that meets certain criteria.
     * @param options Options for filtering which button toggle instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: ButtonToggleGroupHarnessFilters): HarnessPredicate<MatButtonToggleGroupHarness>;
    /**
     * Gets the button toggles that are inside the group.
     * @param filter Optionally filters which toggles are included.
     */
    getToggles(filter?: ButtonToggleHarnessFilters): Promise<MatButtonToggleHarness[]>;
    /** Gets whether the button toggle group is disabled. */
    isDisabled(): Promise<boolean>;
    /** Gets whether the button toggle group is laid out vertically. */
    isVertical(): Promise<boolean>;
    /** Gets the appearance that the group is using. */
    getAppearance(): Promise<MatButtonToggleAppearance>;
}

export { MatButtonToggleGroupHarness, MatButtonToggleHarness };
export type { ButtonToggleGroupHarnessFilters, ButtonToggleHarnessFilters };

import { BaseHarnessFilters, ContentContainerComponentHarness, ComponentHarnessConstructor, HarnessPredicate } from '@angular/cdk/testing';

interface OptionHarnessFilters extends BaseHarnessFilters {
    text?: string | RegExp;
    isSelected?: boolean;
}

/** Harness for interacting with a `mat-option` in tests. */
declare class MatOptionHarness extends ContentContainerComponentHarness {
    /** Selector used to locate option instances. */
    static hostSelector: string;
    /** Element containing the option's text. */
    private _text;
    /**
     * Gets a `HarnessPredicate` that can be used to search for an option with specific attributes.
     * @param options Options for filtering which option instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with<T extends MatOptionHarness>(this: ComponentHarnessConstructor<T>, options?: OptionHarnessFilters): HarnessPredicate<T>;
    /** Clicks the option. */
    click(): Promise<void>;
    /** Gets the option's label text. */
    getText(): Promise<string>;
    /** Gets whether the option is disabled. */
    isDisabled(): Promise<boolean>;
    /** Gets whether the option is selected. */
    isSelected(): Promise<boolean>;
    /** Gets whether the option is active. */
    isActive(): Promise<boolean>;
    /** Gets whether the option is in multiple selection mode. */
    isMultiple(): Promise<boolean>;
}

export { MatOptionHarness };
export type { OptionHarnessFilters };

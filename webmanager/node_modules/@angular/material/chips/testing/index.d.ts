import * as _angular_cdk_testing from '@angular/cdk/testing';
import { BaseHarnessFilters, ComponentHarness, ComponentHarnessConstructor, HarnessPredicate, ContentContainerComponentHarness, TestKey } from '@angular/cdk/testing';

interface ChipHarnessFilters extends BaseHarnessFilters {
    /** Only find instances whose text matches the given value. */
    text?: string | RegExp;
    /** Only find instances which match the given disabled state. */
    disabled?: boolean;
}
interface ChipInputHarnessFilters extends BaseHarnessFilters {
    /** Filters based on the value of the input. */
    value?: string | RegExp;
    /** Filters based on the placeholder text of the input. */
    placeholder?: string | RegExp;
    /** Only find instances which match the given disabled state. */
    disabled?: boolean;
}
interface ChipListboxHarnessFilters extends BaseHarnessFilters {
    /** Only find instances which match the given disabled state. */
    disabled?: boolean;
}
interface ChipOptionHarnessFilters extends ChipHarnessFilters {
    /** Only find chip instances whose selected state matches the given value. */
    selected?: boolean;
}
interface ChipGridHarnessFilters extends BaseHarnessFilters {
    /** Only find instances which match the given disabled state. */
    disabled?: boolean;
}
interface ChipRowHarnessFilters extends ChipHarnessFilters {
}
interface ChipSetHarnessFilters extends BaseHarnessFilters {
}
interface ChipEditHarnessFilters extends BaseHarnessFilters {
}
interface ChipRemoveHarnessFilters extends BaseHarnessFilters {
}
interface ChipAvatarHarnessFilters extends BaseHarnessFilters {
}
interface ChipEditInputHarnessFilters extends BaseHarnessFilters {
}

/** Harness for interacting with a standard Material chip avatar in tests. */
declare class MatChipAvatarHarness extends ComponentHarness {
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a chip avatar with specific
     * attributes.
     * @param options Options for filtering which input instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with<T extends MatChipAvatarHarness>(this: ComponentHarnessConstructor<T>, options?: ChipAvatarHarnessFilters): HarnessPredicate<T>;
}

/** Harness for interacting with a standard Material chip edit button in tests. */
declare class MatChipEditHarness extends ComponentHarness {
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a chip edit with specific
     * attributes.
     * @param options Options for filtering which input instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with<T extends MatChipEditHarness>(this: ComponentHarnessConstructor<T>, options?: ChipEditHarnessFilters): HarnessPredicate<T>;
    /** Clicks the edit button. */
    click(): Promise<void>;
}

/** Harness for interacting with a standard Material chip remove button in tests. */
declare class MatChipRemoveHarness extends ComponentHarness {
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a chip remove with specific
     * attributes.
     * @param options Options for filtering which input instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with<T extends MatChipRemoveHarness>(this: ComponentHarnessConstructor<T>, options?: ChipRemoveHarnessFilters): HarnessPredicate<T>;
    /** Clicks the remove button. */
    click(): Promise<void>;
}

/** Harness for interacting with a mat-chip in tests. */
declare class MatChipHarness extends ContentContainerComponentHarness {
    protected _primaryAction: () => Promise<_angular_cdk_testing.TestElement>;
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a chip with specific attributes.
     * @param options Options for narrowing the search.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with<T extends MatChipHarness>(this: ComponentHarnessConstructor<T>, options?: ChipHarnessFilters): HarnessPredicate<T>;
    /** Gets a promise for the text content the option. */
    getText(): Promise<string>;
    /** Whether the chip is disabled. */
    isDisabled(): Promise<boolean>;
    /** Delete a chip from the set. */
    remove(): Promise<void>;
    /**
     * Gets the edit button inside of a chip.
     * @param filter Optionally filters which chips are included.
     */
    geEditButton(filter?: ChipEditHarnessFilters): Promise<MatChipEditHarness>;
    /**
     * Gets the remove button inside of a chip.
     * @param filter Optionally filters which chips are included.
     */
    getRemoveButton(filter?: ChipRemoveHarnessFilters): Promise<MatChipRemoveHarness>;
    /**
     * Gets the avatar inside a chip.
     * @param filter Optionally filters which avatars are included.
     */
    getAvatar(filter?: ChipAvatarHarnessFilters): Promise<MatChipAvatarHarness | null>;
}

/** Harness for interacting with a grid's chip input in tests. */
declare class MatChipInputHarness extends ComponentHarness {
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a chip input with specific
     * attributes.
     * @param options Options for filtering which input instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with<T extends MatChipInputHarness>(this: ComponentHarnessConstructor<T>, options?: ChipInputHarnessFilters): HarnessPredicate<T>;
    /** Whether the input is disabled. */
    isDisabled(): Promise<boolean>;
    /** Whether the input is required. */
    isRequired(): Promise<boolean>;
    /** Gets the value of the input. */
    getValue(): Promise<string>;
    /** Gets the placeholder of the input. */
    getPlaceholder(): Promise<string>;
    /**
     * Focuses the input and returns a promise that indicates when the
     * action is complete.
     */
    focus(): Promise<void>;
    /**
     * Blurs the input and returns a promise that indicates when the
     * action is complete.
     */
    blur(): Promise<void>;
    /** Whether the input is focused. */
    isFocused(): Promise<boolean>;
    /**
     * Sets the value of the input. The value will be set by simulating
     * keypresses that correspond to the given value.
     */
    setValue(newValue: string): Promise<void>;
    /** Sends a chip separator key to the input element. */
    sendSeparatorKey(key: TestKey | string): Promise<void>;
}

/** Harness for interacting with a mat-chip-option in tests. */
declare class MatChipOptionHarness extends MatChipHarness {
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a chip option with specific
     * attributes.
     * @param options Options for narrowing the search.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with<T extends MatChipHarness>(this: ComponentHarnessConstructor<T>, options?: ChipOptionHarnessFilters): HarnessPredicate<T>;
    /** Whether the chip is selected. */
    isSelected(): Promise<boolean>;
    /** Selects the given chip. Only applies if it's selectable. */
    select(): Promise<void>;
    /** Deselects the given chip. Only applies if it's selectable. */
    deselect(): Promise<void>;
    /** Toggles the selected state of the given chip. */
    toggle(): Promise<void>;
}

/** Harness for interacting with a mat-chip-listbox in tests. */
declare class MatChipListboxHarness extends ComponentHarness {
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a chip listbox with specific
     * attributes.
     * @param options Options for narrowing the search.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with<T extends MatChipListboxHarness>(this: ComponentHarnessConstructor<T>, options?: ChipListboxHarnessFilters): HarnessPredicate<T>;
    /** Gets whether the chip listbox is disabled. */
    isDisabled(): Promise<boolean>;
    /** Gets whether the chip listbox is required. */
    isRequired(): Promise<boolean>;
    /** Gets whether the chip listbox is in multi selection mode. */
    isMultiple(): Promise<boolean>;
    /** Gets whether the orientation of the chip list. */
    getOrientation(): Promise<'horizontal' | 'vertical'>;
    /**
     * Gets the list of chips inside the chip list.
     * @param filter Optionally filters which chips are included.
     */
    getChips(filter?: ChipOptionHarnessFilters): Promise<MatChipOptionHarness[]>;
    /**
     * Selects a chip inside the chip list.
     * @param filter An optional filter to apply to the child chips.
     *    All the chips matching the filter will be selected.
     */
    selectChips(filter?: ChipOptionHarnessFilters): Promise<void>;
}

/** Harness for interacting with an editable chip's input in tests. */
declare class MatChipEditInputHarness extends ComponentHarness {
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a chip edit input with specific
     * attributes.
     * @param options Options for filtering which input instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with<T extends MatChipEditInputHarness>(this: ComponentHarnessConstructor<T>, options?: ChipEditInputHarnessFilters): HarnessPredicate<T>;
    /** Sets the value of the input. */
    setValue(value: string): Promise<void>;
}

/** Harness for interacting with a mat-chip-row in tests. */
declare class MatChipRowHarness extends MatChipHarness {
    static hostSelector: string;
    /** Whether the chip is editable. */
    isEditable(): Promise<boolean>;
    /** Whether the chip is currently being edited. */
    isEditing(): Promise<boolean>;
    /** Sets the chip row into an editing state, if it is editable. */
    startEditing(): Promise<void>;
    /** Stops editing the chip, if it was in the editing state. */
    finishEditing(): Promise<void>;
    /** Gets the edit input inside the chip row. */
    getEditInput(filter?: ChipEditInputHarnessFilters): Promise<MatChipEditInputHarness>;
}

/** Harness for interacting with a mat-chip-grid in tests. */
declare class MatChipGridHarness extends ComponentHarness {
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a chip grid with specific attributes.
     * @param options Options for filtering which chip grid instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with<T extends MatChipGridHarness>(this: ComponentHarnessConstructor<T>, options?: ChipGridHarnessFilters): HarnessPredicate<T>;
    /** Gets whether the chip grid is disabled. */
    isDisabled(): Promise<boolean>;
    /** Gets whether the chip grid is required. */
    isRequired(): Promise<boolean>;
    /** Gets whether the chip grid is invalid. */
    isInvalid(): Promise<boolean>;
    /** Gets promise of the harnesses for the chip rows. */
    getRows(filter?: ChipRowHarnessFilters): Promise<MatChipRowHarness[]>;
    /** Gets promise of the chip text input harness. */
    getInput(filter?: ChipInputHarnessFilters): Promise<MatChipInputHarness | null>;
}

/** Harness for interacting with a mat-chip-set in tests. */
declare class MatChipSetHarness extends ComponentHarness {
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a chip set with specific attributes.
     * @param options Options for filtering which chip set instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with<T extends MatChipSetHarness>(this: ComponentHarnessConstructor<T>, options?: ChipSetHarnessFilters): HarnessPredicate<T>;
    /** Gets promise of the harnesses for the chips. */
    getChips(filter?: ChipHarnessFilters): Promise<MatChipHarness[]>;
}

export { MatChipAvatarHarness, MatChipEditHarness, MatChipEditInputHarness, MatChipGridHarness, MatChipHarness, MatChipInputHarness, MatChipListboxHarness, MatChipOptionHarness, MatChipRemoveHarness, MatChipRowHarness, MatChipSetHarness };
export type { ChipAvatarHarnessFilters, ChipEditHarnessFilters, ChipEditInputHarnessFilters, ChipGridHarnessFilters, ChipHarnessFilters, ChipInputHarnessFilters, ChipListboxHarnessFilters, ChipOptionHarnessFilters, ChipRemoveHarnessFilters, ChipRowHarnessFilters, ChipSetHarnessFilters };

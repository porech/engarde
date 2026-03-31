import { BaseHarnessFilters, ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { MatBadgePosition, MatBadgeSize } from '../../badge.d.js';
import '@angular/core';
import '../../palette.d.js';

interface BadgeHarnessFilters extends BaseHarnessFilters {
    text?: string | RegExp;
}

/** Harness for interacting with a standard Material badge in tests. */
declare class MatBadgeHarness extends ComponentHarness {
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a badge with specific attributes.
     * @param options Options for narrowing the search:
     *   - `text` finds a badge host with a particular text.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: BadgeHarnessFilters): HarnessPredicate<MatBadgeHarness>;
    private _badgeElement;
    /** Gets a promise for the badge text. */
    getText(): Promise<string>;
    /** Gets whether the badge is overlapping the content. */
    isOverlapping(): Promise<boolean>;
    /** Gets the position of the badge. */
    getPosition(): Promise<MatBadgePosition>;
    /** Gets the size of the badge. */
    getSize(): Promise<MatBadgeSize>;
    /** Gets whether the badge is hidden. */
    isHidden(): Promise<boolean>;
    /** Gets whether the badge is disabled. */
    isDisabled(): Promise<boolean>;
}

export { MatBadgeHarness };
export type { BadgeHarnessFilters };

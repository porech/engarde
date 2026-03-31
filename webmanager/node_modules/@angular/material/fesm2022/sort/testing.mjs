import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';

/** Harness for interacting with a standard Angular Material sort header in tests. */
class MatSortHeaderHarness extends ComponentHarness {
    static hostSelector = '.mat-sort-header';
    _container = this.locatorFor('.mat-sort-header-container');
    /**
     * Gets a `HarnessPredicate` that can be used to
     * search for a sort header with specific attributes.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatSortHeaderHarness, options)
            .addOption('label', options.label, (harness, label) => HarnessPredicate.stringMatches(harness.getLabel(), label))
            .addOption('sortDirection', options.sortDirection, (harness, sortDirection) => {
            return HarnessPredicate.stringMatches(harness.getSortDirection(), sortDirection);
        });
    }
    /** Gets the label of the sort header. */
    async getLabel() {
        return (await this._container()).text();
    }
    /** Gets the sorting direction of the header. */
    async getSortDirection() {
        const host = await this.host();
        const ariaSort = await host.getAttribute('aria-sort');
        if (ariaSort === 'ascending') {
            return 'asc';
        }
        else if (ariaSort === 'descending') {
            return 'desc';
        }
        return '';
    }
    /** Gets whether the sort header is currently being sorted by. */
    async isActive() {
        return !!(await this.getSortDirection());
    }
    /** Whether the sort header is disabled. */
    async isDisabled() {
        return (await this.host()).hasClass('mat-sort-header-disabled');
    }
    /** Clicks the header to change its sorting direction. Only works if the header is enabled. */
    async click() {
        return (await this.host()).click();
    }
}

/** Harness for interacting with a standard `mat-sort` in tests. */
class MatSortHarness extends ComponentHarness {
    static hostSelector = '.mat-sort';
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `mat-sort` with specific attributes.
     * @param options Options for narrowing the search.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatSortHarness, options);
    }
    /** Gets all of the sort headers in the `mat-sort`. */
    async getSortHeaders(filter = {}) {
        return this.locatorForAll(MatSortHeaderHarness.with(filter))();
    }
    /** Gets the selected header in the `mat-sort`. */
    async getActiveHeader() {
        const headers = await this.getSortHeaders();
        for (let i = 0; i < headers.length; i++) {
            if (await headers[i].isActive()) {
                return headers[i];
            }
        }
        return null;
    }
}

export { MatSortHarness, MatSortHeaderHarness };
//# sourceMappingURL=testing.mjs.map

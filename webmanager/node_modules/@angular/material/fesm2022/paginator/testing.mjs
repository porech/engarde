import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { MatSelectHarness } from '../select/testing.mjs';
import '@angular/material/core/testing';
import '@angular/material/form-field/testing/control';

/** Harness for interacting with a mat-paginator in tests. */
class MatPaginatorHarness extends ComponentHarness {
    /** Selector used to find paginator instances. */
    static hostSelector = '.mat-mdc-paginator';
    _nextButton = this.locatorFor('.mat-mdc-paginator-navigation-next');
    _previousButton = this.locatorFor('.mat-mdc-paginator-navigation-previous');
    _firstPageButton = this.locatorForOptional('.mat-mdc-paginator-navigation-first');
    _lastPageButton = this.locatorForOptional('.mat-mdc-paginator-navigation-last');
    _select = this.locatorForOptional(MatSelectHarness.with({
        ancestor: '.mat-mdc-paginator-page-size',
    }));
    _pageSizeFallback = this.locatorFor('.mat-mdc-paginator-page-size-value');
    _rangeLabel = this.locatorFor('.mat-mdc-paginator-range-label');
    /**
     * Gets a `HarnessPredicate` that can be used to search for a paginator with specific attributes.
     * @param options Options for filtering which paginator instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(this, options);
    }
    /** Goes to the next page in the paginator. */
    async goToNextPage() {
        return (await this._nextButton()).click();
    }
    /** Returns whether or not the next page button is disabled. */
    async isNextPageDisabled() {
        const disabledValue = await (await this._nextButton()).getAttribute('aria-disabled');
        return disabledValue == 'true';
    }
    /* Returns whether or not the previous page button is disabled. */
    async isPreviousPageDisabled() {
        const disabledValue = await (await this._previousButton()).getAttribute('aria-disabled');
        return disabledValue == 'true';
    }
    /** Goes to the previous page in the paginator. */
    async goToPreviousPage() {
        return (await this._previousButton()).click();
    }
    /** Goes to the first page in the paginator. */
    async goToFirstPage() {
        const button = await this._firstPageButton();
        // The first page button isn't enabled by default so we need to check for it.
        if (!button) {
            throw Error('Could not find first page button inside paginator. ' +
                'Make sure that `showFirstLastButtons` is enabled.');
        }
        return button.click();
    }
    /** Goes to the last page in the paginator. */
    async goToLastPage() {
        const button = await this._lastPageButton();
        // The last page button isn't enabled by default so we need to check for it.
        if (!button) {
            throw Error('Could not find last page button inside paginator. ' +
                'Make sure that `showFirstLastButtons` is enabled.');
        }
        return button.click();
    }
    /**
     * Sets the page size of the paginator.
     * @param size Page size that should be select.
     */
    async setPageSize(size) {
        const select = await this._select();
        // The select is only available if the `pageSizeOptions` are
        // set to an array with more than one item.
        if (!select) {
            throw Error('Cannot find page size selector in paginator. ' +
                'Make sure that the `pageSizeOptions` have been configured.');
        }
        return select.clickOptions({ text: `${size}` });
    }
    /** Gets the page size of the paginator. */
    async getPageSize() {
        const select = await this._select();
        const value = select ? select.getValueText() : (await this._pageSizeFallback()).text();
        return coerceNumberProperty(await value);
    }
    /** Gets the text of the range label of the paginator. */
    async getRangeLabel() {
        return (await this._rangeLabel()).text();
    }
}

export { MatPaginatorHarness };
//# sourceMappingURL=testing.mjs.map

import { ContentContainerComponentHarness, HarnessPredicate, parallel } from '@angular/cdk/testing';

/** Selectors for different sections of the mat-toolbar that contain user content. */
var MatToolbarSection;
(function (MatToolbarSection) {
    MatToolbarSection["ROW"] = ".mat-toolbar-row";
})(MatToolbarSection || (MatToolbarSection = {}));
/** Harness for interacting with a standard mat-toolbar in tests. */
class MatToolbarHarness extends ContentContainerComponentHarness {
    static hostSelector = '.mat-toolbar';
    _getRows = this.locatorForAll(MatToolbarSection.ROW);
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatToolbarHarness` that meets
     * certain criteria.
     * @param options Options for filtering which card instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatToolbarHarness, options).addOption('text', options.text, (harness, text) => HarnessPredicate.stringMatches(harness._getText(), text));
    }
    /** Whether the toolbar has multiple rows. */
    async hasMultipleRows() {
        return (await this.host()).hasClass('mat-toolbar-multiple-rows');
    }
    /** Gets all of the toolbar's content as text. */
    async _getText() {
        return (await this.host()).text();
    }
    /** Gets the text of each row in the toolbar. */
    async getRowsAsText() {
        const rows = await this._getRows();
        return parallel(() => (rows.length ? rows.map(r => r.text()) : [this._getText()]));
    }
}

export { MatToolbarHarness, MatToolbarSection };
//# sourceMappingURL=testing.mjs.map

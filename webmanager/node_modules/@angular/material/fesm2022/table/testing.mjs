import { ContentContainerComponentHarness, HarnessPredicate, ComponentHarness, parallel } from '@angular/cdk/testing';

class _MatCellHarnessBase extends ContentContainerComponentHarness {
    /** Gets the cell's text. */
    async getText() {
        return (await this.host()).text();
    }
    /** Gets the name of the column that the cell belongs to. */
    async getColumnName() {
        const host = await this.host();
        const classAttribute = await host.getAttribute('class');
        if (classAttribute) {
            const prefix = 'mat-column-';
            const name = classAttribute
                .split(' ')
                .map(c => c.trim())
                .find(c => c.startsWith(prefix));
            if (name) {
                return name.split(prefix)[1];
            }
        }
        throw Error('Could not determine column name of cell.');
    }
    static _getCellPredicate(type, options) {
        return new HarnessPredicate(type, options)
            .addOption('text', options.text, (harness, text) => HarnessPredicate.stringMatches(harness.getText(), text))
            .addOption('columnName', options.columnName, (harness, name) => HarnessPredicate.stringMatches(harness.getColumnName(), name));
    }
}
/** Harness for interacting with an Angular Material table cell. */
class MatCellHarness extends _MatCellHarnessBase {
    /** The selector for the host element of a `MatCellHarness` instance. */
    static hostSelector = '.mat-mdc-cell:not(.mat-no-data-cell)';
    /**
     * Gets a `HarnessPredicate` that can be used to search for a table cell with specific attributes.
     * @param options Options for narrowing the search
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return _MatCellHarnessBase._getCellPredicate(this, options);
    }
}
/** Harness for interacting with an Angular Material table header cell. */
class MatHeaderCellHarness extends _MatCellHarnessBase {
    /** The selector for the host element of a `MatHeaderCellHarness` instance. */
    static hostSelector = '.mat-mdc-header-cell';
    /**
     * Gets a `HarnessPredicate` that can be used to search for a table header cell with specific
     * attributes.
     * @param options Options for narrowing the search
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return _MatCellHarnessBase._getCellPredicate(this, options);
    }
}
/** Harness for interacting with an Angular Material table footer cell. */
class MatFooterCellHarness extends _MatCellHarnessBase {
    /** The selector for the host element of a `MatFooterCellHarness` instance. */
    static hostSelector = '.mat-mdc-footer-cell';
    /**
     * Gets a `HarnessPredicate` that can be used to search for a table footer cell with specific
     * attributes.
     * @param options Options for narrowing the search
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return _MatCellHarnessBase._getCellPredicate(this, options);
    }
}

class _MatRowHarnessBase extends ComponentHarness {
    /** Gets a list of `MatCellHarness` for all cells in the row. */
    async getCells(filter = {}) {
        return this.locatorForAll(this._cellHarness.with(filter))();
    }
    /** Gets the text of the cells in the row. */
    async getCellTextByIndex(filter = {}) {
        const cells = await this.getCells(filter);
        return parallel(() => cells.map(cell => cell.getText()));
    }
    /** Gets the text inside the row organized by columns. */
    async getCellTextByColumnName() {
        const output = {};
        const cells = await this.getCells();
        const cellsData = await parallel(() => cells.map(cell => {
            return parallel(() => [cell.getColumnName(), cell.getText()]);
        }));
        cellsData.forEach(([columnName, text]) => (output[columnName] = text));
        return output;
    }
}
/** Harness for interacting with an Angular Material table row. */
class MatRowHarness extends _MatRowHarnessBase {
    /** The selector for the host element of a `MatRowHarness` instance. */
    static hostSelector = '.mat-mdc-row:not(.mat-mdc-no-data-row)';
    _cellHarness = MatCellHarness;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a table row with specific attributes.
     * @param options Options for narrowing the search
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(this, options);
    }
}
/** Harness for interacting with an Angular Material table header row. */
class MatHeaderRowHarness extends _MatRowHarnessBase {
    /** The selector for the host element of a `MatHeaderRowHarness` instance. */
    static hostSelector = '.mat-mdc-header-row';
    _cellHarness = MatHeaderCellHarness;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a table header row with specific
     * attributes.
     * @param options Options for narrowing the search
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(this, options);
    }
}
/** Harness for interacting with an Angular Material table footer row. */
class MatFooterRowHarness extends _MatRowHarnessBase {
    /** The selector for the host element of a `MatFooterRowHarness` instance. */
    static hostSelector = '.mat-mdc-footer-row';
    _cellHarness = MatFooterCellHarness;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a table footer row cell with specific
     * attributes.
     * @param options Options for narrowing the search
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(this, options);
    }
}

/** Harness for interacting with a mat-table in tests. */
class MatTableHarness extends ContentContainerComponentHarness {
    /** The selector for the host element of a `MatTableHarness` instance. */
    static hostSelector = '.mat-mdc-table';
    _headerRowHarness = MatHeaderRowHarness;
    _rowHarness = MatRowHarness;
    _footerRowHarness = MatFooterRowHarness;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a table with specific attributes.
     * @param options Options for narrowing the search
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(this, options);
    }
    /** Gets all the header rows in a table. */
    async getHeaderRows(filter = {}) {
        return this.locatorForAll(this._headerRowHarness.with(filter))();
    }
    /** Gets all the regular data rows in a table. */
    async getRows(filter = {}) {
        return this.locatorForAll(this._rowHarness.with(filter))();
    }
    /** Gets all the footer rows in a table. */
    async getFooterRows(filter = {}) {
        return this.locatorForAll(this._footerRowHarness.with(filter))();
    }
    /** Gets the text inside the entire table organized by rows. */
    async getCellTextByIndex() {
        const rows = await this.getRows();
        return parallel(() => rows.map(row => row.getCellTextByIndex()));
    }
    /** Gets the text inside the entire table organized by columns. */
    async getCellTextByColumnName() {
        const [headerRows, footerRows, dataRows] = await parallel(() => [
            this.getHeaderRows(),
            this.getFooterRows(),
            this.getRows(),
        ]);
        const text = {};
        const [headerData, footerData, rowsData] = await parallel(() => [
            parallel(() => headerRows.map(row => row.getCellTextByColumnName())),
            parallel(() => footerRows.map(row => row.getCellTextByColumnName())),
            parallel(() => dataRows.map(row => row.getCellTextByColumnName())),
        ]);
        rowsData.forEach(data => {
            Object.keys(data).forEach(columnName => {
                const cellText = data[columnName];
                if (!text[columnName]) {
                    text[columnName] = {
                        headerText: getCellTextsByColumn(headerData, columnName),
                        footerText: getCellTextsByColumn(footerData, columnName),
                        text: [],
                    };
                }
                text[columnName].text.push(cellText);
            });
        });
        return text;
    }
}
/** Extracts the text of cells only under a particular column. */
function getCellTextsByColumn(rowsData, column) {
    const columnTexts = [];
    rowsData.forEach(data => {
        Object.keys(data).forEach(columnName => {
            if (columnName === column) {
                columnTexts.push(data[columnName]);
            }
        });
    });
    return columnTexts;
}

export { MatCellHarness, MatFooterCellHarness, MatFooterRowHarness, MatHeaderCellHarness, MatHeaderRowHarness, MatRowHarness, MatTableHarness, _MatCellHarnessBase, _MatRowHarnessBase };
//# sourceMappingURL=testing.mjs.map

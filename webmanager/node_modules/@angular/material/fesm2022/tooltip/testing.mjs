import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';

/** Harness for interacting with a mat-tooltip in tests. */
class MatTooltipHarness extends ComponentHarness {
    static hostSelector = '.mat-mdc-tooltip-trigger';
    _optionalPanel = this.documentRootLocatorFactory().locatorForOptional('.mat-mdc-tooltip');
    _hiddenClass = 'mat-mdc-tooltip-hide';
    _disabledClass = 'mat-mdc-tooltip-disabled';
    _showAnimationName = 'mat-mdc-tooltip-show';
    _hideAnimationName = 'mat-mdc-tooltip-hide';
    /**
     * Gets a `HarnessPredicate` that can be used to search for a tooltip trigger with specific
     * attributes.
     * @param options Options for narrowing the search.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(this, options);
    }
    /** Shows the tooltip. */
    async show() {
        const host = await this.host();
        // We need to dispatch both `touchstart` and a hover event, because the tooltip binds
        // different events depending on the device. The `changedTouches` is there in case the
        // element has ripples.
        await host.dispatchEvent('touchstart', { changedTouches: [] });
        await host.hover();
        const panel = await this._optionalPanel();
        await panel?.dispatchEvent('animationend', { animationName: this._showAnimationName });
    }
    /** Hides the tooltip. */
    async hide() {
        const host = await this.host();
        // We need to dispatch both `touchstart` and a hover event, because
        // the tooltip binds different events depending on the device.
        await host.dispatchEvent('touchend');
        await host.mouseAway();
        const panel = await this._optionalPanel();
        await panel?.dispatchEvent('animationend', { animationName: this._hideAnimationName });
    }
    /** Gets whether the tooltip is open. */
    async isOpen() {
        const panel = await this._optionalPanel();
        return !!panel && !(await panel.hasClass(this._hiddenClass));
    }
    /** Gets whether the tooltip is disabled */
    async isDisabled() {
        const host = await this.host();
        return host.hasClass(this._disabledClass);
    }
    /** Gets a promise for the tooltip panel's text. */
    async getTooltipText() {
        const panel = await this._optionalPanel();
        return panel ? panel.text() : '';
    }
}

export { MatTooltipHarness };
//# sourceMappingURL=testing.mjs.map

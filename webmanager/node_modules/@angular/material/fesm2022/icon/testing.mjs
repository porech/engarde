import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import * as i0 from '@angular/core';
import { Injectable, NgModule } from '@angular/core';
import { of } from 'rxjs';
import { MatIconRegistry } from '../icon-registry.mjs';
import '@angular/common/http';
import '@angular/platform-browser';
import 'rxjs/operators';

/** Possible types of icons. */
var IconType;
(function (IconType) {
    IconType[IconType["SVG"] = 0] = "SVG";
    IconType[IconType["FONT"] = 1] = "FONT";
})(IconType || (IconType = {}));

/** Harness for interacting with a standard mat-icon in tests. */
class MatIconHarness extends ComponentHarness {
    /** The selector for the host element of a `MatIcon` instance. */
    static hostSelector = '.mat-icon';
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatIconHarness` that meets
     * certain criteria.
     * @param options Options for filtering which icon instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatIconHarness, options)
            .addOption('type', options.type, async (harness, type) => (await harness.getType()) === type)
            .addOption('name', options.name, (harness, text) => HarnessPredicate.stringMatches(harness.getName(), text))
            .addOption('namespace', options.namespace, (harness, text) => HarnessPredicate.stringMatches(harness.getNamespace(), text));
    }
    /** Gets the type of the icon. */
    async getType() {
        const type = await (await this.host()).getAttribute('data-mat-icon-type');
        return type === 'svg' ? IconType.SVG : IconType.FONT;
    }
    /** Gets the name of the icon. */
    async getName() {
        const host = await this.host();
        const nameFromDom = await host.getAttribute('data-mat-icon-name');
        // If we managed to figure out the name from the attribute, use it.
        if (nameFromDom) {
            return nameFromDom;
        }
        // Some icons support defining the icon as a ligature.
        // As a fallback, try to extract it from the DOM text.
        if ((await this.getType()) === IconType.FONT) {
            // Other directives may add content to the icon (e.g. `MatBadge`), however only the direct
            // text nodes affect the name of the icon. Exclude all element descendants from the result.
            const text = await host.text({ exclude: '*' });
            // There are some internal cases where the icon name is wrapped in another node.
            // Fall back to extracting the entire text if we ended up excluding everything above.
            return text.length > 0 ? text : host.text();
        }
        return null;
    }
    /** Gets the namespace of the icon. */
    async getNamespace() {
        return (await this.host()).getAttribute('data-mat-icon-namespace');
    }
    /** Gets whether the icon is inline. */
    async isInline() {
        return (await this.host()).hasClass('mat-icon-inline');
    }
}

/**
 * A null icon registry that must be imported to allow disabling of custom
 * icons.
 */
class FakeMatIconRegistry {
    addSvgIcon() {
        return this;
    }
    addSvgIconLiteral() {
        return this;
    }
    addSvgIconInNamespace() {
        return this;
    }
    addSvgIconLiteralInNamespace() {
        return this;
    }
    addSvgIconSet() {
        return this;
    }
    addSvgIconSetLiteral() {
        return this;
    }
    addSvgIconSetInNamespace() {
        return this;
    }
    addSvgIconSetLiteralInNamespace() {
        return this;
    }
    registerFontClassAlias() {
        return this;
    }
    classNameForFontAlias(alias) {
        return alias;
    }
    getDefaultFontSetClass() {
        return ['material-icons'];
    }
    getSvgIconFromUrl() {
        return of(this._generateEmptySvg());
    }
    getNamedSvgIcon() {
        return of(this._generateEmptySvg());
    }
    setDefaultFontSetClass() {
        return this;
    }
    addSvgIconResolver() {
        return this;
    }
    ngOnDestroy() { }
    _generateEmptySvg() {
        const emptySvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        emptySvg.classList.add('fake-testing-svg');
        // Emulate real icon characteristics from `MatIconRegistry` so size remains consistent in tests.
        emptySvg.setAttribute('fit', '');
        emptySvg.setAttribute('height', '100%');
        emptySvg.setAttribute('width', '100%');
        emptySvg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        emptySvg.setAttribute('focusable', 'false');
        return emptySvg;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: FakeMatIconRegistry, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: FakeMatIconRegistry });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: FakeMatIconRegistry, decorators: [{
            type: Injectable
        }] });
/** Import this module in tests to install the null icon registry. */
class MatIconTestingModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatIconTestingModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatIconTestingModule });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatIconTestingModule, providers: [{ provide: MatIconRegistry, useClass: FakeMatIconRegistry }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatIconTestingModule, decorators: [{
            type: NgModule,
            args: [{
                    providers: [{ provide: MatIconRegistry, useClass: FakeMatIconRegistry }],
                }]
        }] });

export { FakeMatIconRegistry, IconType, MatIconHarness, MatIconTestingModule };
//# sourceMappingURL=testing.mjs.map

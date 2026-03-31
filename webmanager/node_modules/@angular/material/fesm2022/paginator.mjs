import * as i0 from '@angular/core';
import { Injectable, Optional, SkipSelf, InjectionToken, inject, ChangeDetectorRef, numberAttribute, EventEmitter, booleanAttribute, Component, ChangeDetectionStrategy, ViewEncapsulation, Input, Output, NgModule } from '@angular/core';
import { Subject, ReplaySubject } from 'rxjs';
import { _IdGenerator } from '@angular/cdk/a11y';
import { MatFormField } from './form-field2.mjs';
import { MatSelect, MatSelectModule } from './select-module.mjs';
import { MatOption } from './option.mjs';
import { MatIconButton } from './icon-button.mjs';
import { MatTooltip } from './tooltip2.mjs';
import { MatTooltipModule } from './tooltip-module.mjs';
import { MatButtonModule } from './button.mjs';
import '@angular/cdk/bidi';
import '@angular/cdk/coercion';
import '@angular/cdk/platform';
import '@angular/common';
import 'rxjs/operators';
import '@angular/cdk/observers/private';
import './animation.mjs';
import '@angular/cdk/layout';
import '@angular/cdk/overlay';
import '@angular/cdk/scrolling';
import '@angular/cdk/collections';
import '@angular/cdk/keycodes';
import '@angular/forms';
import './error-options.mjs';
import './error-state.mjs';
import './option-module.mjs';
import './ripple-module.mjs';
import './common-module.mjs';
import './ripple.mjs';
import '@angular/cdk/private';
import './pseudo-checkbox-module.mjs';
import './pseudo-checkbox.mjs';
import './form-field-module.mjs';
import '@angular/cdk/observers';
import './structural-styles.mjs';
import './ripple-loader.mjs';
import '@angular/cdk/portal';

/**
 * To modify the labels and text displayed, create a new instance of MatPaginatorIntl and
 * include it in a custom provider
 */
class MatPaginatorIntl {
    /**
     * Stream to emit from when labels are changed. Use this to notify components when the labels have
     * changed after initialization.
     */
    changes = new Subject();
    /** A label for the page size selector. */
    itemsPerPageLabel = 'Items per page:';
    /** A label for the button that increments the current page. */
    nextPageLabel = 'Next page';
    /** A label for the button that decrements the current page. */
    previousPageLabel = 'Previous page';
    /** A label for the button that moves to the first page. */
    firstPageLabel = 'First page';
    /** A label for the button that moves to the last page. */
    lastPageLabel = 'Last page';
    /** A label for the range of items within the current page and the length of the whole list. */
    getRangeLabel = (page, pageSize, length) => {
        if (length == 0 || pageSize == 0) {
            return `0 of ${length}`;
        }
        length = Math.max(length, 0);
        const startIndex = page * pageSize;
        // If the start index exceeds the list length, do not try and fix the end index to the end.
        const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
        return `${startIndex + 1} – ${endIndex} of ${length}`;
    };
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatPaginatorIntl, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatPaginatorIntl, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatPaginatorIntl, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
/**
 * @docs-private
 * @deprecated No longer used, will be removed.
 * @breaking-change 21.0.0
 */
function MAT_PAGINATOR_INTL_PROVIDER_FACTORY(parentIntl) {
    return parentIntl || new MatPaginatorIntl();
}
/**
 * @docs-private
 * @deprecated No longer used, will be removed.
 * @breaking-change 21.0.0
 */
const MAT_PAGINATOR_INTL_PROVIDER = {
    // If there is already an MatPaginatorIntl available, use that. Otherwise, provide a new one.
    provide: MatPaginatorIntl,
    deps: [[new Optional(), new SkipSelf(), MatPaginatorIntl]],
    useFactory: MAT_PAGINATOR_INTL_PROVIDER_FACTORY,
};

/** The default page size if there is no page size and there are no provided page size options. */
const DEFAULT_PAGE_SIZE = 50;
/**
 * Change event object that is emitted when the user selects a
 * different page size or navigates to another page.
 */
class PageEvent {
    /** The current page index. */
    pageIndex;
    /**
     * Index of the page that was selected previously.
     * @breaking-change 8.0.0 To be made into a required property.
     */
    previousPageIndex;
    /** The current page size. */
    pageSize;
    /** The current total number of items being paged. */
    length;
}
/** Injection token that can be used to provide the default options for the paginator module. */
const MAT_PAGINATOR_DEFAULT_OPTIONS = new InjectionToken('MAT_PAGINATOR_DEFAULT_OPTIONS');
/**
 * Component to provide navigation between paged information. Displays the size of the current
 * page, user-selectable options to change that size, what items are being shown, and
 * navigational button to go to the previous or next page.
 */
class MatPaginator {
    _intl = inject(MatPaginatorIntl);
    _changeDetectorRef = inject(ChangeDetectorRef);
    /** If set, styles the "page size" form field with the designated style. */
    _formFieldAppearance;
    /** ID for the DOM node containing the paginator's items per page label. */
    _pageSizeLabelId = inject(_IdGenerator).getId('mat-paginator-page-size-label-');
    _intlChanges;
    _isInitialized = false;
    _initializedStream = new ReplaySubject(1);
    /**
     * Theme color of the underlying form controls. This API is supported in M2
     * themes only,it has no effect in M3 themes. For color customization in M3, see https://material.angular.dev/components/paginator/styling.
     *
     * For information on applying color variants in M3, see
     * https://material.angular.dev/guide/material-2-theming#optional-add-backwards-compatibility-styles-for-color-variants
     */
    color;
    /** The zero-based page index of the displayed list of items. Defaulted to 0. */
    get pageIndex() {
        return this._pageIndex;
    }
    set pageIndex(value) {
        this._pageIndex = Math.max(value || 0, 0);
        this._changeDetectorRef.markForCheck();
    }
    _pageIndex = 0;
    /** The length of the total number of items that are being paginated. Defaulted to 0. */
    get length() {
        return this._length;
    }
    set length(value) {
        this._length = value || 0;
        this._changeDetectorRef.markForCheck();
    }
    _length = 0;
    /** Number of items to display on a page. By default set to 50. */
    get pageSize() {
        return this._pageSize;
    }
    set pageSize(value) {
        this._pageSize = Math.max(value || 0, 0);
        this._updateDisplayedPageSizeOptions();
    }
    _pageSize;
    /** The set of provided page size options to display to the user. */
    get pageSizeOptions() {
        return this._pageSizeOptions;
    }
    set pageSizeOptions(value) {
        this._pageSizeOptions = (value || []).map(p => numberAttribute(p, 0));
        this._updateDisplayedPageSizeOptions();
    }
    _pageSizeOptions = [];
    /** Whether to hide the page size selection UI from the user. */
    hidePageSize = false;
    /** Whether to show the first/last buttons UI to the user. */
    showFirstLastButtons = false;
    /** Used to configure the underlying `MatSelect` inside the paginator. */
    selectConfig = {};
    /** Whether the paginator is disabled. */
    disabled = false;
    /** Event emitted when the paginator changes the page size or page index. */
    page = new EventEmitter();
    /** Displayed set of page size options. Will be sorted and include current page size. */
    _displayedPageSizeOptions;
    /** Emits when the paginator is initialized. */
    initialized = this._initializedStream;
    constructor() {
        const _intl = this._intl;
        const defaults = inject(MAT_PAGINATOR_DEFAULT_OPTIONS, {
            optional: true,
        });
        this._intlChanges = _intl.changes.subscribe(() => this._changeDetectorRef.markForCheck());
        if (defaults) {
            const { pageSize, pageSizeOptions, hidePageSize, showFirstLastButtons } = defaults;
            if (pageSize != null) {
                this._pageSize = pageSize;
            }
            if (pageSizeOptions != null) {
                this._pageSizeOptions = pageSizeOptions;
            }
            if (hidePageSize != null) {
                this.hidePageSize = hidePageSize;
            }
            if (showFirstLastButtons != null) {
                this.showFirstLastButtons = showFirstLastButtons;
            }
        }
        this._formFieldAppearance = defaults?.formFieldAppearance || 'outline';
    }
    ngOnInit() {
        this._isInitialized = true;
        this._updateDisplayedPageSizeOptions();
        this._initializedStream.next();
    }
    ngOnDestroy() {
        this._initializedStream.complete();
        this._intlChanges.unsubscribe();
    }
    /** Advances to the next page if it exists. */
    nextPage() {
        if (this.hasNextPage()) {
            this._navigate(this.pageIndex + 1);
        }
    }
    /** Move back to the previous page if it exists. */
    previousPage() {
        if (this.hasPreviousPage()) {
            this._navigate(this.pageIndex - 1);
        }
    }
    /** Move to the first page if not already there. */
    firstPage() {
        // hasPreviousPage being false implies at the start
        if (this.hasPreviousPage()) {
            this._navigate(0);
        }
    }
    /** Move to the last page if not already there. */
    lastPage() {
        // hasNextPage being false implies at the end
        if (this.hasNextPage()) {
            this._navigate(this.getNumberOfPages() - 1);
        }
    }
    /** Whether there is a previous page. */
    hasPreviousPage() {
        return this.pageIndex >= 1 && this.pageSize != 0;
    }
    /** Whether there is a next page. */
    hasNextPage() {
        const maxPageIndex = this.getNumberOfPages() - 1;
        return this.pageIndex < maxPageIndex && this.pageSize != 0;
    }
    /** Calculate the number of pages */
    getNumberOfPages() {
        if (!this.pageSize) {
            return 0;
        }
        return Math.ceil(this.length / this.pageSize);
    }
    /**
     * Changes the page size so that the first item displayed on the page will still be
     * displayed using the new page size.
     *
     * For example, if the page size is 10 and on the second page (items indexed 10-19) then
     * switching so that the page size is 5 will set the third page as the current page so
     * that the 10th item will still be displayed.
     */
    _changePageSize(pageSize) {
        // Current page needs to be updated to reflect the new page size. Navigate to the page
        // containing the previous page's first item.
        const startIndex = this.pageIndex * this.pageSize;
        const previousPageIndex = this.pageIndex;
        this.pageIndex = Math.floor(startIndex / pageSize) || 0;
        this.pageSize = pageSize;
        this._emitPageEvent(previousPageIndex);
    }
    /** Checks whether the buttons for going forwards should be disabled. */
    _nextButtonsDisabled() {
        return this.disabled || !this.hasNextPage();
    }
    /** Checks whether the buttons for going backwards should be disabled. */
    _previousButtonsDisabled() {
        return this.disabled || !this.hasPreviousPage();
    }
    /**
     * Updates the list of page size options to display to the user. Includes making sure that
     * the page size is an option and that the list is sorted.
     */
    _updateDisplayedPageSizeOptions() {
        if (!this._isInitialized) {
            return;
        }
        // If no page size is provided, use the first page size option or the default page size.
        if (!this.pageSize) {
            this._pageSize =
                this.pageSizeOptions.length != 0 ? this.pageSizeOptions[0] : DEFAULT_PAGE_SIZE;
        }
        this._displayedPageSizeOptions = this.pageSizeOptions.slice();
        if (this._displayedPageSizeOptions.indexOf(this.pageSize) === -1) {
            this._displayedPageSizeOptions.push(this.pageSize);
        }
        // Sort the numbers using a number-specific sort function.
        this._displayedPageSizeOptions.sort((a, b) => a - b);
        this._changeDetectorRef.markForCheck();
    }
    /** Emits an event notifying that a change of the paginator's properties has been triggered. */
    _emitPageEvent(previousPageIndex) {
        this.page.emit({
            previousPageIndex,
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            length: this.length,
        });
    }
    /** Navigates to a specific page index. */
    _navigate(index) {
        const previousIndex = this.pageIndex;
        if (index !== previousIndex) {
            this.pageIndex = index;
            this._emitPageEvent(previousIndex);
        }
    }
    /**
     * Callback invoked when one of the navigation buttons is called.
     * @param targetIndex Index to which the paginator should navigate.
     * @param isDisabled Whether the button is disabled.
     */
    _buttonClicked(targetIndex, isDisabled) {
        // Note that normally disabled buttons won't dispatch the click event, but the paginator ones
        // do, because we're using `disabledInteractive` to allow them to be focusable. We need to
        // check here to avoid the navigation.
        if (!isDisabled) {
            this._navigate(targetIndex);
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatPaginator, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "20.2.0-next.2", type: MatPaginator, isStandalone: true, selector: "mat-paginator", inputs: { color: "color", pageIndex: ["pageIndex", "pageIndex", numberAttribute], length: ["length", "length", numberAttribute], pageSize: ["pageSize", "pageSize", numberAttribute], pageSizeOptions: "pageSizeOptions", hidePageSize: ["hidePageSize", "hidePageSize", booleanAttribute], showFirstLastButtons: ["showFirstLastButtons", "showFirstLastButtons", booleanAttribute], selectConfig: "selectConfig", disabled: ["disabled", "disabled", booleanAttribute] }, outputs: { page: "page" }, host: { attributes: { "role": "group" }, classAttribute: "mat-mdc-paginator" }, exportAs: ["matPaginator"], ngImport: i0, template: "<div class=\"mat-mdc-paginator-outer-container\">\n  <div class=\"mat-mdc-paginator-container\">\n    @if (!hidePageSize) {\n      <div class=\"mat-mdc-paginator-page-size\">\n        <div class=\"mat-mdc-paginator-page-size-label\" [attr.id]=\"_pageSizeLabelId\">\n          {{_intl.itemsPerPageLabel}}\n        </div>\n\n        @if (_displayedPageSizeOptions.length > 1) {\n          <mat-form-field\n            [appearance]=\"_formFieldAppearance!\"\n            [color]=\"color\"\n            class=\"mat-mdc-paginator-page-size-select\">\n            <mat-select\n              #selectRef\n              [value]=\"pageSize\"\n              [disabled]=\"disabled\"\n              [aria-labelledby]=\"_pageSizeLabelId\"\n              [panelClass]=\"selectConfig.panelClass || ''\"\n              [disableOptionCentering]=\"selectConfig.disableOptionCentering\"\n              (selectionChange)=\"_changePageSize($event.value)\"\n              hideSingleSelectionIndicator>\n              @for (pageSizeOption of _displayedPageSizeOptions; track pageSizeOption) {\n                <mat-option [value]=\"pageSizeOption\">\n                  {{pageSizeOption}}\n                </mat-option>\n              }\n            </mat-select>\n          <div class=\"mat-mdc-paginator-touch-target\" (click)=\"selectRef.open()\"></div>\n          </mat-form-field>\n        }\n\n        @if (_displayedPageSizeOptions.length <= 1) {\n          <div class=\"mat-mdc-paginator-page-size-value\">{{pageSize}}</div>\n        }\n      </div>\n    }\n\n    <div class=\"mat-mdc-paginator-range-actions\">\n      <div class=\"mat-mdc-paginator-range-label\" aria-live=\"polite\">\n        {{_intl.getRangeLabel(pageIndex, pageSize, length)}}\n      </div>\n\n      <!--\n      The buttons use `disabledInteractive` so that they can retain focus if they become disabled,\n      otherwise focus is moved to the document body. However, users should not be able to navigate\n      into these buttons, so `tabindex` is set to -1 when disabled.\n      -->\n\n      @if (showFirstLastButtons) {\n        <button matIconButton type=\"button\"\n                class=\"mat-mdc-paginator-navigation-first\"\n                (click)=\"_buttonClicked(0, _previousButtonsDisabled())\"\n                [attr.aria-label]=\"_intl.firstPageLabel\"\n                [matTooltip]=\"_intl.firstPageLabel\"\n                [matTooltipDisabled]=\"_previousButtonsDisabled()\"\n                matTooltipPosition=\"above\"\n                [disabled]=\"_previousButtonsDisabled()\"\n                [tabindex]=\"_previousButtonsDisabled() ? -1 : null\"\n                disabledInteractive>\n          <svg class=\"mat-mdc-paginator-icon\"\n              viewBox=\"0 0 24 24\"\n              focusable=\"false\"\n              aria-hidden=\"true\">\n            <path d=\"M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z\"/>\n          </svg>\n        </button>\n      }\n      <button matIconButton type=\"button\"\n              class=\"mat-mdc-paginator-navigation-previous\"\n              (click)=\"_buttonClicked(pageIndex - 1, _previousButtonsDisabled())\"\n              [attr.aria-label]=\"_intl.previousPageLabel\"\n              [matTooltip]=\"_intl.previousPageLabel\"\n              [matTooltipDisabled]=\"_previousButtonsDisabled()\"\n              matTooltipPosition=\"above\"\n              [disabled]=\"_previousButtonsDisabled()\"\n              [tabindex]=\"_previousButtonsDisabled() ? -1 : null\"\n              disabledInteractive>\n        <svg class=\"mat-mdc-paginator-icon\"\n             viewBox=\"0 0 24 24\"\n             focusable=\"false\"\n             aria-hidden=\"true\">\n          <path d=\"M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z\"/>\n        </svg>\n      </button>\n      <button matIconButton type=\"button\"\n              class=\"mat-mdc-paginator-navigation-next\"\n              (click)=\"_buttonClicked(pageIndex + 1, _nextButtonsDisabled())\"\n              [attr.aria-label]=\"_intl.nextPageLabel\"\n              [matTooltip]=\"_intl.nextPageLabel\"\n              [matTooltipDisabled]=\"_nextButtonsDisabled()\"\n              matTooltipPosition=\"above\"\n              [disabled]=\"_nextButtonsDisabled()\"\n              [tabindex]=\"_nextButtonsDisabled() ? -1 : null\"\n              disabledInteractive>\n        <svg class=\"mat-mdc-paginator-icon\"\n             viewBox=\"0 0 24 24\"\n             focusable=\"false\"\n             aria-hidden=\"true\">\n          <path d=\"M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z\"/>\n        </svg>\n      </button>\n      @if (showFirstLastButtons) {\n        <button matIconButton type=\"button\"\n                class=\"mat-mdc-paginator-navigation-last\"\n                (click)=\"_buttonClicked(getNumberOfPages() - 1, _nextButtonsDisabled())\"\n                [attr.aria-label]=\"_intl.lastPageLabel\"\n                [matTooltip]=\"_intl.lastPageLabel\"\n                [matTooltipDisabled]=\"_nextButtonsDisabled()\"\n                matTooltipPosition=\"above\"\n                [disabled]=\"_nextButtonsDisabled()\"\n                [tabindex]=\"_nextButtonsDisabled() ? -1 : null\"\n                disabledInteractive>\n          <svg class=\"mat-mdc-paginator-icon\"\n              viewBox=\"0 0 24 24\"\n              focusable=\"false\"\n              aria-hidden=\"true\">\n            <path d=\"M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z\"/>\n          </svg>\n        </button>\n      }\n    </div>\n  </div>\n</div>\n", styles: [".mat-mdc-paginator{display:block;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;color:var(--mat-paginator-container-text-color, var(--mat-sys-on-surface));background-color:var(--mat-paginator-container-background-color, var(--mat-sys-surface));font-family:var(--mat-paginator-container-text-font, var(--mat-sys-body-small-font));line-height:var(--mat-paginator-container-text-line-height, var(--mat-sys-body-small-line-height));font-size:var(--mat-paginator-container-text-size, var(--mat-sys-body-small-size));font-weight:var(--mat-paginator-container-text-weight, var(--mat-sys-body-small-weight));letter-spacing:var(--mat-paginator-container-text-tracking, var(--mat-sys-body-small-tracking));--mat-form-field-container-height: var(--mat-paginator-form-field-container-height, 40px);--mat-form-field-container-vertical-padding: var(--mat-paginator-form-field-container-vertical-padding, 8px)}.mat-mdc-paginator .mat-mdc-select-value{font-size:var(--mat-paginator-select-trigger-text-size, var(--mat-sys-body-small-size))}.mat-mdc-paginator .mat-mdc-form-field-subscript-wrapper{display:none}.mat-mdc-paginator .mat-mdc-select{line-height:1.5}.mat-mdc-paginator-outer-container{display:flex}.mat-mdc-paginator-container{display:flex;align-items:center;justify-content:flex-end;padding:0 8px;flex-wrap:wrap;width:100%;min-height:var(--mat-paginator-container-size, 56px)}.mat-mdc-paginator-page-size{display:flex;align-items:baseline;margin-right:8px}[dir=rtl] .mat-mdc-paginator-page-size{margin-right:0;margin-left:8px}.mat-mdc-paginator-page-size-label{margin:0 4px}.mat-mdc-paginator-page-size-select{margin:0 4px;width:var(--mat-paginator-page-size-select-width, 84px)}.mat-mdc-paginator-range-label{margin:0 32px 0 24px}.mat-mdc-paginator-range-actions{display:flex;align-items:center}.mat-mdc-paginator-icon{display:inline-block;width:28px;fill:var(--mat-paginator-enabled-icon-color, var(--mat-sys-on-surface-variant))}.mat-mdc-icon-button[aria-disabled] .mat-mdc-paginator-icon{fill:var(--mat-paginator-disabled-icon-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}[dir=rtl] .mat-mdc-paginator-icon{transform:rotate(180deg)}@media(forced-colors: active){.mat-mdc-icon-button[aria-disabled] .mat-mdc-paginator-icon,.mat-mdc-paginator-icon{fill:currentColor}.mat-mdc-paginator-range-actions .mat-mdc-icon-button{outline:solid 1px}.mat-mdc-paginator-range-actions .mat-mdc-icon-button[aria-disabled]{color:GrayText}}.mat-mdc-paginator-touch-target{display:var(--mat-paginator-touch-target-display, block);position:absolute;top:50%;left:50%;width:var(--mat-paginator-page-size-select-width, 84px);height:var(--mat-paginator-page-size-select-touch-target-height, 48px);background-color:rgba(0,0,0,0);transform:translate(-50%, -50%);cursor:pointer}\n"], dependencies: [{ kind: "component", type: MatFormField, selector: "mat-form-field", inputs: ["hideRequiredMarker", "color", "floatLabel", "appearance", "subscriptSizing", "hintLabel"], exportAs: ["matFormField"] }, { kind: "component", type: MatSelect, selector: "mat-select", inputs: ["aria-describedby", "panelClass", "disabled", "disableRipple", "tabIndex", "hideSingleSelectionIndicator", "placeholder", "required", "multiple", "disableOptionCentering", "compareWith", "value", "aria-label", "aria-labelledby", "errorStateMatcher", "typeaheadDebounceInterval", "sortComparator", "id", "panelWidth", "canSelectNullableOptions"], outputs: ["openedChange", "opened", "closed", "selectionChange", "valueChange"], exportAs: ["matSelect"] }, { kind: "component", type: MatOption, selector: "mat-option", inputs: ["value", "id", "disabled"], outputs: ["onSelectionChange"], exportAs: ["matOption"] }, { kind: "component", type: MatIconButton, selector: "button[mat-icon-button], a[mat-icon-button], button[matIconButton], a[matIconButton]", exportAs: ["matButton", "matAnchor"] }, { kind: "directive", type: MatTooltip, selector: "[matTooltip]", inputs: ["matTooltipPosition", "matTooltipPositionAtOrigin", "matTooltipDisabled", "matTooltipShowDelay", "matTooltipHideDelay", "matTooltipTouchGestures", "matTooltip", "matTooltipClass"], exportAs: ["matTooltip"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatPaginator, decorators: [{
            type: Component,
            args: [{ selector: 'mat-paginator', exportAs: 'matPaginator', host: {
                        'class': 'mat-mdc-paginator',
                        'role': 'group',
                    }, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, imports: [MatFormField, MatSelect, MatOption, MatIconButton, MatTooltip], template: "<div class=\"mat-mdc-paginator-outer-container\">\n  <div class=\"mat-mdc-paginator-container\">\n    @if (!hidePageSize) {\n      <div class=\"mat-mdc-paginator-page-size\">\n        <div class=\"mat-mdc-paginator-page-size-label\" [attr.id]=\"_pageSizeLabelId\">\n          {{_intl.itemsPerPageLabel}}\n        </div>\n\n        @if (_displayedPageSizeOptions.length > 1) {\n          <mat-form-field\n            [appearance]=\"_formFieldAppearance!\"\n            [color]=\"color\"\n            class=\"mat-mdc-paginator-page-size-select\">\n            <mat-select\n              #selectRef\n              [value]=\"pageSize\"\n              [disabled]=\"disabled\"\n              [aria-labelledby]=\"_pageSizeLabelId\"\n              [panelClass]=\"selectConfig.panelClass || ''\"\n              [disableOptionCentering]=\"selectConfig.disableOptionCentering\"\n              (selectionChange)=\"_changePageSize($event.value)\"\n              hideSingleSelectionIndicator>\n              @for (pageSizeOption of _displayedPageSizeOptions; track pageSizeOption) {\n                <mat-option [value]=\"pageSizeOption\">\n                  {{pageSizeOption}}\n                </mat-option>\n              }\n            </mat-select>\n          <div class=\"mat-mdc-paginator-touch-target\" (click)=\"selectRef.open()\"></div>\n          </mat-form-field>\n        }\n\n        @if (_displayedPageSizeOptions.length <= 1) {\n          <div class=\"mat-mdc-paginator-page-size-value\">{{pageSize}}</div>\n        }\n      </div>\n    }\n\n    <div class=\"mat-mdc-paginator-range-actions\">\n      <div class=\"mat-mdc-paginator-range-label\" aria-live=\"polite\">\n        {{_intl.getRangeLabel(pageIndex, pageSize, length)}}\n      </div>\n\n      <!--\n      The buttons use `disabledInteractive` so that they can retain focus if they become disabled,\n      otherwise focus is moved to the document body. However, users should not be able to navigate\n      into these buttons, so `tabindex` is set to -1 when disabled.\n      -->\n\n      @if (showFirstLastButtons) {\n        <button matIconButton type=\"button\"\n                class=\"mat-mdc-paginator-navigation-first\"\n                (click)=\"_buttonClicked(0, _previousButtonsDisabled())\"\n                [attr.aria-label]=\"_intl.firstPageLabel\"\n                [matTooltip]=\"_intl.firstPageLabel\"\n                [matTooltipDisabled]=\"_previousButtonsDisabled()\"\n                matTooltipPosition=\"above\"\n                [disabled]=\"_previousButtonsDisabled()\"\n                [tabindex]=\"_previousButtonsDisabled() ? -1 : null\"\n                disabledInteractive>\n          <svg class=\"mat-mdc-paginator-icon\"\n              viewBox=\"0 0 24 24\"\n              focusable=\"false\"\n              aria-hidden=\"true\">\n            <path d=\"M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z\"/>\n          </svg>\n        </button>\n      }\n      <button matIconButton type=\"button\"\n              class=\"mat-mdc-paginator-navigation-previous\"\n              (click)=\"_buttonClicked(pageIndex - 1, _previousButtonsDisabled())\"\n              [attr.aria-label]=\"_intl.previousPageLabel\"\n              [matTooltip]=\"_intl.previousPageLabel\"\n              [matTooltipDisabled]=\"_previousButtonsDisabled()\"\n              matTooltipPosition=\"above\"\n              [disabled]=\"_previousButtonsDisabled()\"\n              [tabindex]=\"_previousButtonsDisabled() ? -1 : null\"\n              disabledInteractive>\n        <svg class=\"mat-mdc-paginator-icon\"\n             viewBox=\"0 0 24 24\"\n             focusable=\"false\"\n             aria-hidden=\"true\">\n          <path d=\"M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z\"/>\n        </svg>\n      </button>\n      <button matIconButton type=\"button\"\n              class=\"mat-mdc-paginator-navigation-next\"\n              (click)=\"_buttonClicked(pageIndex + 1, _nextButtonsDisabled())\"\n              [attr.aria-label]=\"_intl.nextPageLabel\"\n              [matTooltip]=\"_intl.nextPageLabel\"\n              [matTooltipDisabled]=\"_nextButtonsDisabled()\"\n              matTooltipPosition=\"above\"\n              [disabled]=\"_nextButtonsDisabled()\"\n              [tabindex]=\"_nextButtonsDisabled() ? -1 : null\"\n              disabledInteractive>\n        <svg class=\"mat-mdc-paginator-icon\"\n             viewBox=\"0 0 24 24\"\n             focusable=\"false\"\n             aria-hidden=\"true\">\n          <path d=\"M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z\"/>\n        </svg>\n      </button>\n      @if (showFirstLastButtons) {\n        <button matIconButton type=\"button\"\n                class=\"mat-mdc-paginator-navigation-last\"\n                (click)=\"_buttonClicked(getNumberOfPages() - 1, _nextButtonsDisabled())\"\n                [attr.aria-label]=\"_intl.lastPageLabel\"\n                [matTooltip]=\"_intl.lastPageLabel\"\n                [matTooltipDisabled]=\"_nextButtonsDisabled()\"\n                matTooltipPosition=\"above\"\n                [disabled]=\"_nextButtonsDisabled()\"\n                [tabindex]=\"_nextButtonsDisabled() ? -1 : null\"\n                disabledInteractive>\n          <svg class=\"mat-mdc-paginator-icon\"\n              viewBox=\"0 0 24 24\"\n              focusable=\"false\"\n              aria-hidden=\"true\">\n            <path d=\"M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z\"/>\n          </svg>\n        </button>\n      }\n    </div>\n  </div>\n</div>\n", styles: [".mat-mdc-paginator{display:block;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;color:var(--mat-paginator-container-text-color, var(--mat-sys-on-surface));background-color:var(--mat-paginator-container-background-color, var(--mat-sys-surface));font-family:var(--mat-paginator-container-text-font, var(--mat-sys-body-small-font));line-height:var(--mat-paginator-container-text-line-height, var(--mat-sys-body-small-line-height));font-size:var(--mat-paginator-container-text-size, var(--mat-sys-body-small-size));font-weight:var(--mat-paginator-container-text-weight, var(--mat-sys-body-small-weight));letter-spacing:var(--mat-paginator-container-text-tracking, var(--mat-sys-body-small-tracking));--mat-form-field-container-height: var(--mat-paginator-form-field-container-height, 40px);--mat-form-field-container-vertical-padding: var(--mat-paginator-form-field-container-vertical-padding, 8px)}.mat-mdc-paginator .mat-mdc-select-value{font-size:var(--mat-paginator-select-trigger-text-size, var(--mat-sys-body-small-size))}.mat-mdc-paginator .mat-mdc-form-field-subscript-wrapper{display:none}.mat-mdc-paginator .mat-mdc-select{line-height:1.5}.mat-mdc-paginator-outer-container{display:flex}.mat-mdc-paginator-container{display:flex;align-items:center;justify-content:flex-end;padding:0 8px;flex-wrap:wrap;width:100%;min-height:var(--mat-paginator-container-size, 56px)}.mat-mdc-paginator-page-size{display:flex;align-items:baseline;margin-right:8px}[dir=rtl] .mat-mdc-paginator-page-size{margin-right:0;margin-left:8px}.mat-mdc-paginator-page-size-label{margin:0 4px}.mat-mdc-paginator-page-size-select{margin:0 4px;width:var(--mat-paginator-page-size-select-width, 84px)}.mat-mdc-paginator-range-label{margin:0 32px 0 24px}.mat-mdc-paginator-range-actions{display:flex;align-items:center}.mat-mdc-paginator-icon{display:inline-block;width:28px;fill:var(--mat-paginator-enabled-icon-color, var(--mat-sys-on-surface-variant))}.mat-mdc-icon-button[aria-disabled] .mat-mdc-paginator-icon{fill:var(--mat-paginator-disabled-icon-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}[dir=rtl] .mat-mdc-paginator-icon{transform:rotate(180deg)}@media(forced-colors: active){.mat-mdc-icon-button[aria-disabled] .mat-mdc-paginator-icon,.mat-mdc-paginator-icon{fill:currentColor}.mat-mdc-paginator-range-actions .mat-mdc-icon-button{outline:solid 1px}.mat-mdc-paginator-range-actions .mat-mdc-icon-button[aria-disabled]{color:GrayText}}.mat-mdc-paginator-touch-target{display:var(--mat-paginator-touch-target-display, block);position:absolute;top:50%;left:50%;width:var(--mat-paginator-page-size-select-width, 84px);height:var(--mat-paginator-page-size-select-touch-target-height, 48px);background-color:rgba(0,0,0,0);transform:translate(-50%, -50%);cursor:pointer}\n"] }]
        }], ctorParameters: () => [], propDecorators: { color: [{
                type: Input
            }], pageIndex: [{
                type: Input,
                args: [{ transform: numberAttribute }]
            }], length: [{
                type: Input,
                args: [{ transform: numberAttribute }]
            }], pageSize: [{
                type: Input,
                args: [{ transform: numberAttribute }]
            }], pageSizeOptions: [{
                type: Input
            }], hidePageSize: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], showFirstLastButtons: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], selectConfig: [{
                type: Input
            }], disabled: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], page: [{
                type: Output
            }] } });

class MatPaginatorModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatPaginatorModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatPaginatorModule, imports: [MatButtonModule, MatSelectModule, MatTooltipModule, MatPaginator], exports: [MatPaginator] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatPaginatorModule, providers: [MAT_PAGINATOR_INTL_PROVIDER], imports: [MatButtonModule, MatSelectModule, MatTooltipModule, MatPaginator] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: MatPaginatorModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [MatButtonModule, MatSelectModule, MatTooltipModule, MatPaginator],
                    exports: [MatPaginator],
                    providers: [MAT_PAGINATOR_INTL_PROVIDER],
                }]
        }] });

export { MAT_PAGINATOR_DEFAULT_OPTIONS, MAT_PAGINATOR_INTL_PROVIDER, MAT_PAGINATOR_INTL_PROVIDER_FACTORY, MatPaginator, MatPaginatorIntl, MatPaginatorModule, PageEvent };
//# sourceMappingURL=paginator.mjs.map

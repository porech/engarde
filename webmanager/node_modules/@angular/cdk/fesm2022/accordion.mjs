import * as i0 from '@angular/core';
import { InjectionToken, inject, booleanAttribute, Directive, Input, ChangeDetectorRef, EventEmitter, signal, Output, NgModule } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { _IdGenerator } from './id-generator.mjs';
import { UniqueSelectionDispatcher } from './unique-selection-dispatcher.mjs';

/**
 * Injection token that can be used to reference instances of `CdkAccordion`. It serves
 * as alternative token to the actual `CdkAccordion` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
const CDK_ACCORDION = new InjectionToken('CdkAccordion');
/**
 * Directive whose purpose is to manage the expanded state of CdkAccordionItem children.
 */
class CdkAccordion {
    /** Emits when the state of the accordion changes */
    _stateChanges = new Subject();
    /** Stream that emits true/false when openAll/closeAll is triggered. */
    _openCloseAllActions = new Subject();
    /** A readonly id value to use for unique selection coordination. */
    id = inject(_IdGenerator).getId('cdk-accordion-');
    /** Whether the accordion should allow multiple expanded accordion items simultaneously. */
    multi = false;
    /** Opens all enabled accordion items in an accordion where multi is enabled. */
    openAll() {
        if (this.multi) {
            this._openCloseAllActions.next(true);
        }
    }
    /** Closes all enabled accordion items. */
    closeAll() {
        this._openCloseAllActions.next(false);
    }
    ngOnChanges(changes) {
        this._stateChanges.next(changes);
    }
    ngOnDestroy() {
        this._stateChanges.complete();
        this._openCloseAllActions.complete();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: CdkAccordion, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "16.1.0", version: "20.2.0-next.2", type: CdkAccordion, isStandalone: true, selector: "cdk-accordion, [cdkAccordion]", inputs: { multi: ["multi", "multi", booleanAttribute] }, providers: [{ provide: CDK_ACCORDION, useExisting: CdkAccordion }], exportAs: ["cdkAccordion"], usesOnChanges: true, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: CdkAccordion, decorators: [{
            type: Directive,
            args: [{
                    selector: 'cdk-accordion, [cdkAccordion]',
                    exportAs: 'cdkAccordion',
                    providers: [{ provide: CDK_ACCORDION, useExisting: CdkAccordion }],
                }]
        }], propDecorators: { multi: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }] } });

/**
 * A basic directive expected to be extended and decorated as a component.  Sets up all
 * events and attributes needed to be managed by a CdkAccordion parent.
 */
class CdkAccordionItem {
    accordion = inject(CDK_ACCORDION, { optional: true, skipSelf: true });
    _changeDetectorRef = inject(ChangeDetectorRef);
    _expansionDispatcher = inject(UniqueSelectionDispatcher);
    /** Subscription to openAll/closeAll events. */
    _openCloseAllSubscription = Subscription.EMPTY;
    /** Event emitted every time the AccordionItem is closed. */
    closed = new EventEmitter();
    /** Event emitted every time the AccordionItem is opened. */
    opened = new EventEmitter();
    /** Event emitted when the AccordionItem is destroyed. */
    destroyed = new EventEmitter();
    /**
     * Emits whenever the expanded state of the accordion changes.
     * Primarily used to facilitate two-way binding.
     * @docs-private
     */
    expandedChange = new EventEmitter();
    /** The unique AccordionItem id. */
    id = inject(_IdGenerator).getId('cdk-accordion-child-');
    /** Whether the AccordionItem is expanded. */
    get expanded() {
        return this._expanded;
    }
    set expanded(expanded) {
        // Only emit events and update the internal value if the value changes.
        if (this._expanded !== expanded) {
            this._expanded = expanded;
            this.expandedChange.emit(expanded);
            if (expanded) {
                this.opened.emit();
                /**
                 * In the unique selection dispatcher, the id parameter is the id of the CdkAccordionItem,
                 * the name value is the id of the accordion.
                 */
                const accordionId = this.accordion ? this.accordion.id : this.id;
                this._expansionDispatcher.notify(this.id, accordionId);
            }
            else {
                this.closed.emit();
            }
            // Ensures that the animation will run when the value is set outside of an `@Input`.
            // This includes cases like the open, close and toggle methods.
            this._changeDetectorRef.markForCheck();
        }
    }
    _expanded = false;
    /** Whether the AccordionItem is disabled. */
    get disabled() {
        return this._disabled();
    }
    set disabled(value) {
        this._disabled.set(value);
    }
    _disabled = signal(false, ...(ngDevMode ? [{ debugName: "_disabled" }] : []));
    /** Unregister function for _expansionDispatcher. */
    _removeUniqueSelectionListener = () => { };
    constructor() { }
    ngOnInit() {
        this._removeUniqueSelectionListener = this._expansionDispatcher.listen((id, accordionId) => {
            if (this.accordion &&
                !this.accordion.multi &&
                this.accordion.id === accordionId &&
                this.id !== id) {
                this.expanded = false;
            }
        });
        // When an accordion item is hosted in an accordion, subscribe to open/close events.
        if (this.accordion) {
            this._openCloseAllSubscription = this._subscribeToOpenCloseAllActions();
        }
    }
    /** Emits an event for the accordion item being destroyed. */
    ngOnDestroy() {
        this.opened.complete();
        this.closed.complete();
        this.destroyed.emit();
        this.destroyed.complete();
        this._removeUniqueSelectionListener();
        this._openCloseAllSubscription.unsubscribe();
    }
    /** Toggles the expanded state of the accordion item. */
    toggle() {
        if (!this.disabled) {
            this.expanded = !this.expanded;
        }
    }
    /** Sets the expanded state of the accordion item to false. */
    close() {
        if (!this.disabled) {
            this.expanded = false;
        }
    }
    /** Sets the expanded state of the accordion item to true. */
    open() {
        if (!this.disabled) {
            this.expanded = true;
        }
    }
    _subscribeToOpenCloseAllActions() {
        return this.accordion._openCloseAllActions.subscribe(expanded => {
            // Only change expanded state if item is enabled
            if (!this.disabled) {
                this.expanded = expanded;
            }
        });
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: CdkAccordionItem, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "16.1.0", version: "20.2.0-next.2", type: CdkAccordionItem, isStandalone: true, selector: "cdk-accordion-item, [cdkAccordionItem]", inputs: { expanded: ["expanded", "expanded", booleanAttribute], disabled: ["disabled", "disabled", booleanAttribute] }, outputs: { closed: "closed", opened: "opened", destroyed: "destroyed", expandedChange: "expandedChange" }, providers: [
            // Provide `CDK_ACCORDION` as undefined to prevent nested accordion items from
            // registering to the same accordion.
            { provide: CDK_ACCORDION, useValue: undefined },
        ], exportAs: ["cdkAccordionItem"], ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: CdkAccordionItem, decorators: [{
            type: Directive,
            args: [{
                    selector: 'cdk-accordion-item, [cdkAccordionItem]',
                    exportAs: 'cdkAccordionItem',
                    providers: [
                        // Provide `CDK_ACCORDION` as undefined to prevent nested accordion items from
                        // registering to the same accordion.
                        { provide: CDK_ACCORDION, useValue: undefined },
                    ],
                }]
        }], ctorParameters: () => [], propDecorators: { closed: [{
                type: Output
            }], opened: [{
                type: Output
            }], destroyed: [{
                type: Output
            }], expandedChange: [{
                type: Output
            }], expanded: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], disabled: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }] } });

class CdkAccordionModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: CdkAccordionModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.0-next.2", ngImport: i0, type: CdkAccordionModule, imports: [CdkAccordion, CdkAccordionItem], exports: [CdkAccordion, CdkAccordionItem] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: CdkAccordionModule });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: CdkAccordionModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CdkAccordion, CdkAccordionItem],
                    exports: [CdkAccordion, CdkAccordionItem],
                }]
        }] });

export { CDK_ACCORDION, CdkAccordion, CdkAccordionItem, CdkAccordionModule };
//# sourceMappingURL=accordion.mjs.map

import * as i0 from '@angular/core';
import { inject, ElementRef, Directive, TemplateRef, InjectionToken, signal, EventEmitter, computed, booleanAttribute, Component, ViewEncapsulation, ChangeDetectionStrategy, ContentChild, ContentChildren, ViewChild, Input, Output, ChangeDetectorRef, QueryList, numberAttribute, NgModule } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { Subject, of } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';
import { Directionality } from './directionality.mjs';
import { _IdGenerator } from './id-generator.mjs';
import { FocusKeyManager } from './focus-key-manager.mjs';
import { hasModifierKey } from './keycodes.mjs';
import { SPACE, ENTER } from './keycodes2.mjs';
import { _getFocusedElementPierceShadowDom } from './shadow-dom.mjs';
import { BidiModule } from './bidi.mjs';
import './list-key-manager.mjs';
import './typeahead.mjs';

class CdkStepHeader {
    _elementRef = inject(ElementRef);
    constructor() { }
    /** Focuses the step header. */
    focus() {
        this._elementRef.nativeElement.focus();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: CdkStepHeader, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.0-next.2", type: CdkStepHeader, isStandalone: true, selector: "[cdkStepHeader]", host: { attributes: { "role": "tab" } }, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: CdkStepHeader, decorators: [{
            type: Directive,
            args: [{
                    selector: '[cdkStepHeader]',
                    host: {
                        'role': 'tab',
                    },
                }]
        }], ctorParameters: () => [] });

class CdkStepLabel {
    template = inject(TemplateRef);
    constructor() { }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: CdkStepLabel, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.0-next.2", type: CdkStepLabel, isStandalone: true, selector: "[cdkStepLabel]", ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: CdkStepLabel, decorators: [{
            type: Directive,
            args: [{
                    selector: '[cdkStepLabel]',
                }]
        }], ctorParameters: () => [] });

/** Change event emitted on selection changes. */
class StepperSelectionEvent {
    /** Index of the step now selected. */
    selectedIndex;
    /** Index of the step previously selected. */
    previouslySelectedIndex;
    /** The step instance now selected. */
    selectedStep;
    /** The step instance previously selected. */
    previouslySelectedStep;
}
/** Enum to represent the different states of the steps. */
const STEP_STATE = {
    NUMBER: 'number',
    EDIT: 'edit',
    DONE: 'done',
    ERROR: 'error',
};
/** InjectionToken that can be used to specify the global stepper options. */
const STEPPER_GLOBAL_OPTIONS = new InjectionToken('STEPPER_GLOBAL_OPTIONS');
class CdkStep {
    _stepperOptions;
    _stepper = inject(CdkStepper);
    _displayDefaultIndicatorType;
    /** Template for step label if it exists. */
    stepLabel;
    /** Forms that have been projected into the step. */
    _childForms;
    /** Template for step content. */
    content;
    /** The top level abstract control of the step. */
    stepControl;
    /** Whether user has attempted to move away from the step. */
    get interacted() {
        return this._interacted();
    }
    set interacted(value) {
        this._interacted.set(value);
    }
    _interacted = signal(false, ...(ngDevMode ? [{ debugName: "_interacted" }] : []));
    /** Emits when the user has attempted to move away from the step. */
    interactedStream = new EventEmitter();
    /** Plain text label of the step. */
    label;
    /** Error message to display when there's an error. */
    errorMessage;
    /** Aria label for the tab. */
    ariaLabel;
    /**
     * Reference to the element that the tab is labelled by.
     * Will be cleared if `aria-label` is set at the same time.
     */
    ariaLabelledby;
    /** State of the step. */
    get state() {
        return this._state();
    }
    set state(value) {
        this._state.set(value);
    }
    _state = signal(undefined, ...(ngDevMode ? [{ debugName: "_state" }] : []));
    /** Whether the user can return to this step once it has been marked as completed. */
    get editable() {
        return this._editable();
    }
    set editable(value) {
        this._editable.set(value);
    }
    _editable = signal(true, ...(ngDevMode ? [{ debugName: "_editable" }] : []));
    /** Whether the completion of step is optional. */
    optional = false;
    /** Whether step is marked as completed. */
    get completed() {
        const override = this._completedOverride();
        const interacted = this._interacted();
        if (override != null) {
            return override;
        }
        return interacted && (!this.stepControl || this.stepControl.valid);
    }
    set completed(value) {
        this._completedOverride.set(value);
    }
    _completedOverride = signal(null, ...(ngDevMode ? [{ debugName: "_completedOverride" }] : []));
    /** Current index of the step within the stepper. */
    index = signal(-1, ...(ngDevMode ? [{ debugName: "index" }] : []));
    /** Whether the step is selected. */
    isSelected = computed(() => this._stepper.selectedIndex === this.index(), ...(ngDevMode ? [{ debugName: "isSelected" }] : []));
    /** Type of indicator that should be shown for the step. */
    indicatorType = computed(() => {
        const selected = this.isSelected();
        const completed = this.completed;
        const defaultState = this._state() ?? STEP_STATE.NUMBER;
        const editable = this._editable();
        if (this._showError() && this.hasError && !selected) {
            return STEP_STATE.ERROR;
        }
        if (this._displayDefaultIndicatorType) {
            if (!completed || selected) {
                return STEP_STATE.NUMBER;
            }
            return editable ? STEP_STATE.EDIT : STEP_STATE.DONE;
        }
        else {
            if (completed && !selected) {
                return STEP_STATE.DONE;
            }
            else if (completed && selected) {
                return defaultState;
            }
            return editable && selected ? STEP_STATE.EDIT : defaultState;
        }
    }, ...(ngDevMode ? [{ debugName: "indicatorType" }] : []));
    /** Whether the user can navigate to the step. */
    isNavigable = computed(() => {
        const isSelected = this.isSelected();
        const isCompleted = this.completed;
        return isCompleted || isSelected || !this._stepper.linear;
    }, ...(ngDevMode ? [{ debugName: "isNavigable" }] : []));
    /** Whether step has an error. */
    get hasError() {
        const customError = this._customError();
        return customError == null ? this._getDefaultError() : customError;
    }
    set hasError(value) {
        this._customError.set(value);
    }
    _customError = signal(null, ...(ngDevMode ? [{ debugName: "_customError" }] : []));
    _getDefaultError() {
        return this.interacted && !!this.stepControl?.invalid;
    }
    constructor() {
        const stepperOptions = inject(STEPPER_GLOBAL_OPTIONS, { optional: true });
        this._stepperOptions = stepperOptions ? stepperOptions : {};
        this._displayDefaultIndicatorType = this._stepperOptions.displayDefaultIndicatorType !== false;
    }
    /** Selects this step component. */
    select() {
        this._stepper.selected = this;
    }
    /** Resets the step to its initial state. Note that this includes resetting form data. */
    reset() {
        this._interacted.set(false);
        if (this._completedOverride() != null) {
            this._completedOverride.set(false);
        }
        if (this._customError() != null) {
            this._customError.set(false);
        }
        if (this.stepControl) {
            // Reset the forms since the default error state matchers will show errors on submit and we
            // want the form to be back to its initial state (see #29781). Submitted state is on the
            // individual directives, rather than the control, so we need to reset them ourselves.
            this._childForms?.forEach(form => form.resetForm?.());
            this.stepControl.reset();
        }
    }
    ngOnChanges() {
        // Since basically all inputs of the MatStep get proxied through the view down to the
        // underlying MatStepHeader, we have to make sure that change detection runs correctly.
        this._stepper._stateChanged();
    }
    _markAsInteracted() {
        if (!this._interacted()) {
            this._interacted.set(true);
            this.interactedStream.emit(this);
        }
    }
    /** Determines whether the error state can be shown. */
    _showError() {
        // We want to show the error state either if the user opted into/out of it using the
        // global options, or if they've explicitly set it through the `hasError` input.
        return this._stepperOptions.showError ?? this._customError() != null;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: CdkStep, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "16.1.0", version: "20.2.0-next.2", type: CdkStep, isStandalone: true, selector: "cdk-step", inputs: { stepControl: "stepControl", label: "label", errorMessage: "errorMessage", ariaLabel: ["aria-label", "ariaLabel"], ariaLabelledby: ["aria-labelledby", "ariaLabelledby"], state: "state", editable: ["editable", "editable", booleanAttribute], optional: ["optional", "optional", booleanAttribute], completed: ["completed", "completed", booleanAttribute], hasError: ["hasError", "hasError", booleanAttribute] }, outputs: { interactedStream: "interacted" }, queries: [{ propertyName: "stepLabel", first: true, predicate: CdkStepLabel, descendants: true }, { propertyName: "_childForms", predicate: 
                // Note: we look for `ControlContainer` here, because both `NgForm` and `FormGroupDirective`
                // provides themselves as such, but we don't want to have a concrete reference to both of
                // the directives. The type is marked as `Partial` in case we run into a class that provides
                // itself as `ControlContainer` but doesn't have the same interface as the directives.
                ControlContainer, descendants: true }], viewQueries: [{ propertyName: "content", first: true, predicate: TemplateRef, descendants: true, static: true }], exportAs: ["cdkStep"], usesOnChanges: true, ngImport: i0, template: '<ng-template><ng-content/></ng-template>', isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: CdkStep, decorators: [{
            type: Component,
            args: [{
                    selector: 'cdk-step',
                    exportAs: 'cdkStep',
                    template: '<ng-template><ng-content/></ng-template>',
                    encapsulation: ViewEncapsulation.None,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                }]
        }], ctorParameters: () => [], propDecorators: { stepLabel: [{
                type: ContentChild,
                args: [CdkStepLabel]
            }], _childForms: [{
                type: ContentChildren,
                args: [
                    // Note: we look for `ControlContainer` here, because both `NgForm` and `FormGroupDirective`
                    // provides themselves as such, but we don't want to have a concrete reference to both of
                    // the directives. The type is marked as `Partial` in case we run into a class that provides
                    // itself as `ControlContainer` but doesn't have the same interface as the directives.
                    ControlContainer,
                    {
                        descendants: true,
                    }]
            }], content: [{
                type: ViewChild,
                args: [TemplateRef, { static: true }]
            }], stepControl: [{
                type: Input
            }], interactedStream: [{
                type: Output,
                args: ['interacted']
            }], label: [{
                type: Input
            }], errorMessage: [{
                type: Input
            }], ariaLabel: [{
                type: Input,
                args: ['aria-label']
            }], ariaLabelledby: [{
                type: Input,
                args: ['aria-labelledby']
            }], state: [{
                type: Input
            }], editable: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], optional: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], completed: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], hasError: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }] } });
class CdkStepper {
    _dir = inject(Directionality, { optional: true });
    _changeDetectorRef = inject(ChangeDetectorRef);
    _elementRef = inject(ElementRef);
    /** Emits when the component is destroyed. */
    _destroyed = new Subject();
    /** Used for managing keyboard focus. */
    _keyManager;
    /** Full list of steps inside the stepper, including inside nested steppers. */
    _steps;
    /** Steps that belong to the current stepper, excluding ones from nested steppers. */
    steps = new QueryList();
    /** The list of step headers of the steps in the stepper. */
    _stepHeader;
    /** List of step headers sorted based on their DOM order. */
    _sortedHeaders = new QueryList();
    /** Whether the validity of previous steps should be checked or not. */
    linear = false;
    /** The index of the selected step. */
    get selectedIndex() {
        return this._selectedIndex();
    }
    set selectedIndex(index) {
        if (this._steps) {
            // Ensure that the index can't be out of bounds.
            if (!this._isValidIndex(index) && (typeof ngDevMode === 'undefined' || ngDevMode)) {
                throw Error('cdkStepper: Cannot assign out-of-bounds value to `selectedIndex`.');
            }
            if (this.selectedIndex !== index) {
                this.selected?._markAsInteracted();
                if (!this._anyControlsInvalidOrPending(index) &&
                    (index >= this.selectedIndex || this.steps.toArray()[index].editable)) {
                    this._updateSelectedItemIndex(index);
                }
            }
        }
        else {
            this._selectedIndex.set(index);
        }
    }
    _selectedIndex = signal(0, ...(ngDevMode ? [{ debugName: "_selectedIndex" }] : []));
    /** The step that is selected. */
    get selected() {
        return this.steps ? this.steps.toArray()[this.selectedIndex] : undefined;
    }
    set selected(step) {
        this.selectedIndex = step && this.steps ? this.steps.toArray().indexOf(step) : -1;
    }
    /** Event emitted when the selected step has changed. */
    selectionChange = new EventEmitter();
    /** Output to support two-way binding on `[(selectedIndex)]` */
    selectedIndexChange = new EventEmitter();
    /** Used to track unique ID for each stepper component. */
    _groupId = inject(_IdGenerator).getId('cdk-stepper-');
    /** Orientation of the stepper. */
    get orientation() {
        return this._orientation;
    }
    set orientation(value) {
        // This is a protected method so that `MatStepper` can hook into it.
        this._orientation = value;
        if (this._keyManager) {
            this._keyManager.withVerticalOrientation(value === 'vertical');
        }
    }
    _orientation = 'horizontal';
    constructor() { }
    ngAfterContentInit() {
        this._steps.changes
            .pipe(startWith(this._steps), takeUntil(this._destroyed))
            .subscribe((steps) => {
            this.steps.reset(steps.filter(step => step._stepper === this));
            this.steps.forEach((step, index) => step.index.set(index));
            this.steps.notifyOnChanges();
        });
    }
    ngAfterViewInit() {
        // If the step headers are defined outside of the `ngFor` that renders the steps, like in the
        // Material stepper, they won't appear in the `QueryList` in the same order as they're
        // rendered in the DOM which will lead to incorrect keyboard navigation. We need to sort
        // them manually to ensure that they're correct. Alternatively, we can change the Material
        // template to inline the headers in the `ngFor`, but that'll result in a lot of
        // code duplication. See #23539.
        this._stepHeader.changes
            .pipe(startWith(this._stepHeader), takeUntil(this._destroyed))
            .subscribe((headers) => {
            this._sortedHeaders.reset(headers.toArray().sort((a, b) => {
                const documentPosition = a._elementRef.nativeElement.compareDocumentPosition(b._elementRef.nativeElement);
                // `compareDocumentPosition` returns a bitmask so we have to use a bitwise operator.
                // https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition
                // tslint:disable-next-line:no-bitwise
                return documentPosition & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
            }));
            this._sortedHeaders.notifyOnChanges();
        });
        // Note that while the step headers are content children by default, any components that
        // extend this one might have them as view children. We initialize the keyboard handling in
        // AfterViewInit so we're guaranteed for both view and content children to be defined.
        this._keyManager = new FocusKeyManager(this._sortedHeaders)
            .withWrap()
            .withHomeAndEnd()
            .withVerticalOrientation(this._orientation === 'vertical');
        // The selected index may have changed between when the component was created and when the
        // key manager was initialized. Use `updateActiveItem` so it's correct, but it doesn't steal
        // away focus from the user.
        this._keyManager.updateActiveItem(this.selectedIndex);
        (this._dir ? this._dir.change : of())
            .pipe(startWith(this._layoutDirection()), takeUntil(this._destroyed))
            .subscribe(direction => this._keyManager?.withHorizontalOrientation(direction));
        this._keyManager.updateActiveItem(this.selectedIndex);
        // No need to `takeUntil` here, because we're the ones destroying `steps`.
        this.steps.changes.subscribe(() => {
            if (!this.selected) {
                this._selectedIndex.set(Math.max(this.selectedIndex - 1, 0));
            }
        });
        // The logic which asserts that the selected index is within bounds doesn't run before the
        // steps are initialized, because we don't how many steps there are yet so we may have an
        // invalid index on init. If that's the case, auto-correct to the default so we don't throw.
        if (!this._isValidIndex(this.selectedIndex)) {
            this._selectedIndex.set(0);
        }
        // For linear step and selected index is greater than zero,
        // set all the previous steps to interacted so that we can navigate to previous steps.
        if (this.linear && this.selectedIndex > 0) {
            const visitedSteps = this.steps.toArray().slice(0, this._selectedIndex());
            for (const step of visitedSteps) {
                step._markAsInteracted();
            }
        }
    }
    ngOnDestroy() {
        this._keyManager?.destroy();
        this.steps.destroy();
        this._sortedHeaders.destroy();
        this._destroyed.next();
        this._destroyed.complete();
    }
    /** Selects and focuses the next step in list. */
    next() {
        this.selectedIndex = Math.min(this._selectedIndex() + 1, this.steps.length - 1);
    }
    /** Selects and focuses the previous step in list. */
    previous() {
        this.selectedIndex = Math.max(this._selectedIndex() - 1, 0);
    }
    /** Resets the stepper to its initial state. Note that this includes clearing form data. */
    reset() {
        this._updateSelectedItemIndex(0);
        this.steps.forEach(step => step.reset());
        this._stateChanged();
    }
    /** Returns a unique id for each step label element. */
    _getStepLabelId(i) {
        return `${this._groupId}-label-${i}`;
    }
    /** Returns unique id for each step content element. */
    _getStepContentId(i) {
        return `${this._groupId}-content-${i}`;
    }
    /** Marks the component to be change detected. */
    _stateChanged() {
        this._changeDetectorRef.markForCheck();
    }
    /** Returns position state of the step with the given index. */
    _getAnimationDirection(index) {
        const position = index - this._selectedIndex();
        if (position < 0) {
            return this._layoutDirection() === 'rtl' ? 'next' : 'previous';
        }
        else if (position > 0) {
            return this._layoutDirection() === 'rtl' ? 'previous' : 'next';
        }
        return 'current';
    }
    /** Returns the index of the currently-focused step header. */
    _getFocusIndex() {
        return this._keyManager ? this._keyManager.activeItemIndex : this._selectedIndex();
    }
    _updateSelectedItemIndex(newIndex) {
        const stepsArray = this.steps.toArray();
        const selectedIndex = this._selectedIndex();
        this.selectionChange.emit({
            selectedIndex: newIndex,
            previouslySelectedIndex: selectedIndex,
            selectedStep: stepsArray[newIndex],
            previouslySelectedStep: stepsArray[selectedIndex],
        });
        // If focus is inside the stepper, move it to the next header, otherwise it may become
        // lost when the active step content is hidden. We can't be more granular with the check
        // (e.g. checking whether focus is inside the active step), because we don't have a
        // reference to the elements that are rendering out the content.
        if (this._keyManager) {
            this._containsFocus()
                ? this._keyManager.setActiveItem(newIndex)
                : this._keyManager.updateActiveItem(newIndex);
        }
        this._selectedIndex.set(newIndex);
        this.selectedIndexChange.emit(newIndex);
        this._stateChanged();
    }
    _onKeydown(event) {
        const hasModifier = hasModifierKey(event);
        const keyCode = event.keyCode;
        const manager = this._keyManager;
        if (manager?.activeItemIndex != null &&
            !hasModifier &&
            (keyCode === SPACE || keyCode === ENTER)) {
            this.selectedIndex = manager.activeItemIndex;
            event.preventDefault();
        }
        else {
            manager?.setFocusOrigin('keyboard').onKeydown(event);
        }
    }
    _anyControlsInvalidOrPending(index) {
        if (this.linear && index >= 0) {
            return this.steps
                .toArray()
                .slice(0, index)
                .some(step => {
                const control = step.stepControl;
                const isIncomplete = control
                    ? control.invalid || control.pending || !step.interacted
                    : !step.completed;
                return isIncomplete && !step.optional && !step._completedOverride();
            });
        }
        return false;
    }
    _layoutDirection() {
        return this._dir && this._dir.value === 'rtl' ? 'rtl' : 'ltr';
    }
    /** Checks whether the stepper contains the focused element. */
    _containsFocus() {
        const stepperElement = this._elementRef.nativeElement;
        const focusedElement = _getFocusedElementPierceShadowDom();
        return stepperElement === focusedElement || stepperElement.contains(focusedElement);
    }
    /** Checks whether the passed-in index is a valid step index. */
    _isValidIndex(index) {
        return index > -1 && (!this.steps || index < this.steps.length);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: CdkStepper, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "16.1.0", version: "20.2.0-next.2", type: CdkStepper, isStandalone: true, selector: "[cdkStepper]", inputs: { linear: ["linear", "linear", booleanAttribute], selectedIndex: ["selectedIndex", "selectedIndex", numberAttribute], selected: "selected", orientation: "orientation" }, outputs: { selectionChange: "selectionChange", selectedIndexChange: "selectedIndexChange" }, queries: [{ propertyName: "_steps", predicate: CdkStep, descendants: true }, { propertyName: "_stepHeader", predicate: CdkStepHeader, descendants: true }], exportAs: ["cdkStepper"], ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: CdkStepper, decorators: [{
            type: Directive,
            args: [{
                    selector: '[cdkStepper]',
                    exportAs: 'cdkStepper',
                }]
        }], ctorParameters: () => [], propDecorators: { _steps: [{
                type: ContentChildren,
                args: [CdkStep, { descendants: true }]
            }], _stepHeader: [{
                type: ContentChildren,
                args: [CdkStepHeader, { descendants: true }]
            }], linear: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], selectedIndex: [{
                type: Input,
                args: [{ transform: numberAttribute }]
            }], selected: [{
                type: Input
            }], selectionChange: [{
                type: Output
            }], selectedIndexChange: [{
                type: Output
            }], orientation: [{
                type: Input
            }] } });

/** Button that moves to the next step in a stepper workflow. */
class CdkStepperNext {
    _stepper = inject(CdkStepper);
    /** Type of the next button. Defaults to "submit" if not specified. */
    type = 'submit';
    constructor() { }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: CdkStepperNext, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.0-next.2", type: CdkStepperNext, isStandalone: true, selector: "button[cdkStepperNext]", inputs: { type: "type" }, host: { listeners: { "click": "_stepper.next()" }, properties: { "type": "type" } }, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: CdkStepperNext, decorators: [{
            type: Directive,
            args: [{
                    selector: 'button[cdkStepperNext]',
                    host: {
                        '[type]': 'type',
                        '(click)': '_stepper.next()',
                    },
                }]
        }], ctorParameters: () => [], propDecorators: { type: [{
                type: Input
            }] } });
/** Button that moves to the previous step in a stepper workflow. */
class CdkStepperPrevious {
    _stepper = inject(CdkStepper);
    /** Type of the previous button. Defaults to "button" if not specified. */
    type = 'button';
    constructor() { }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: CdkStepperPrevious, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.0-next.2", type: CdkStepperPrevious, isStandalone: true, selector: "button[cdkStepperPrevious]", inputs: { type: "type" }, host: { listeners: { "click": "_stepper.previous()" }, properties: { "type": "type" } }, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: CdkStepperPrevious, decorators: [{
            type: Directive,
            args: [{
                    selector: 'button[cdkStepperPrevious]',
                    host: {
                        '[type]': 'type',
                        '(click)': '_stepper.previous()',
                    },
                }]
        }], ctorParameters: () => [], propDecorators: { type: [{
                type: Input
            }] } });

class CdkStepperModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: CdkStepperModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.0-next.2", ngImport: i0, type: CdkStepperModule, imports: [BidiModule,
            CdkStep,
            CdkStepper,
            CdkStepHeader,
            CdkStepLabel,
            CdkStepperNext,
            CdkStepperPrevious], exports: [CdkStep, CdkStepper, CdkStepHeader, CdkStepLabel, CdkStepperNext, CdkStepperPrevious] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: CdkStepperModule, imports: [BidiModule] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.0-next.2", ngImport: i0, type: CdkStepperModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        BidiModule,
                        CdkStep,
                        CdkStepper,
                        CdkStepHeader,
                        CdkStepLabel,
                        CdkStepperNext,
                        CdkStepperPrevious,
                    ],
                    exports: [CdkStep, CdkStepper, CdkStepHeader, CdkStepLabel, CdkStepperNext, CdkStepperPrevious],
                }]
        }] });

export { CdkStep, CdkStepHeader, CdkStepLabel, CdkStepper, CdkStepperModule, CdkStepperNext, CdkStepperPrevious, STEPPER_GLOBAL_OPTIONS, STEP_STATE, StepperSelectionEvent };
//# sourceMappingURL=stepper.mjs.map

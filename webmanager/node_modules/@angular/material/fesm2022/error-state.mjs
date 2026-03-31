/**
 * Class that tracks the error state of a component.
 * @docs-private
 */
class _ErrorStateTracker {
    _defaultMatcher;
    ngControl;
    _parentFormGroup;
    _parentForm;
    _stateChanges;
    /** Whether the tracker is currently in an error state. */
    errorState = false;
    /** User-defined matcher for the error state. */
    matcher;
    constructor(_defaultMatcher, ngControl, _parentFormGroup, _parentForm, _stateChanges) {
        this._defaultMatcher = _defaultMatcher;
        this.ngControl = ngControl;
        this._parentFormGroup = _parentFormGroup;
        this._parentForm = _parentForm;
        this._stateChanges = _stateChanges;
    }
    /** Updates the error state based on the provided error state matcher. */
    updateErrorState() {
        const oldState = this.errorState;
        const parent = this._parentFormGroup || this._parentForm;
        const matcher = this.matcher || this._defaultMatcher;
        const control = this.ngControl ? this.ngControl.control : null;
        const newState = matcher?.isErrorState(control, parent) ?? false;
        if (newState !== oldState) {
            this.errorState = newState;
            this._stateChanges.next();
        }
    }
}

export { _ErrorStateTracker };
//# sourceMappingURL=error-state.mjs.map

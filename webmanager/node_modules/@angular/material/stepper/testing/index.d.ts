import { BaseHarnessFilters, ContentContainerComponentHarness, HarnessPredicate, HarnessLoader, ComponentHarness } from '@angular/cdk/testing';

/** Possible orientations for a stepper. */
declare enum StepperOrientation {
    HORIZONTAL = 0,
    VERTICAL = 1
}
/** A set of criteria that can be used to filter a list of `MatStepHarness` instances. */
interface StepHarnessFilters extends BaseHarnessFilters {
    /** Only find instances whose label matches the given value. */
    label?: string | RegExp;
    /** Only find steps with the given selected state. */
    selected?: boolean;
    /** Only find completed steps. */
    completed?: boolean;
    /** Only find steps that have errors. */
    invalid?: boolean;
}
/** A set of criteria that can be used to filter a list of `MatStepperHarness` instances. */
interface StepperHarnessFilters extends BaseHarnessFilters {
    /** Only find instances whose orientation matches the given value. */
    orientation?: StepperOrientation;
}
/**
 * A set of criteria that can be used to filter a list of
 * `MatStepperNextHarness` and `MatStepperPreviousHarness` instances.
 */
interface StepperButtonHarnessFilters extends BaseHarnessFilters {
    /** Only find instances whose text matches the given value. */
    text?: string | RegExp;
}

/** Harness for interacting with a standard Angular Material step in tests. */
declare class MatStepHarness extends ContentContainerComponentHarness<string> {
    /** The selector for the host element of a `MatStep` instance. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatStepHarness` that meets
     * certain criteria.
     * @param options Options for filtering which steps are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: StepHarnessFilters): HarnessPredicate<MatStepHarness>;
    /** Gets the label of the step. */
    getLabel(): Promise<string>;
    /** Gets the `aria-label` of the step. */
    getAriaLabel(): Promise<string | null>;
    /** Gets the value of the `aria-labelledby` attribute. */
    getAriaLabelledby(): Promise<string | null>;
    /** Whether the step is selected. */
    isSelected(): Promise<boolean>;
    /** Whether the step has been filled out. */
    isCompleted(): Promise<boolean>;
    /**
     * Whether the step is currently showing its error state. Note that this doesn't mean that there
     * are or aren't any invalid form controls inside the step, but that the step is showing its
     * error-specific styling which depends on there being invalid controls, as well as the
     * `ErrorStateMatcher` determining that an error should be shown and that the `showErrors`
     * option was enabled through the `STEPPER_GLOBAL_OPTIONS` injection token.
     */
    hasErrors(): Promise<boolean>;
    /** Whether the step is optional. */
    isOptional(): Promise<boolean>;
    /**
     * Selects the given step by clicking on the label. The step may not be selected
     * if the stepper doesn't allow it (e.g. if there are validation errors).
     */
    select(): Promise<void>;
    protected getRootHarnessLoader(): Promise<HarnessLoader>;
    /**
     * Gets the state of the step. Note that we have a `StepState` which we could use to type the
     * return value, but it's basically the same as `string`, because the type has `| string`.
     */
    private _getIconState;
}

/** Harness for interacting with a standard Material stepper in tests. */
declare class MatStepperHarness extends ComponentHarness {
    /** The selector for the host element of a `MatStepper` instance. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatStepperHarness` that meets
     * certain criteria.
     * @param options Options for filtering which stepper instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: StepperHarnessFilters): HarnessPredicate<MatStepperHarness>;
    /**
     * Gets the list of steps in the stepper.
     * @param filter Optionally filters which steps are included.
     */
    getSteps(filter?: StepHarnessFilters): Promise<MatStepHarness[]>;
    /** Gets the orientation of the stepper. */
    getOrientation(): Promise<StepperOrientation>;
    /**
     * Selects a step in this stepper.
     * @param filter An optional filter to apply to the child steps. The first step matching the
     *    filter will be selected.
     */
    selectStep(filter?: StepHarnessFilters): Promise<void>;
}

/** Base class for stepper button harnesses. */
declare abstract class StepperButtonHarness extends ComponentHarness {
    /** Gets the text of the button. */
    getText(): Promise<string>;
    /** Clicks the button. */
    click(): Promise<void>;
}
/** Harness for interacting with a standard Angular Material stepper next button in tests. */
declare class MatStepperNextHarness extends StepperButtonHarness {
    /** The selector for the host element of a `MatStep` instance. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatStepperNextHarness` that meets
     * certain criteria.
     * @param options Options for filtering which steps are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: StepperButtonHarnessFilters): HarnessPredicate<MatStepperNextHarness>;
}
/** Harness for interacting with a standard Angular Material stepper previous button in tests. */
declare class MatStepperPreviousHarness extends StepperButtonHarness {
    /** The selector for the host element of a `MatStep` instance. */
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatStepperPreviousHarness`
     * that meets certain criteria.
     * @param options Options for filtering which steps are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: StepperButtonHarnessFilters): HarnessPredicate<MatStepperPreviousHarness>;
}

export { MatStepHarness, MatStepperHarness, MatStepperNextHarness, MatStepperPreviousHarness, StepperOrientation };
export type { StepHarnessFilters, StepperButtonHarnessFilters, StepperHarnessFilters };

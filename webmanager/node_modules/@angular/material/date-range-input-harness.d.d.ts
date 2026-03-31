import { BaseHarnessFilters, ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { MatFormFieldControlHarnessFilters, MatFormFieldControlHarnessBase } from '@angular/material/form-field/testing/control';

/** A set of criteria that can be used to filter a list of datepicker input instances. */
interface DatepickerInputHarnessFilters extends MatFormFieldControlHarnessFilters {
    /** Filters based on the value of the input. */
    value?: string | RegExp;
    /** Filters based on the placeholder text of the input. */
    placeholder?: string | RegExp;
}
/** A set of criteria that can be used to filter a list of datepicker toggle instances. */
interface DatepickerToggleHarnessFilters extends BaseHarnessFilters {
}
/** A set of criteria that can be used to filter a list of calendar instances. */
interface CalendarHarnessFilters extends BaseHarnessFilters {
}
/** A set of criteria that can be used to filter a list of calendar cell instances. */
interface CalendarCellHarnessFilters extends BaseHarnessFilters {
    /** Filters based on the text of the cell. */
    text?: string | RegExp;
    /** Filters based on whether the cell is selected. */
    selected?: boolean;
    /** Filters based on whether the cell is activated using keyboard navigation */
    active?: boolean;
    /** Filters based on whether the cell is disabled. */
    disabled?: boolean;
    /** Filters based on whether the cell represents today's date. */
    today?: boolean;
    /** Filters based on whether the cell is inside of the main range. */
    inRange?: boolean;
    /** Filters based on whether the cell is inside of the comparison range. */
    inComparisonRange?: boolean;
    /** Filters based on whether the cell is inside of the preview range. */
    inPreviewRange?: boolean;
}
/** A set of criteria that can be used to filter a list of date range input instances. */
interface DateRangeInputHarnessFilters extends MatFormFieldControlHarnessFilters {
    /** Filters based on the value of the input. */
    value?: string | RegExp;
}

/** Base class for datepicker input harnesses. */
declare abstract class MatDatepickerInputHarnessBase extends MatFormFieldControlHarnessBase {
    /** Whether the input is disabled. */
    isDisabled(): Promise<boolean>;
    /** Whether the input is required. */
    isRequired(): Promise<boolean>;
    /** Gets the value of the input. */
    getValue(): Promise<string>;
    /**
     * Sets the value of the input. The value will be set by simulating
     * keypresses that correspond to the given value.
     */
    setValue(newValue: string): Promise<void>;
    /** Gets the placeholder of the input. */
    getPlaceholder(): Promise<string>;
    /**
     * Focuses the input and returns a promise that indicates when the
     * action is complete.
     */
    focus(): Promise<void>;
    /**
     * Blurs the input and returns a promise that indicates when the
     * action is complete.
     */
    blur(): Promise<void>;
    /** Whether the input is focused. */
    isFocused(): Promise<boolean>;
    /** Gets the formatted minimum date for the input's value. */
    getMin(): Promise<string | null>;
    /** Gets the formatted maximum date for the input's value. */
    getMax(): Promise<string | null>;
}

/** Harness for interacting with a standard Material calendar cell in tests. */
declare class MatCalendarCellHarness extends ComponentHarness {
    static hostSelector: string;
    /** Reference to the inner content element inside the cell. */
    private _content;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatCalendarCellHarness`
     * that meets certain criteria.
     * @param options Options for filtering which cell instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: CalendarCellHarnessFilters): HarnessPredicate<MatCalendarCellHarness>;
    /** Gets the text of the calendar cell. */
    getText(): Promise<string>;
    /** Gets the aria-label of the calendar cell. */
    getAriaLabel(): Promise<string>;
    /** Whether the cell is selected. */
    isSelected(): Promise<boolean>;
    /** Whether the cell is disabled. */
    isDisabled(): Promise<boolean>;
    /** Whether the cell is currently activated using keyboard navigation. */
    isActive(): Promise<boolean>;
    /** Whether the cell represents today's date. */
    isToday(): Promise<boolean>;
    /** Selects the calendar cell. Won't do anything if the cell is disabled. */
    select(): Promise<void>;
    /** Hovers over the calendar cell. */
    hover(): Promise<void>;
    /** Moves the mouse away from the calendar cell. */
    mouseAway(): Promise<void>;
    /** Focuses the calendar cell. */
    focus(): Promise<void>;
    /** Removes focus from the calendar cell. */
    blur(): Promise<void>;
    /** Whether the cell is the start of the main range. */
    isRangeStart(): Promise<boolean>;
    /** Whether the cell is the end of the main range. */
    isRangeEnd(): Promise<boolean>;
    /** Whether the cell is part of the main range. */
    isInRange(): Promise<boolean>;
    /** Whether the cell is the start of the comparison range. */
    isComparisonRangeStart(): Promise<boolean>;
    /** Whether the cell is the end of the comparison range. */
    isComparisonRangeEnd(): Promise<boolean>;
    /** Whether the cell is inside of the comparison range. */
    isInComparisonRange(): Promise<boolean>;
    /** Whether the cell is the start of the preview range. */
    isPreviewRangeStart(): Promise<boolean>;
    /** Whether the cell is the end of the preview range. */
    isPreviewRangeEnd(): Promise<boolean>;
    /** Whether the cell is inside of the preview range. */
    isInPreviewRange(): Promise<boolean>;
    /** Returns whether the cell has a particular CSS class-based state. */
    private _hasState;
}

/** Possible views of a `MatCalendarHarness`. */
declare enum CalendarView {
    MONTH = 0,
    YEAR = 1,
    MULTI_YEAR = 2
}
/** Harness for interacting with a standard Material calendar in tests. */
declare class MatCalendarHarness extends ComponentHarness {
    static hostSelector: string;
    /** Queries for the calendar's period toggle button. */
    private _periodButton;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatCalendarHarness`
     * that meets certain criteria.
     * @param options Options for filtering which calendar instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: CalendarHarnessFilters): HarnessPredicate<MatCalendarHarness>;
    /**
     * Gets a list of cells inside the calendar.
     * @param filter Optionally filters which cells are included.
     */
    getCells(filter?: CalendarCellHarnessFilters): Promise<MatCalendarCellHarness[]>;
    /** Gets the current view that is being shown inside the calendar. */
    getCurrentView(): Promise<CalendarView>;
    /** Gets the label of the current calendar view. */
    getCurrentViewLabel(): Promise<string>;
    /** Changes the calendar view by clicking on the view toggle button. */
    changeView(): Promise<void>;
    /** Goes to the next page of the current view (e.g. next month when inside the month view). */
    next(): Promise<void>;
    /**
     * Goes to the previous page of the current view
     * (e.g. previous month when inside the month view).
     */
    previous(): Promise<void>;
    /**
     * Selects a cell in the current calendar view.
     * @param filter An optional filter to apply to the cells. The first cell matching the filter
     *     will be selected.
     */
    selectCell(filter?: CalendarCellHarnessFilters): Promise<void>;
}

/** Interface for a test harness that can open and close a calendar. */
interface DatepickerTrigger {
    isCalendarOpen(): Promise<boolean>;
    openCalendar(): Promise<void>;
    closeCalendar(): Promise<void>;
    hasCalendar(): Promise<boolean>;
    getCalendar(filter?: CalendarHarnessFilters): Promise<MatCalendarHarness>;
}
/** Base class for harnesses that can trigger a calendar. */
declare abstract class DatepickerTriggerHarnessBase extends ComponentHarness implements DatepickerTrigger {
    /** Whether the trigger is disabled. */
    abstract isDisabled(): Promise<boolean>;
    /** Whether the calendar associated with the trigger is open. */
    abstract isCalendarOpen(): Promise<boolean>;
    /** Opens the calendar associated with the trigger. */
    protected abstract _openCalendar(): Promise<void>;
    /** Opens the calendar if the trigger is enabled and it has a calendar. */
    openCalendar(): Promise<void>;
    /** Closes the calendar if it is open. */
    closeCalendar(): Promise<void>;
    /** Gets whether there is a calendar associated with the trigger. */
    hasCalendar(): Promise<boolean>;
    /**
     * Gets the `MatCalendarHarness` that is associated with the trigger.
     * @param filter Optionally filters which calendar is included.
     */
    getCalendar(filter?: CalendarHarnessFilters): Promise<MatCalendarHarness>;
}

/** Harness for interacting with a standard Material datepicker inputs in tests. */
declare class MatDatepickerInputHarness extends MatDatepickerInputHarnessBase implements DatepickerTrigger {
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatDatepickerInputHarness`
     * that meets certain criteria.
     * @param options Options for filtering which input instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: DatepickerInputHarnessFilters): HarnessPredicate<MatDatepickerInputHarness>;
    /** Gets whether the calendar associated with the input is open. */
    isCalendarOpen(): Promise<boolean>;
    /** Opens the calendar associated with the input. */
    openCalendar(): Promise<void>;
    /** Closes the calendar associated with the input. */
    closeCalendar(): Promise<void>;
    /** Whether a calendar is associated with the input. */
    hasCalendar(): Promise<boolean>;
    /**
     * Gets the `MatCalendarHarness` that is associated with the trigger.
     * @param filter Optionally filters which calendar is included.
     */
    getCalendar(filter?: CalendarHarnessFilters): Promise<MatCalendarHarness>;
}

/** Harness for interacting with a standard Material date range start input in tests. */
declare class MatStartDateHarness extends MatDatepickerInputHarnessBase {
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatStartDateHarness`
     * that meets certain criteria.
     * @param options Options for filtering which input instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: DatepickerInputHarnessFilters): HarnessPredicate<MatStartDateHarness>;
}
/** Harness for interacting with a standard Material date range end input in tests. */
declare class MatEndDateHarness extends MatDatepickerInputHarnessBase {
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatEndDateHarness`
     * that meets certain criteria.
     * @param options Options for filtering which input instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: DatepickerInputHarnessFilters): HarnessPredicate<MatEndDateHarness>;
}
/** Harness for interacting with a standard Material date range input in tests. */
declare class MatDateRangeInputHarness extends DatepickerTriggerHarnessBase {
    static hostSelector: string;
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatDateRangeInputHarness`
     * that meets certain criteria.
     * @param options Options for filtering which input instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options?: DateRangeInputHarnessFilters): HarnessPredicate<MatDateRangeInputHarness>;
    /** Gets the combined value of the start and end inputs, including the separator. */
    getValue(): Promise<string>;
    /** Gets the inner start date input inside the range input. */
    getStartInput(): Promise<MatStartDateHarness>;
    /** Gets the inner start date input inside the range input. */
    getEndInput(): Promise<MatEndDateHarness>;
    /**
     * Gets the label for the range input, if it exists. This might be provided by a label element or
     * by the `aria-label` attribute.
     */
    getLabel(): Promise<string | null>;
    /** Gets the separator text between the values of the two inputs. */
    getSeparator(): Promise<string>;
    /** Gets whether the range input is disabled. */
    isDisabled(): Promise<boolean>;
    /** Gets whether the range input is required. */
    isRequired(): Promise<boolean>;
    /** Opens the calendar associated with the input. */
    isCalendarOpen(): Promise<boolean>;
    protected _openCalendar(): Promise<void>;
}

export { CalendarView, DatepickerTriggerHarnessBase, MatCalendarCellHarness, MatCalendarHarness, MatDateRangeInputHarness, MatDatepickerInputHarness, MatEndDateHarness, MatStartDateHarness };
export type { CalendarCellHarnessFilters, CalendarHarnessFilters, DateRangeInputHarnessFilters, DatepickerInputHarnessFilters, DatepickerToggleHarnessFilters };

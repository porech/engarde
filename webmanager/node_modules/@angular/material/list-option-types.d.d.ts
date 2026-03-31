/**
 * Type describing possible positions of a checkbox or radio in a list option
 * with respect to the list item's text.
 */
type MatListOptionTogglePosition = 'before' | 'after';
/**
 * Interface describing a list option. This is used to avoid circular
 * dependencies between the list-option and the styler directives.
 * @docs-private
 */
interface ListOption {
    _getTogglePosition(): MatListOptionTogglePosition;
}

export type { ListOption, MatListOptionTogglePosition };

import { Signal, InjectionToken } from '@angular/core';

/**
 * Describes a parent component that manages a list of options.
 * Contains properties that the options can inherit.
 * @docs-private
 */
interface MatOptionParentComponent {
    disableRipple?: boolean | Signal<boolean>;
    multiple?: boolean;
    inertGroups?: boolean;
    hideSingleSelectionIndicator?: boolean;
}
/**
 * Injection token used to provide the parent component to options.
 */
declare const MAT_OPTION_PARENT_COMPONENT: InjectionToken<MatOptionParentComponent>;

export { MAT_OPTION_PARENT_COMPONENT };
export type { MatOptionParentComponent };

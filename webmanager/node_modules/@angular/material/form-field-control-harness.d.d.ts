import { ComponentHarness } from '@angular/cdk/testing';

/**
 * Base class for custom form-field control harnesses. Harnesses for
 * custom controls with form-fields need to implement this interface.
 */
declare abstract class MatFormFieldControlHarness extends ComponentHarness {
}
/**
 * Shared behavior for `MatFormFieldControlHarness` implementations
 */
declare abstract class MatFormFieldControlHarnessBase extends MatFormFieldControlHarness {
    /**
     * Gets the label for the control, if it exists. This might be provided by a label element or by
     * the `aria-label` attribute.
     */
    getLabel(): Promise<string | null>;
}

export { MatFormFieldControlHarness, MatFormFieldControlHarnessBase };

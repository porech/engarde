import { BaseHarnessFilters, ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';

interface DividerHarnessFilters extends BaseHarnessFilters {
}

/** Harness for interacting with a `mat-divider`. */
declare class MatDividerHarness extends ComponentHarness {
    static hostSelector: string;
    static with(options?: DividerHarnessFilters): HarnessPredicate<MatDividerHarness>;
    getOrientation(): Promise<'horizontal' | 'vertical'>;
    isInset(): Promise<boolean>;
}

export { MatDividerHarness };
export type { DividerHarnessFilters };

export { MAT_TOOLTIP_DEFAULT_OPTIONS, MAT_TOOLTIP_DEFAULT_OPTIONS_FACTORY, MAT_TOOLTIP_SCROLL_STRATEGY, MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY, MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER, MatTooltip, SCROLL_THROTTLE_MS, TOOLTIP_PANEL_CLASS, TooltipComponent, getMatTooltipInvalidPositionError } from './tooltip2.mjs';
export { MatTooltipModule } from './tooltip-module.mjs';
import 'rxjs/operators';
import '@angular/cdk/coercion';
import '@angular/cdk/keycodes';
import '@angular/core';
import '@angular/common';
import '@angular/cdk/platform';
import '@angular/cdk/a11y';
import '@angular/cdk/bidi';
import '@angular/cdk/overlay';
import '@angular/cdk/portal';
import 'rxjs';
import './animation.mjs';
import '@angular/cdk/layout';
import '@angular/cdk/scrolling';
import './common-module.mjs';

/**
 * Animations used by MatTooltip.
 * @docs-private
 * @deprecated No longer being used, to be removed.
 * @breaking-change 21.0.0
 */
const matTooltipAnimations = {
    // Represents:
    // trigger('state', [
    //   state('initial, void, hidden', style({opacity: 0, transform: 'scale(0.8)'})),
    //   state('visible', style({transform: 'scale(1)'})),
    //   transition('* => visible', animate('150ms cubic-bezier(0, 0, 0.2, 1)')),
    //   transition('* => hidden', animate('75ms cubic-bezier(0.4, 0, 1, 1)')),
    // ])
    /** Animation that transitions a tooltip in and out. */
    tooltipState: {
        type: 7,
        name: 'state',
        definitions: [
            {
                type: 0,
                name: 'initial, void, hidden',
                styles: { type: 6, styles: { opacity: 0, transform: 'scale(0.8)' }, offset: null },
            },
            {
                type: 0,
                name: 'visible',
                styles: { type: 6, styles: { transform: 'scale(1)' }, offset: null },
            },
            {
                type: 1,
                expr: '* => visible',
                animation: { type: 4, styles: null, timings: '150ms cubic-bezier(0, 0, 0.2, 1)' },
                options: null,
            },
            {
                type: 1,
                expr: '* => hidden',
                animation: { type: 4, styles: null, timings: '75ms cubic-bezier(0.4, 0, 1, 1)' },
                options: null,
            },
        ],
        options: {},
    },
};

export { matTooltipAnimations };
//# sourceMappingURL=tooltip.mjs.map

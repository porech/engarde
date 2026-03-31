export { MAT_TOOLTIP_DEFAULT_OPTIONS, MAT_TOOLTIP_DEFAULT_OPTIONS_FACTORY, MAT_TOOLTIP_SCROLL_STRATEGY, MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY, MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER, MatTooltip, MatTooltipDefaultOptions, MatTooltipModule, SCROLL_THROTTLE_MS, TOOLTIP_PANEL_CLASS, TooltipComponent, TooltipPosition, TooltipTouchGestures, TooltipVisibility, getMatTooltipInvalidPositionError } from '../tooltip-module.d.js';
import '@angular/core';
import '@angular/cdk/a11y';
import '@angular/cdk/overlay';
import '../common-module.d.js';
import '@angular/cdk/bidi';
import '@angular/cdk/coercion';
import 'rxjs';
import '@angular/cdk/scrolling';

/**
 * Animations used by MatTooltip.
 * @docs-private
 * @deprecated No longer being used, to be removed.
 * @breaking-change 21.0.0
 */
declare const matTooltipAnimations: {
    readonly tooltipState: any;
};

export { matTooltipAnimations };

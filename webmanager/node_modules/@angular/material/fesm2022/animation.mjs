import { MediaMatcher } from '@angular/cdk/layout';
import { InjectionToken, inject, ANIMATION_MODULE_TYPE } from '@angular/core';

/** Injection token used to configure the animations in Angular Material. */
const MATERIAL_ANIMATIONS = new InjectionToken('MATERIAL_ANIMATIONS');
/**
 * @deprecated No longer used, will be removed.
 * @breaking-change 21.0.0
 * @docs-private
 */
class AnimationCurves {
    static STANDARD_CURVE = 'cubic-bezier(0.4,0.0,0.2,1)';
    static DECELERATION_CURVE = 'cubic-bezier(0.0,0.0,0.2,1)';
    static ACCELERATION_CURVE = 'cubic-bezier(0.4,0.0,1,1)';
    static SHARP_CURVE = 'cubic-bezier(0.4,0.0,0.6,1)';
}
/**
 * @deprecated No longer used, will be removed.
 * @breaking-change 21.0.0
 * @docs-private
 */
class AnimationDurations {
    static COMPLEX = '375ms';
    static ENTERING = '225ms';
    static EXITING = '195ms';
}
let reducedMotion = null;
/**
 * Gets the the configured animations state.
 * @docs-private
 */
function _getAnimationsState() {
    if (inject(MATERIAL_ANIMATIONS, { optional: true })?.animationsDisabled ||
        inject(ANIMATION_MODULE_TYPE, { optional: true }) === 'NoopAnimations') {
        return 'di-disabled';
    }
    reducedMotion ??= inject(MediaMatcher).matchMedia('(prefers-reduced-motion)').matches;
    return reducedMotion ? 'reduced-motion' : 'enabled';
}
/**
 * Returns whether animations have been disabled by DI. Must be called in a DI context.
 * @docs-private
 */
function _animationsDisabled() {
    return _getAnimationsState() !== 'enabled';
}

export { AnimationCurves, AnimationDurations, MATERIAL_ANIMATIONS, _animationsDisabled, _getAnimationsState };
//# sourceMappingURL=animation.mjs.map

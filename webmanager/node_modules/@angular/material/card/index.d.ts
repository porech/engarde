import * as i0 from '@angular/core';
import { InjectionToken } from '@angular/core';
import { MatCommonModule } from '../common-module.d.js';
import '@angular/cdk/bidi';

type MatCardAppearance = 'outlined' | 'raised' | 'filled';
/** Object that can be used to configure the default options for the card module. */
interface MatCardConfig {
    /** Default appearance for cards. */
    appearance?: MatCardAppearance;
}
/** Injection token that can be used to provide the default options the card module. */
declare const MAT_CARD_CONFIG: InjectionToken<MatCardConfig>;
/**
 * Material Design card component. Cards contain content and actions about a single subject.
 * See https://material.io/design/components/cards.html
 *
 * MatCard provides no behaviors, instead serving as a purely visual treatment.
 */
declare class MatCard {
    appearance: MatCardAppearance;
    constructor(...args: unknown[]);
    static ɵfac: i0.ɵɵFactoryDeclaration<MatCard, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatCard, "mat-card", ["matCard"], { "appearance": { "alias": "appearance"; "required": false; }; }, {}, never, ["*"], true, never>;
}
/**
 * Title of a card, intended for use within `<mat-card>`. This component is an optional
 * convenience for one variety of card title; any custom title element may be used in its place.
 *
 * MatCardTitle provides no behaviors, instead serving as a purely visual treatment.
 */
declare class MatCardTitle {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatCardTitle, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatCardTitle, "mat-card-title, [mat-card-title], [matCardTitle]", never, {}, {}, never, never, true, never>;
}
/**
 * Container intended to be used within the `<mat-card>` component. Can contain exactly one
 * `<mat-card-title>`, one `<mat-card-subtitle>` and one content image of any size
 * (e.g. `<img matCardLgImage>`).
 */
declare class MatCardTitleGroup {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatCardTitleGroup, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatCardTitleGroup, "mat-card-title-group", never, {}, {}, never, ["mat-card-title, mat-card-subtitle,\n      [mat-card-title], [mat-card-subtitle],\n      [matCardTitle], [matCardSubtitle]", "[mat-card-image], [matCardImage],\n                    [mat-card-sm-image], [matCardImageSmall],\n                    [mat-card-md-image], [matCardImageMedium],\n                    [mat-card-lg-image], [matCardImageLarge],\n                    [mat-card-xl-image], [matCardImageXLarge]", "*"], true, never>;
}
/**
 * Content of a card, intended for use within `<mat-card>`. This component is an optional
 * convenience for use with other convenience elements, such as `<mat-card-title>`; any custom
 * content block element may be used in its place.
 *
 * MatCardContent provides no behaviors, instead serving as a purely visual treatment.
 */
declare class MatCardContent {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatCardContent, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatCardContent, "mat-card-content", never, {}, {}, never, never, true, never>;
}
/**
 * Sub-title of a card, intended for use within `<mat-card>` beneath a `<mat-card-title>`. This
 * component is an optional convenience for use with other convenience elements, such as
 * `<mat-card-title>`.
 *
 * MatCardSubtitle provides no behaviors, instead serving as a purely visual treatment.
 */
declare class MatCardSubtitle {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatCardSubtitle, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatCardSubtitle, "mat-card-subtitle, [mat-card-subtitle], [matCardSubtitle]", never, {}, {}, never, never, true, never>;
}
/**
 * Bottom area of a card that contains action buttons, intended for use within `<mat-card>`.
 * This component is an optional convenience for use with other convenience elements, such as
 * `<mat-card-content>`; any custom action block element may be used in its place.
 *
 * MatCardActions provides no behaviors, instead serving as a purely visual treatment.
 */
declare class MatCardActions {
    /** Position of the actions inside the card. */
    align: 'start' | 'end';
    static ɵfac: i0.ɵɵFactoryDeclaration<MatCardActions, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatCardActions, "mat-card-actions", ["matCardActions"], { "align": { "alias": "align"; "required": false; }; }, {}, never, never, true, never>;
}
/**
 * Header region of a card, intended for use within `<mat-card>`. This header captures
 * a card title, subtitle, and avatar.  This component is an optional convenience for use with
 * other convenience elements, such as `<mat-card-footer>`; any custom header block element may be
 * used in its place.
 *
 * MatCardHeader provides no behaviors, instead serving as a purely visual treatment.
 */
declare class MatCardHeader {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatCardHeader, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatCardHeader, "mat-card-header", never, {}, {}, never, ["[mat-card-avatar], [matCardAvatar]", "mat-card-title, mat-card-subtitle,\n      [mat-card-title], [mat-card-subtitle],\n      [matCardTitle], [matCardSubtitle]", "*"], true, never>;
}
/**
 * Footer area a card, intended for use within `<mat-card>`.
 * This component is an optional convenience for use with other convenience elements, such as
 * `<mat-card-content>`; any custom footer block element may be used in its place.
 *
 * MatCardFooter provides no behaviors, instead serving as a purely visual treatment.
 */
declare class MatCardFooter {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatCardFooter, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatCardFooter, "mat-card-footer", never, {}, {}, never, never, true, never>;
}
/**
 * Primary image content for a card, intended for use within `<mat-card>`. Can be applied to
 * any media element, such as `<img>` or `<picture>`.
 *
 * This component is an optional convenience for use with other convenience elements, such as
 * `<mat-card-content>`; any custom media element may be used in its place.
 *
 * MatCardImage provides no behaviors, instead serving as a purely visual treatment.
 */
declare class MatCardImage {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatCardImage, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatCardImage, "[mat-card-image], [matCardImage]", never, {}, {}, never, never, true, never>;
}
/** Same as `MatCardImage`, but small. */
declare class MatCardSmImage {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatCardSmImage, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatCardSmImage, "[mat-card-sm-image], [matCardImageSmall]", never, {}, {}, never, never, true, never>;
}
/** Same as `MatCardImage`, but medium. */
declare class MatCardMdImage {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatCardMdImage, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatCardMdImage, "[mat-card-md-image], [matCardImageMedium]", never, {}, {}, never, never, true, never>;
}
/** Same as `MatCardImage`, but large. */
declare class MatCardLgImage {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatCardLgImage, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatCardLgImage, "[mat-card-lg-image], [matCardImageLarge]", never, {}, {}, never, never, true, never>;
}
/** Same as `MatCardImage`, but extra-large. */
declare class MatCardXlImage {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatCardXlImage, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatCardXlImage, "[mat-card-xl-image], [matCardImageXLarge]", never, {}, {}, never, never, true, never>;
}
/**
 * Avatar image content for a card, intended for use within `<mat-card>`. Can be applied to
 * any media element, such as `<img>` or `<picture>`.
 *
 * This component is an optional convenience for use with other convenience elements, such as
 * `<mat-card-title>`; any custom media element may be used in its place.
 *
 * MatCardAvatar provides no behaviors, instead serving as a purely visual treatment.
 */
declare class MatCardAvatar {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatCardAvatar, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatCardAvatar, "[mat-card-avatar], [matCardAvatar]", never, {}, {}, never, never, true, never>;
}

declare class MatCardModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatCardModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<MatCardModule, never, [typeof MatCommonModule, typeof MatCard, typeof MatCardActions, typeof MatCardAvatar, typeof MatCardContent, typeof MatCardFooter, typeof MatCardHeader, typeof MatCardImage, typeof MatCardLgImage, typeof MatCardMdImage, typeof MatCardSmImage, typeof MatCardSubtitle, typeof MatCardTitle, typeof MatCardTitleGroup, typeof MatCardXlImage], [typeof MatCard, typeof MatCardActions, typeof MatCardAvatar, typeof MatCardContent, typeof MatCardFooter, typeof MatCardHeader, typeof MatCardImage, typeof MatCardLgImage, typeof MatCardMdImage, typeof MatCardSmImage, typeof MatCardSubtitle, typeof MatCardTitle, typeof MatCardTitleGroup, typeof MatCardXlImage, typeof MatCommonModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<MatCardModule>;
}

export { MAT_CARD_CONFIG, MatCard, MatCardActions, MatCardAvatar, MatCardContent, MatCardFooter, MatCardHeader, MatCardImage, MatCardLgImage, MatCardMdImage, MatCardModule, MatCardSmImage, MatCardSubtitle, MatCardTitle, MatCardTitleGroup, MatCardXlImage };
export type { MatCardAppearance, MatCardConfig };

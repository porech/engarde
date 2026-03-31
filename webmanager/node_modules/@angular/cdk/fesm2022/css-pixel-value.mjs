/** Coerces a value to a CSS pixel value. */
function coerceCssPixelValue(value) {
    if (value == null) {
        return '';
    }
    return typeof value === 'string' ? value : `${value}px`;
}

export { coerceCssPixelValue };
//# sourceMappingURL=css-pixel-value.mjs.map

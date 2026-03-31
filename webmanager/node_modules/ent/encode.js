'use strict';

var punycode = require('punycode/');
var $decode = punycode.ucs2.decode;
var $encode = punycode.ucs2.encode;

var $TypeError = require('es-errors/type');
var regexTest = require('safe-regex-test');

var revEntities = require('./reversed.json');

var endsInSemicolon = regexTest(/;$/);

var defaultSpecial = {
    '"': true,
    "'": true,
    '<': true,
    '>': true,
    '&': true
};

module.exports = function encode(str, opts) {
    if (typeof str !== 'string') {
        throw new $TypeError('Expected a String');
    }

    var numeric = !opts || !opts.named;
    if (opts && typeof opts.numeric !== 'undefined') { numeric = opts.numeric; }

    var special = (opts && opts.special) || defaultSpecial;

    var codePoints = $decode(str);
    var chars = [];
    for (var i = 0; i < codePoints.length; i++) {
        var cc = codePoints[i];
        var c = $encode([cc]);
        var e = revEntities[cc];
        if (e && (cc >= 127 || special[c]) && !numeric) {
            var hasSemi = endsInSemicolon(e);
            chars[chars.length] = '&' + (hasSemi ? e : e + ';');
        } else if (cc < 32 || cc >= 127 || special[c]) {
            chars[chars.length] = '&#' + cc + ';';
        } else {
            chars[chars.length] = c;
        }
    }
    return chars.join('');
};

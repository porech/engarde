'use strict';

var punycode = require('punycode/');
var $encode = punycode.ucs2.encode;

var regexTest = require('safe-regex-test');
var callBound = require('call-bound');
var $TypeError = require('es-errors/type');

var entities = require('./entities.json');

var endsInSemicolon = regexTest(/;$/);

var $replace = callBound('String.prototype.replace');
var $exec = callBound('RegExp.prototype.exec');
var $parseInt = parseInt;

module.exports = function decode(str) {
    if (typeof str !== 'string') {
        throw new $TypeError('Expected a String');
    }

    return $replace(str, /&(#?[^;\W]+;?)/g, function (_, match) {
        var m = $exec(/^#(\d+);?$/, match);
        if (m) {
            return $encode([$parseInt(m[1], 10)]);
        }
        var m2 = $exec(/^#[Xx]([A-Fa-f0-9]+);?/, match);
        if (m2) {
            return $encode([$parseInt(m2[1], 16)]);
        }
        // named entity
        var hasSemi = endsInSemicolon(match);
        var withoutSemi = hasSemi ? $replace(match, /;$/, '') : match;
        var target = entities[withoutSemi] || (hasSemi && entities[match]);

        if (typeof target === 'number') {
            return $encode([target]);
        } else if (typeof target === 'string') {
            return target;
        }
        return '&' + match;

    });
};

"use strict";
/**
 * @license Angular v<unknown>
 * (c) 2010-2025 Google LLC. https://angular.io/
 * License: MIT
 */!function(e){"function"==typeof define&&define.amd?define(e):e()}((function(){!function e(n){n.__load_patch("getUserMedia",(function(e,n,t){var i=e.navigator;i&&i.getUserMedia&&(i.getUserMedia=function r(e){return function(){var n=Array.prototype.slice.call(arguments),i=t.bindArguments(n,e.name);return e.apply(this,i)}}(i.getUserMedia))}))}(Zone)}));
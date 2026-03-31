"use strict";
/**
 * @license Angular v<unknown>
 * (c) 2010-2025 Google LLC. https://angular.io/
 * License: MIT
 */function patchUserMedia(e){e.__load_patch("getUserMedia",((e,t,a)=>{let r=e.navigator;r&&r.getUserMedia&&(r.getUserMedia=function i(e){return function(){const t=Array.prototype.slice.call(arguments),r=a.bindArguments(t,e.name);return e.apply(this,r)}}(r.getUserMedia))}))}patchUserMedia(Zone);
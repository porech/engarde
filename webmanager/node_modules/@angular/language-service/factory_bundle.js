var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/language-service/plugin-factory.ts
var plugin_factory_exports = {};
__export(plugin_factory_exports, {
  factory: () => factory
});
module.exports = __toCommonJS(plugin_factory_exports);
var factory = (tsModule) => {
  let plugin;
  return {
    create(info) {
      plugin = require("@angular/language-service/bundles/language-service.js")(tsModule);
      return plugin.create(info);
    },
    getExternalFiles(project) {
      var _a, _b;
      return (_b = (_a = plugin == null ? void 0 : plugin.getExternalFiles) == null ? void 0 : _a.call(plugin, project, tsModule.typescript.ProgramUpdateLevel.Full)) != null ? _b : [];
    },
    onConfigurationChanged(config) {
      var _a;
      (_a = plugin == null ? void 0 : plugin.onConfigurationChanged) == null ? void 0 : _a.call(plugin, config);
    }
  };
};
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
//# sourceMappingURL=factory_bundle.js.map

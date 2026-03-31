"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.HostWatchEventType = void 0;
var HostWatchEventType;
(function (HostWatchEventType) {
    HostWatchEventType[HostWatchEventType["Changed"] = 0] = "Changed";
    HostWatchEventType[HostWatchEventType["Created"] = 1] = "Created";
    HostWatchEventType[HostWatchEventType["Deleted"] = 2] = "Deleted";
    HostWatchEventType[HostWatchEventType["Renamed"] = 3] = "Renamed";
})(HostWatchEventType || (exports.HostWatchEventType = HostWatchEventType = {}));

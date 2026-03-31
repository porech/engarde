"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendDebugMessage = sendDebugMessage;
function sendDebugMessage(message, { sendNotification }) {
    void sendNotification({
        method: 'notifications/message',
        params: {
            level: 'debug',
            data: message,
        },
    });
}

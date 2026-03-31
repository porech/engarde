"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPort = checkPort;
const node_assert_1 = __importDefault(require("node:assert"));
const node_net_1 = require("node:net");
const tty_1 = require("./tty");
function createInUseError(port) {
    return new Error(`Port ${port} is already in use. Use '--port' to specify a different port.`);
}
async function checkPort(port, host) {
    // Disabled due to Vite not handling port 0 and instead always using the default value (5173)
    // TODO: Enable this again once Vite is fixed
    // if (port === 0) {
    //   return 0;
    // }
    return new Promise((resolve, reject) => {
        const server = (0, node_net_1.createServer)();
        server
            .once('error', (err) => {
            if (err.code !== 'EADDRINUSE') {
                reject(err);
                return;
            }
            if (!tty_1.isTTY) {
                reject(createInUseError(port));
                return;
            }
            Promise.resolve().then(() => __importStar(require('@inquirer/confirm'))).then(({ default: confirm }) => confirm({
                message: `Port ${port} is already in use.\nWould you like to use a different port?`,
                default: true,
                theme: { prefix: '' },
            }))
                .then((answer) => (answer ? resolve(checkPort(0, host)) : reject(createInUseError(port))), () => reject(createInUseError(port)));
        })
            .once('listening', () => {
            // Get the actual address from the listening server instance
            const address = server.address();
            (0, node_assert_1.default)(address && typeof address !== 'string', 'Port check server address should always be an object.');
            server.close();
            resolve(address.port);
        })
            .listen(port, host);
    });
}

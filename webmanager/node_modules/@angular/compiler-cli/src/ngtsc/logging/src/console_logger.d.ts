/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { Logger, LogLevel } from './logger';
export declare const DEBUG = "\u001B[36mDebug:\u001B[0m";
export declare const WARN = "\u001B[33mWarning:\u001B[0m";
export declare const ERROR = "\u001B[31mError:\u001B[0m";
/**
 * A simple logger that outputs directly to the Console.
 *
 * The log messages can be filtered based on severity via the `logLevel`
 * constructor parameter.
 */
export declare class ConsoleLogger implements Logger {
    level: LogLevel;
    constructor(level: LogLevel);
    debug(...args: string[]): void;
    info(...args: string[]): void;
    warn(...args: string[]): void;
    error(...args: string[]): void;
}

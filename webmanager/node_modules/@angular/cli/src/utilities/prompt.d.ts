/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
export declare function askConfirmation(message: string, defaultResponse: boolean, noTTYResponse?: boolean): Promise<boolean>;
export declare function askQuestion(message: string, choices: {
    name: string;
    value: string | null;
}[], defaultResponseIndex: number, noTTYResponse: null | string): Promise<string | null>;
export declare function askChoices(message: string, choices: {
    name: string;
    value: string;
    checked?: boolean;
}[], noTTYResponse: string[] | null): Promise<string[] | null>;

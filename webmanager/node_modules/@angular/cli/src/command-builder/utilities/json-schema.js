"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseJsonSchemaToOptions = parseJsonSchemaToOptions;
exports.addSchemaOptionsToCommand = addSchemaOptionsToCommand;
const core_1 = require("@angular-devkit/core");
function checkStringMap(keyValuePairOptions, args) {
    for (const key of keyValuePairOptions) {
        const value = args[key];
        if (!Array.isArray(value)) {
            // Value has been parsed.
            continue;
        }
        for (const pair of value) {
            if (pair === undefined) {
                continue;
            }
            if (!pair.includes('=')) {
                throw new Error(`Invalid value for argument: ${key}, Given: '${pair}', Expected key=value pair`);
            }
        }
    }
    return true;
}
function coerceToStringMap(value) {
    const stringMap = {};
    for (const pair of value) {
        // This happens when the flag isn't passed at all.
        if (pair === undefined) {
            continue;
        }
        const eqIdx = pair.indexOf('=');
        if (eqIdx === -1) {
            // In the case it is not valid skip processing this option and handle the error in `checkStringMap`
            return value;
        }
        const key = pair.slice(0, eqIdx);
        stringMap[key] = pair.slice(eqIdx + 1);
    }
    return stringMap;
}
function isStringMap(node) {
    // Exclude fields with more specific kinds of properties.
    if (node.properties || node.patternProperties) {
        return false;
    }
    // Restrict to additionalProperties with string values.
    return (core_1.json.isJsonObject(node.additionalProperties) &&
        !node.additionalProperties.enum &&
        node.additionalProperties.type === 'string');
}
async function parseJsonSchemaToOptions(registry, schema, interactive = true) {
    const options = [];
    function visitor(current, pointer, parentSchema) {
        if (!parentSchema) {
            // Ignore root.
            return;
        }
        else if (pointer.split(/\/(?:properties|items|definitions)\//g).length > 2) {
            // Ignore subitems (objects or arrays).
            return;
        }
        else if (core_1.json.isJsonArray(current)) {
            return;
        }
        if (pointer.indexOf('/not/') != -1) {
            // We don't support anyOf/not.
            throw new Error('The "not" keyword is not supported in JSON Schema.');
        }
        const ptr = core_1.json.schema.parseJsonPointer(pointer);
        const name = ptr[ptr.length - 1];
        if (ptr[ptr.length - 2] != 'properties') {
            // Skip any non-property items.
            return;
        }
        const typeSet = core_1.json.schema.getTypesOfSchema(current);
        if (typeSet.size == 0) {
            throw new Error('Cannot find type of schema.');
        }
        // We only support number, string or boolean (or array of those), so remove everything else.
        const types = [...typeSet].filter((x) => {
            switch (x) {
                case 'boolean':
                case 'number':
                case 'string':
                    return true;
                case 'array':
                    // Only include arrays if they're boolean, string or number.
                    if (core_1.json.isJsonObject(current.items) &&
                        typeof current.items.type == 'string' &&
                        isValidTypeForEnum(current.items.type)) {
                        return true;
                    }
                    return false;
                case 'object':
                    return isStringMap(current);
                default:
                    return false;
            }
        });
        if (types.length == 0) {
            // This means it's not usable on the command line. e.g. an Object.
            return;
        }
        // Only keep enum values we support (booleans, numbers and strings).
        const enumValues = ((core_1.json.isJsonArray(current.enum) && current.enum) ||
            (core_1.json.isJsonObject(current.items) &&
                core_1.json.isJsonArray(current.items.enum) &&
                current.items.enum) ||
            [])
            .filter((value) => isValidTypeForEnum(typeof value))
            .sort();
        let defaultValue = undefined;
        if (current.default !== undefined) {
            switch (types[0]) {
                case 'string':
                    if (typeof current.default == 'string') {
                        defaultValue = current.default;
                    }
                    break;
                case 'array':
                    if (Array.isArray(current.default) && current.default.length > 0) {
                        defaultValue = current.default;
                    }
                    break;
                case 'number':
                    if (typeof current.default == 'number') {
                        defaultValue = current.default;
                    }
                    break;
                case 'boolean':
                    if (typeof current.default == 'boolean') {
                        defaultValue = current.default;
                    }
                    break;
            }
        }
        const $default = current.$default;
        const $defaultIndex = core_1.json.isJsonObject($default) && $default['$source'] == 'argv' ? $default['index'] : undefined;
        const positional = typeof $defaultIndex == 'number' ? $defaultIndex : undefined;
        let required = core_1.json.isJsonArray(schema.required) ? schema.required.includes(name) : false;
        if (required && interactive && current['x-prompt']) {
            required = false;
        }
        const alias = core_1.json.isJsonArray(current.aliases)
            ? [...current.aliases].map((x) => '' + x)
            : current.alias
                ? ['' + current.alias]
                : [];
        const format = typeof current.format == 'string' ? current.format : undefined;
        const visible = current.visible === undefined || current.visible === true;
        const hidden = !!current.hidden || !visible;
        const xUserAnalytics = current['x-user-analytics'];
        const userAnalytics = typeof xUserAnalytics === 'string' ? xUserAnalytics : undefined;
        // Deprecated is set only if it's true or a string.
        const xDeprecated = current['x-deprecated'];
        const deprecated = xDeprecated === true || typeof xDeprecated === 'string' ? xDeprecated : undefined;
        const option = {
            name,
            description: '' + (current.description === undefined ? '' : current.description),
            default: defaultValue,
            choices: enumValues.length ? enumValues : undefined,
            required,
            alias,
            format,
            hidden,
            userAnalytics,
            deprecated,
            positional,
            ...(types[0] === 'object'
                ? {
                    type: 'array',
                    itemValueType: 'string',
                }
                : {
                    type: types[0],
                }),
        };
        options.push(option);
    }
    const flattenedSchema = await registry.ɵflatten(schema);
    core_1.json.schema.visitJsonSchema(flattenedSchema, visitor);
    // Sort by positional and name.
    return options.sort((a, b) => {
        if (a.positional) {
            return b.positional ? a.positional - b.positional : a.name.localeCompare(b.name);
        }
        else if (b.positional) {
            return -1;
        }
        return a.name.localeCompare(b.name);
    });
}
/**
 * Adds schema options to a command also this keeps track of options that are required for analytics.
 * **Note:** This method should be called from the command bundler method.
 *
 * @returns A map from option name to analytics configuration.
 */
function addSchemaOptionsToCommand(localYargs, options, includeDefaultValues) {
    const booleanOptionsWithNoPrefix = new Set();
    const keyValuePairOptions = new Set();
    const optionsWithAnalytics = new Map();
    for (const option of options) {
        const { default: defaultVal, positional, deprecated, description, alias, userAnalytics, type, itemValueType, hidden, name, choices, } = option;
        let dashedName = core_1.strings.dasherize(name);
        // Handle options which have been defined in the schema with `no` prefix.
        if (type === 'boolean' && dashedName.startsWith('no-')) {
            dashedName = dashedName.slice(3);
            booleanOptionsWithNoPrefix.add(dashedName);
        }
        if (itemValueType) {
            keyValuePairOptions.add(dashedName);
        }
        const sharedOptions = {
            alias,
            hidden,
            description,
            deprecated,
            choices,
            coerce: itemValueType ? coerceToStringMap : undefined,
            // This should only be done when `--help` is used otherwise default will override options set in angular.json.
            ...(includeDefaultValues ? { default: defaultVal } : {}),
        };
        if (positional === undefined) {
            localYargs = localYargs.option(dashedName, {
                array: itemValueType ? true : undefined,
                type: itemValueType ?? type,
                ...sharedOptions,
            });
        }
        else {
            localYargs = localYargs.positional(dashedName, {
                type: type === 'array' || type === 'count' ? 'string' : type,
                ...sharedOptions,
            });
        }
        // Record option of analytics.
        if (userAnalytics !== undefined) {
            optionsWithAnalytics.set(name, userAnalytics);
        }
    }
    // Valid key/value options
    if (keyValuePairOptions.size) {
        localYargs.check(checkStringMap.bind(null, keyValuePairOptions), false);
    }
    // Handle options which have been defined in the schema with `no` prefix.
    if (booleanOptionsWithNoPrefix.size) {
        localYargs.middleware((options) => {
            for (const key of booleanOptionsWithNoPrefix) {
                if (key in options) {
                    options[`no-${key}`] = !options[key];
                    delete options[key];
                }
            }
        }, false);
    }
    return optionsWithAnalytics;
}
const VALID_ENUM_TYPES = new Set(['boolean', 'number', 'string']);
function isValidTypeForEnum(value) {
    return VALID_ENUM_TYPES.has(value);
}

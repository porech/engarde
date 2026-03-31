"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrateSingleFile = migrateSingleFile;
const analyze_for_unsupported_zone_uses_1 = require("./analyze_for_unsupported_zone_uses");
const migrate_test_file_1 = require("./migrate_test_file");
const prompts_1 = require("./prompts");
const send_debug_message_1 = require("./send_debug_message");
const ts_utils_1 = require("./ts_utils");
async function migrateSingleFile(sourceFile, extras) {
    const testBedSpecifier = await (0, ts_utils_1.getImportSpecifier)(sourceFile, '@angular/core/testing', 'TestBed');
    const isTestFile = sourceFile.fileName.endsWith('.spec.ts') || !!testBedSpecifier;
    if (isTestFile) {
        return (0, migrate_test_file_1.migrateTestFile)(sourceFile);
    }
    const unsupportedZoneUseResponse = await (0, analyze_for_unsupported_zone_uses_1.analyzeForUnsupportedZoneUses)(sourceFile);
    if (unsupportedZoneUseResponse) {
        return unsupportedZoneUseResponse;
    }
    let detectedStrategy;
    let hasComponentDecorator = false;
    const componentSpecifier = await (0, ts_utils_1.getImportSpecifier)(sourceFile, '@angular/core', 'Component');
    if (!componentSpecifier) {
        (0, send_debug_message_1.sendDebugMessage)(`No component decorator found in file: ${sourceFile.fileName}`, extras);
        return null;
    }
    const ts = await (0, ts_utils_1.loadTypescript)();
    ts.forEachChild(sourceFile, function visit(node) {
        if (detectedStrategy) {
            return; // Already found, no need to traverse further
        }
        if (ts.isDecorator(node) && ts.isCallExpression(node.expression)) {
            const callExpr = node.expression;
            if (callExpr.expression.getText(sourceFile) === 'Component') {
                hasComponentDecorator = true;
                if (callExpr.arguments.length > 0 && ts.isObjectLiteralExpression(callExpr.arguments[0])) {
                    const componentMetadata = callExpr.arguments[0];
                    for (const prop of componentMetadata.properties) {
                        if (ts.isPropertyAssignment(prop) &&
                            prop.name.getText(sourceFile) === 'changeDetection') {
                            if (ts.isPropertyAccessExpression(prop.initializer) &&
                                prop.initializer.expression.getText(sourceFile) === 'ChangeDetectionStrategy') {
                                const strategy = prop.initializer.name.text;
                                if (strategy === 'OnPush' || strategy === 'Default') {
                                    detectedStrategy = strategy;
                                    return;
                                }
                            }
                        }
                    }
                }
            }
        }
        ts.forEachChild(node, visit);
    });
    if (!hasComponentDecorator ||
        // component uses OnPush. We don't have anything more to do here.
        detectedStrategy === 'OnPush' ||
        // Explicit default strategy, assume there's a reason for it (already migrated, or is a library that hosts Default components) and skip.
        detectedStrategy === 'Default') {
        (0, send_debug_message_1.sendDebugMessage)(`Component decorator found with strategy: ${detectedStrategy} in file: ${sourceFile.fileName}. Skipping migration for file.`, extras);
        return null;
    }
    // Component decorator found, but no change detection strategy.
    return (0, prompts_1.generateZonelessMigrationInstructionsForComponent)(sourceFile.fileName);
}

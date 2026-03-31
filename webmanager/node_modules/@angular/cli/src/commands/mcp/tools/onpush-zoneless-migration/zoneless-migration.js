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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZONELESS_MIGRATION_TOOL = void 0;
exports.registerZonelessMigrationTool = registerZonelessMigrationTool;
const fs = __importStar(require("node:fs"));
const promises_1 = require("node:fs/promises");
const zod_1 = require("zod");
const tool_registry_1 = require("../tool-registry");
const analyze_for_unsupported_zone_uses_1 = require("./analyze_for_unsupported_zone_uses");
const migrate_single_file_1 = require("./migrate_single_file");
const migrate_test_file_1 = require("./migrate_test_file");
const prompts_1 = require("./prompts");
const send_debug_message_1 = require("./send_debug_message");
const ts_utils_1 = require("./ts_utils");
exports.ZONELESS_MIGRATION_TOOL = (0, tool_registry_1.declareTool)({
    name: 'onpush-zoneless-migration',
    title: 'Plan migration to OnPush and/or zoneless',
    description: `
<Purpose>
Analyzes Angular code and provides a step-by-step, iterative plan to migrate it to \`OnPush\`
change detection, a prerequisite for a zoneless application. This tool identifies the next single
most important action to take in the migration journey.
</Purpose>
<Use Cases>
* **Step-by-Step Migration:** Running the tool repeatedly to get the next instruction for a full
  migration to \`OnPush\`.
* **Pre-Migration Analysis:** Checking a component or directory for unsupported \`NgZone\` APIs that
  would block a zoneless migration.
* **Generating Component Migrations:** Getting the exact instructions for converting a single
  component from the default change detection strategy to \`OnPush\`.
</Use Cases>
<Operational Notes>
* **Execution Model:** This tool **DOES NOT** modify code. It **PROVIDES INSTRUCTIONS** for a
  single action at a time. You **MUST** apply the changes it suggests, and then run the tool
  again to get the next step.
* **Iterative Process:** The migration process is iterative. You must call this tool repeatedly,
  applying the suggested fix after each call, until the tool indicates that no more actions are
  needed.
* **Relationship to \`modernize\`:** This tool is the specialized starting point for the zoneless/OnPush
  migration. For other migrations (like signal inputs), you should use the \`modernize\` tool first,
  as the zoneless migration may depend on them as prerequisites.
* **Input:** The tool can operate on either a single file or an entire directory. Provide the
  absolute path.
</Operational Notes>`,
    isReadOnly: true,
    isLocalOnly: true,
    inputSchema: {
        fileOrDirPath: zod_1.z
            .string()
            .describe('The absolute path of the directory or file with the component(s), directive(s), or service(s) to migrate.' +
            ' The contents are read with fs.readFileSync.'),
    },
    factory: () => ({ fileOrDirPath }, requestHandlerExtra) => registerZonelessMigrationTool(fileOrDirPath, requestHandlerExtra),
});
async function registerZonelessMigrationTool(fileOrDirPath, extras) {
    let files = [];
    const componentTestFiles = new Set();
    const filesWithComponents = new Set();
    const zoneFiles = new Set();
    if (fs.statSync(fileOrDirPath).isDirectory()) {
        const allFiles = (0, promises_1.glob)(`${fileOrDirPath}/**/*.ts`);
        for await (const file of allFiles) {
            files.push(await (0, ts_utils_1.createSourceFile)(file));
        }
    }
    else {
        files = [await (0, ts_utils_1.createSourceFile)(fileOrDirPath)];
        const maybeTestFile = await getTestFilePath(fileOrDirPath);
        if (maybeTestFile) {
            componentTestFiles.add(await (0, ts_utils_1.createSourceFile)(maybeTestFile));
        }
    }
    for (const sourceFile of files) {
        const content = sourceFile.getFullText();
        const componentSpecifier = await (0, ts_utils_1.getImportSpecifier)(sourceFile, '@angular/core', 'Component');
        const zoneSpecifier = await (0, ts_utils_1.getImportSpecifier)(sourceFile, '@angular/core', 'NgZone');
        const testBedSpecifier = await (0, ts_utils_1.getImportSpecifier)(sourceFile, /(@angular\/core)?\/testing/, 'TestBed');
        if (testBedSpecifier) {
            componentTestFiles.add(sourceFile);
        }
        else if (componentSpecifier) {
            if (!content.includes('changeDetectionStrategy: ChangeDetectionStrategy.OnPush') &&
                !content.includes('changeDetectionStrategy: ChangeDetectionStrategy.Default')) {
                filesWithComponents.add(sourceFile);
            }
            else {
                (0, send_debug_message_1.sendDebugMessage)(`Component file already has change detection strategy: ${sourceFile.fileName}. Skipping migration.`, extras);
            }
            const testFilePath = await getTestFilePath(sourceFile.fileName);
            if (testFilePath) {
                componentTestFiles.add(await (0, ts_utils_1.createSourceFile)(testFilePath));
            }
        }
        else if (zoneSpecifier) {
            zoneFiles.add(sourceFile);
        }
    }
    if (zoneFiles.size > 0) {
        for (const file of zoneFiles) {
            const result = await (0, analyze_for_unsupported_zone_uses_1.analyzeForUnsupportedZoneUses)(file);
            if (result !== null) {
                return result;
            }
        }
    }
    if (filesWithComponents.size > 0) {
        const rankedFiles = filesWithComponents.size > 1
            ? await rankComponentFilesForMigration(extras, Array.from(filesWithComponents))
            : Array.from(filesWithComponents);
        for (const file of rankedFiles) {
            const result = await (0, migrate_single_file_1.migrateSingleFile)(file, extras);
            if (result !== null) {
                return result;
            }
        }
    }
    for (const file of componentTestFiles) {
        const result = await (0, migrate_test_file_1.migrateTestFile)(file);
        if (result !== null) {
            return result;
        }
    }
    return (0, prompts_1.createTestDebuggingGuideForNonActionableInput)(fileOrDirPath);
}
async function rankComponentFilesForMigration({ sendRequest }, componentFiles) {
    try {
        const response = await sendRequest({
            method: 'sampling/createMessage',
            params: {
                messages: [
                    {
                        role: 'user',
                        content: {
                            type: 'text',
                            text: `The following files are components that need to be migrated to OnPush change detection.` +
                                ` Please rank them based on which ones are most likely to be shared or common components.` +
                                ` The most likely shared component should be first.
  ${componentFiles.map((f) => f.fileName).join('\n  ')}
  Respond ONLY with the ranked list of files, one file per line.`,
                        },
                    },
                ],
                systemPrompt: 'You are a helpful assistant that helps migrate identify shared Angular components.',
                maxTokens: 2000,
            },
        }, zod_1.z.object({ sortedFiles: zod_1.z.array(zod_1.z.string()) }));
        const rankedFiles = response.sortedFiles
            .map((line) => line.trim())
            .map((fileName) => componentFiles.find((f) => f.fileName === fileName))
            .filter((f) => !!f);
        // Ensure the ranking didn't mess up the list of files
        if (rankedFiles.length === componentFiles.length) {
            return rankedFiles;
        }
    }
    catch { }
    return componentFiles; // Fallback to original order if the response fails
}
async function getTestFilePath(filePath) {
    const testFilePath = filePath.replace(/\.ts$/, '.spec.ts');
    if (fs.existsSync(testFilePath)) {
        return testFilePath;
    }
    return undefined;
}

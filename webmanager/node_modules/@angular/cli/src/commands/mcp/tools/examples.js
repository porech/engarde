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
exports.FIND_EXAMPLE_TOOL = void 0;
exports.escapeSearchQuery = escapeSearchQuery;
const promises_1 = require("node:fs/promises");
const node_path_1 = __importDefault(require("node:path"));
const zod_1 = require("zod");
const tool_registry_1 = require("./tool-registry");
const findExampleInputSchema = zod_1.z.object({
    query: zod_1.z.string().describe(`Performs a full-text search using FTS5 syntax. The query should target relevant Angular concepts.

Key Syntax Features (see https://www.sqlite.org/fts5.html for full documentation):
  - AND (default): Space-separated terms are combined with AND.
    - Example: 'standalone component' (finds results with both "standalone" and "component")
  - OR: Use the OR operator to find results with either term.
    - Example: 'validation OR validator'
  - NOT: Use the NOT operator to exclude terms.
    - Example: 'forms NOT reactive'
  - Grouping: Use parentheses () to group expressions.
    - Example: '(validation OR validator) AND forms'
  - Phrase Search: Use double quotes "" for exact phrases.
    - Example: '"template-driven forms"'
  - Prefix Search: Use an asterisk * for prefix matching.
    - Example: 'rout*' (matches "route", "router", "routing")

Examples of queries:
  - Find standalone components: 'standalone component'
  - Find ngFor with trackBy: 'ngFor trackBy'
  - Find signal inputs: 'signal input'
  - Find lazy loading a route: 'lazy load route'
  - Find forms with validation: 'form AND (validation OR validator)'`),
});
exports.FIND_EXAMPLE_TOOL = (0, tool_registry_1.declareTool)({
    name: 'find_examples',
    title: 'Find Angular Code Examples',
    description: `
<Purpose>
Augments your knowledge base with a curated database of official, best-practice code examples,
focusing on **modern, new, and recently updated** Angular features. This tool acts as a RAG
(Retrieval-Augmented Generation) source, providing ground-truth information on the latest Angular
APIs and patterns. You **MUST** use it to understand and apply current standards when working with
new or evolving features.
</Purpose>
<Use Cases>
* **Knowledge Augmentation:** Learning about new or updated Angular features (e.g., query: 'signal input' or 'deferrable views').
* **Modern Implementation:** Finding the correct modern syntax for features
  (e.g., query: 'functional route guard' or 'http client with fetch').
* **Refactoring to Modern Patterns:** Upgrading older code by finding examples of new syntax
  (e.g., query: 'built-in control flow' to replace "*ngIf').
</Use Cases>
<Operational Notes>
* **Tool Selection:** This database primarily contains examples for new and recently updated Angular
  features. For established, core features, the main documentation (via the
  \`search_documentation\` tool) may be a better source of information.
* The examples in this database are the single source of truth for modern Angular coding patterns.
* The search query uses a powerful full-text search syntax (FTS5). Refer to the 'query'
  parameter description for detailed syntax rules and examples.
</Operational Notes>`,
    inputSchema: findExampleInputSchema.shape,
    outputSchema: {
        examples: zod_1.z.array(zod_1.z.object({
            content: zod_1.z
                .string()
                .describe('A complete, self-contained Angular code example in Markdown format.'),
        })),
    },
    isReadOnly: true,
    isLocalOnly: true,
    shouldRegister: ({ logger }) => {
        // sqlite database support requires Node.js 22.16+
        const [nodeMajor, nodeMinor] = process.versions.node.split('.', 2).map(Number);
        if (nodeMajor < 22 || (nodeMajor === 22 && nodeMinor < 16)) {
            logger.warn(`MCP tool 'find_examples' requires Node.js 22.16 (or higher). ` +
                ' Registration of this tool has been skipped.');
            return false;
        }
        return true;
    },
    factory: createFindExampleHandler,
});
async function createFindExampleHandler({ exampleDatabasePath }) {
    let db;
    let queryStatement;
    if (process.env['NG_MCP_EXAMPLES_DIR']) {
        db = await setupRuntimeExamples(process.env['NG_MCP_EXAMPLES_DIR']);
    }
    suppressSqliteWarning();
    return async ({ query }) => {
        if (!db) {
            if (!exampleDatabasePath) {
                // This should be prevented by the registration logic in mcp-server.ts
                throw new Error('Example database path is not available.');
            }
            const { DatabaseSync } = await Promise.resolve().then(() => __importStar(require('node:sqlite')));
            db = new DatabaseSync(exampleDatabasePath, { readOnly: true });
        }
        if (!queryStatement) {
            queryStatement = db.prepare('SELECT * from examples WHERE examples MATCH ? ORDER BY rank;');
        }
        const sanitizedQuery = escapeSearchQuery(query);
        // Query database and return results
        const examples = [];
        const textContent = [];
        for (const exampleRecord of queryStatement.all(sanitizedQuery)) {
            const exampleContent = exampleRecord['content'];
            examples.push({ content: exampleContent });
            textContent.push({ type: 'text', text: exampleContent });
        }
        return {
            content: textContent,
            structuredContent: { examples },
        };
    };
}
/**
 * Escapes a search query for FTS5 by tokenizing and quoting terms.
 *
 * This function processes a raw search string and prepares it for an FTS5 full-text search.
 * It correctly handles quoted phrases, logical operators (AND, OR, NOT), parentheses,
 * and prefix searches (ending with an asterisk), ensuring that individual search
 * terms are properly quoted to be treated as literals by the search engine.
 * This is primarily intended to avoid unintentional usage of FTS5 query syntax by consumers.
 *
 * @param query The raw search query string.
 * @returns A sanitized query string suitable for FTS5.
 */
function escapeSearchQuery(query) {
    // This regex tokenizes the query string into parts:
    // 1. Quoted phrases (e.g., "foo bar")
    // 2. Parentheses ( and )
    // 3. FTS5 operators (AND, OR, NOT, NEAR)
    // 4. Words, which can include a trailing asterisk for prefix search (e.g., foo*)
    const tokenizer = /"([^"]*)"|([()])|\b(AND|OR|NOT|NEAR)\b|([^\s()]+)/g;
    let match;
    const result = [];
    let lastIndex = 0;
    while ((match = tokenizer.exec(query)) !== null) {
        // Add any whitespace or other characters between tokens
        if (match.index > lastIndex) {
            result.push(query.substring(lastIndex, match.index));
        }
        const [, quoted, parenthesis, operator, term] = match;
        if (quoted !== undefined) {
            // It's a quoted phrase, keep it as is.
            result.push(`"${quoted}"`);
        }
        else if (parenthesis) {
            // It's a parenthesis, keep it as is.
            result.push(parenthesis);
        }
        else if (operator) {
            // It's an operator, keep it as is.
            result.push(operator);
        }
        else if (term) {
            // It's a term that needs to be quoted.
            if (term.endsWith('*')) {
                result.push(`"${term.slice(0, -1)}"*`);
            }
            else {
                result.push(`"${term}"`);
            }
        }
        lastIndex = tokenizer.lastIndex;
    }
    // Add any remaining part of the string
    if (lastIndex < query.length) {
        result.push(query.substring(lastIndex));
    }
    return result.join('');
}
/**
 * Suppresses the experimental warning emitted by Node.js for the `node:sqlite` module.
 *
 * This is a workaround to prevent the console from being cluttered with warnings
 * about the experimental status of the SQLite module, which is used by this tool.
 */
function suppressSqliteWarning() {
    const originalProcessEmit = process.emit;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    process.emit = function (event, error) {
        if (event === 'warning' &&
            error instanceof Error &&
            error.name === 'ExperimentalWarning' &&
            error.message.includes('SQLite')) {
            return false;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, prefer-rest-params
        return originalProcessEmit.apply(process, arguments);
    };
}
async function setupRuntimeExamples(examplesPath) {
    const { DatabaseSync } = await Promise.resolve().then(() => __importStar(require('node:sqlite')));
    const db = new DatabaseSync(':memory:');
    db.exec(`CREATE VIRTUAL TABLE examples USING fts5(content, tokenize = 'porter ascii');`);
    const insertStatement = db.prepare('INSERT INTO examples(content) VALUES(?);');
    db.exec('BEGIN TRANSACTION');
    for await (const entry of (0, promises_1.glob)('*.md', { cwd: examplesPath, withFileTypes: true })) {
        if (!entry.isFile()) {
            continue;
        }
        const example = await (0, promises_1.readFile)(node_path_1.default.join(entry.parentPath, entry.name), 'utf-8');
        insertStatement.run(example);
    }
    db.exec('END TRANSACTION');
    return db;
}

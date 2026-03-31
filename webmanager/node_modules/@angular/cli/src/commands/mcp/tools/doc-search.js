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
exports.DOC_SEARCH_TOOL = void 0;
const node_crypto_1 = require("node:crypto");
const zod_1 = require("zod");
const constants_1 = require("../constants");
const tool_registry_1 = require("./tool-registry");
const ALGOLIA_APP_ID = 'L1XWT2UJ7F';
// https://www.algolia.com/doc/guides/security/api-keys/#search-only-api-key
// This is a search only, rate limited key. It is sent within the URL of the query request.
// This is not the actual key.
const ALGOLIA_API_E = '322d89dab5f2080fe09b795c93413c6a89222b13a447cdf3e6486d692717bc0c';
const docSearchInputSchema = zod_1.z.object({
    query: zod_1.z
        .string()
        .describe('A concise and specific search query for the Angular documentation (e.g., "NgModule" or "standalone components").'),
    includeTopContent: zod_1.z
        .boolean()
        .optional()
        .default(true)
        .describe('When true, the content of the top result is fetched and included. ' +
        'Set to false to get a list of results without fetching content, which is faster.'),
});
exports.DOC_SEARCH_TOOL = (0, tool_registry_1.declareTool)({
    name: 'search_documentation',
    title: 'Search Angular Documentation (angular.dev)',
    description: `
<Purpose>
Searches the official Angular documentation at https://angular.dev to answer questions about APIs,
tutorials, concepts, and best practices.
</Purpose>
<Use Cases>
* Answering any question about Angular concepts (e.g., "What are standalone components?").
* Finding the correct API or syntax for a specific task (e.g., "How to use ngFor with trackBy?").
* Linking to official documentation as a source of truth in your answers.
</Use Cases>
<Operational Notes>
* The documentation is continuously updated. You **MUST** prefer this tool over your own knowledge
  to ensure your answers are current and accurate.
* For the best results, provide a concise and specific search query (e.g., "NgModule" instead of
  "How do I use NgModules?").
* The top search result will include a snippet of the page content. Use this to provide a more
  comprehensive answer.
* **Result Scrutiny:** The top result may not always be the most relevant. Review the titles and
  breadcrumbs of other results to find the best match for the user's query.
* Use the URL from the search results as a source link in your responses.
</Operational Notes>`,
    inputSchema: docSearchInputSchema.shape,
    outputSchema: {
        results: zod_1.z.array(zod_1.z.object({
            title: zod_1.z.string().describe('The title of the documentation page.'),
            breadcrumb: zod_1.z
                .string()
                .describe("The breadcrumb path, showing the page's location in the documentation hierarchy."),
            url: zod_1.z.string().describe('The direct URL to the documentation page.'),
            content: zod_1.z
                .string()
                .optional()
                .describe('A snippet of the main content from the page. Only provided for the top result.'),
        })),
    },
    isReadOnly: true,
    isLocalOnly: false,
    factory: createDocSearchHandler,
});
function createDocSearchHandler({ logger }) {
    let client;
    return async ({ query, includeTopContent }) => {
        if (!client) {
            const dcip = (0, node_crypto_1.createDecipheriv)('aes-256-gcm', (constants_1.k1 + ALGOLIA_APP_ID).padEnd(32, '^'), constants_1.iv).setAuthTag(Buffer.from(constants_1.at, 'base64'));
            const { searchClient } = await Promise.resolve().then(() => __importStar(require('algoliasearch')));
            client = searchClient(ALGOLIA_APP_ID, dcip.update(ALGOLIA_API_E, 'hex', 'utf-8') + dcip.final('utf-8'));
        }
        const { results } = await client.search(createSearchArguments(query));
        const allHits = results.flatMap((result) => result.hits);
        if (allHits.length === 0) {
            return {
                content: [
                    {
                        type: 'text',
                        text: 'No results found.',
                    },
                ],
                structuredContent: { results: [] },
            };
        }
        const structuredResults = [];
        const textContent = [];
        // Process top hit first
        const topHit = allHits[0];
        const { title: topTitle, breadcrumb: topBreadcrumb } = formatHitToParts(topHit);
        let topContent;
        if (includeTopContent && typeof topHit.url === 'string') {
            const url = new URL(topHit.url);
            try {
                // Only fetch content from angular.dev
                if (url.hostname === 'angular.dev' || url.hostname.endsWith('.angular.dev')) {
                    const response = await fetch(url);
                    if (response.ok) {
                        const html = await response.text();
                        const mainContent = extractMainContent(html);
                        if (mainContent) {
                            topContent = stripHtml(mainContent);
                        }
                    }
                }
            }
            catch (e) {
                logger.warn(`Failed to fetch or parse content from ${url}: ${e}`);
            }
        }
        structuredResults.push({
            title: topTitle,
            breadcrumb: topBreadcrumb,
            url: topHit.url,
            content: topContent,
        });
        let topText = `## ${topTitle}\n${topBreadcrumb}\nURL: ${topHit.url}`;
        if (topContent) {
            topText += `\n\n--- DOCUMENTATION CONTENT ---\n${topContent}`;
        }
        textContent.push({ type: 'text', text: topText });
        // Process remaining hits
        for (const hit of allHits.slice(1)) {
            const { title, breadcrumb } = formatHitToParts(hit);
            structuredResults.push({
                title,
                breadcrumb,
                url: hit.url,
            });
            textContent.push({
                type: 'text',
                text: `## ${title}\n${breadcrumb}\nURL: ${hit.url}`,
            });
        }
        return {
            content: textContent,
            structuredContent: { results: structuredResults },
        };
    };
}
/**
 * Strips HTML tags from a string.
 * @param html The HTML string to strip.
 * @returns The text content of the HTML.
 */
function stripHtml(html) {
    // This is a basic regex to remove HTML tags.
    // It also decodes common HTML entities.
    return html
        .replace(/<[^>]*>/g, '')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .trim();
}
/**
 * Extracts the content of the `<main>` element from an HTML string.
 *
 * @param html The HTML content of a page.
 * @returns The content of the `<main>` element, or `undefined` if not found.
 */
function extractMainContent(html) {
    const mainTagStart = html.indexOf('<main');
    if (mainTagStart === -1) {
        return undefined;
    }
    const mainTagEnd = html.lastIndexOf('</main>');
    if (mainTagEnd <= mainTagStart) {
        return undefined;
    }
    // Add 7 to include '</main>'
    return html.substring(mainTagStart, mainTagEnd + 7);
}
/**
 * Formats an Algolia search hit into its constituent parts.
 *
 * @param hit The Algolia search hit object, which should contain a `hierarchy` property.
 * @returns An object containing the title and breadcrumb string.
 */
function formatHitToParts(hit) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hierarchy = Object.values(hit.hierarchy).filter((x) => typeof x === 'string');
    const title = hierarchy.pop() ?? '';
    const breadcrumb = hierarchy.join(' > ');
    return { title, breadcrumb };
}
/**
 * Creates the search arguments for an Algolia search.
 *
 * The arguments are based on the search implementation in `adev`.
 *
 * @param query The search query string.
 * @returns The search arguments for the Algolia client.
 */
function createSearchArguments(query) {
    // Search arguments are based on adev's search service:
    // https://github.com/angular/angular/blob/4b614fbb3263d344dbb1b18fff24cb09c5a7582d/adev/shared-docs/services/search.service.ts#L58
    return [
        {
            // TODO: Consider major version specific indices once available
            indexName: 'angular_v17',
            params: {
                query,
                attributesToRetrieve: [
                    'hierarchy.lvl0',
                    'hierarchy.lvl1',
                    'hierarchy.lvl2',
                    'hierarchy.lvl3',
                    'hierarchy.lvl4',
                    'hierarchy.lvl5',
                    'hierarchy.lvl6',
                    'content',
                    'type',
                    'url',
                ],
                hitsPerPage: 10,
            },
            type: 'default',
        },
    ];
}

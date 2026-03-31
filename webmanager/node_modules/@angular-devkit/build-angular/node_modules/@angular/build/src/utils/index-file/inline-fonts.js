"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.InlineFontsProcessor = void 0;
const https_proxy_agent_1 = require("https-proxy-agent");
const node_crypto_1 = require("node:crypto");
const promises_1 = require("node:fs/promises");
const node_https_1 = require("node:https");
const node_path_1 = require("node:path");
const html_rewriting_stream_1 = require("./html-rewriting-stream");
const SUPPORTED_PROVIDERS = {
    'fonts.googleapis.com': {
        preconnectUrl: 'https://fonts.gstatic.com',
    },
    'use.typekit.net': {
        preconnectUrl: 'https://use.typekit.net',
    },
};
/**
 * Hash algorithm used for cached files.
 */
const CONTENT_HASH_ALGORITHM = 'sha256';
/**
 * String length of the SHA-256 content hash stored in cached files.
 */
const CONTENT_HASH_LENGTH = 64;
class InlineFontsProcessor {
    options;
    cachePath;
    constructor(options) {
        this.options = options;
        const { path: cacheDirectory, enabled } = this.options.cache || {};
        if (cacheDirectory && enabled) {
            this.cachePath = (0, node_path_1.join)(cacheDirectory, 'angular-build-fonts');
        }
    }
    async process(content) {
        const hrefList = [];
        const existingPreconnect = new Set();
        // Collector link tags with href
        const { rewriter: collectorStream, transformedContent: initCollectorStream } = await (0, html_rewriting_stream_1.htmlRewritingStream)(content);
        collectorStream.on('startTag', (tag) => {
            const { tagName, attrs } = tag;
            if (tagName !== 'link') {
                return;
            }
            let hrefValue;
            let relValue;
            for (const { name, value } of attrs) {
                switch (name) {
                    case 'rel':
                        relValue = value;
                        break;
                    case 'href':
                        hrefValue = value;
                        break;
                }
                if (hrefValue && relValue) {
                    switch (relValue) {
                        case 'stylesheet':
                            // <link rel="stylesheet" href="https://example.com/main.css">
                            hrefList.push(hrefValue);
                            break;
                        case 'preconnect':
                            // <link rel="preconnect" href="https://example.com">
                            existingPreconnect.add(hrefValue.replace(/\/$/, ''));
                            break;
                    }
                    return;
                }
            }
        });
        void initCollectorStream().catch(() => {
            // We don't really care about any errors here because it just initializes
            // the rewriting stream, as we are waiting for `finish` below.
        });
        await new Promise((resolve) => collectorStream.on('finish', resolve));
        // Download stylesheets
        const hrefsContent = new Map();
        const newPreconnectUrls = new Set();
        for (const hrefItem of hrefList) {
            const url = this.createNormalizedUrl(hrefItem);
            if (!url) {
                continue;
            }
            const content = await this.processURL(url);
            if (content === undefined) {
                continue;
            }
            hrefsContent.set(hrefItem, content);
            // Add preconnect
            const preconnectUrl = this.getFontProviderDetails(url)?.preconnectUrl;
            if (preconnectUrl && !existingPreconnect.has(preconnectUrl)) {
                newPreconnectUrls.add(preconnectUrl);
            }
        }
        if (hrefsContent.size === 0) {
            return content;
        }
        // Replace link with style tag.
        const { rewriter, transformedContent } = await (0, html_rewriting_stream_1.htmlRewritingStream)(content);
        rewriter.on('startTag', (tag) => {
            const { tagName, attrs } = tag;
            switch (tagName) {
                case 'head':
                    rewriter.emitStartTag(tag);
                    for (const url of newPreconnectUrls) {
                        rewriter.emitRaw(`<link rel="preconnect" href="${url}" crossorigin>`);
                    }
                    break;
                case 'link': {
                    const hrefAttr = attrs.some(({ name, value }) => name === 'rel' && value === 'stylesheet') &&
                        attrs.find(({ name, value }) => name === 'href' && hrefsContent.has(value));
                    if (hrefAttr) {
                        const href = hrefAttr.value;
                        const cssContent = hrefsContent.get(href);
                        rewriter.emitRaw(`<style>${cssContent}</style>`);
                    }
                    else {
                        rewriter.emitStartTag(tag);
                    }
                    break;
                }
                default:
                    rewriter.emitStartTag(tag);
                    break;
            }
        });
        return transformedContent();
    }
    async getResponse(url) {
        let cacheFile;
        if (this.cachePath) {
            const key = (0, node_crypto_1.createHash)(CONTENT_HASH_ALGORITHM).update(`${url}`).digest('hex');
            cacheFile = (0, node_path_1.join)(this.cachePath, key);
        }
        if (cacheFile) {
            try {
                const data = await (0, promises_1.readFile)(cacheFile, 'utf8');
                // Check for valid content via stored hash
                if (data.length > CONTENT_HASH_LENGTH) {
                    const storedHash = data.slice(0, CONTENT_HASH_LENGTH);
                    const content = data.slice(CONTENT_HASH_LENGTH);
                    const contentHash = (0, node_crypto_1.createHash)(CONTENT_HASH_ALGORITHM).update(content).digest('base64');
                    if (storedHash === contentHash) {
                        // Return valid content
                        return content;
                    }
                    else {
                        // Delete corrupted cache content
                        await (0, promises_1.rm)(cacheFile);
                    }
                }
            }
            catch { }
        }
        const httpsProxy = process.env.HTTPS_PROXY ?? process.env.https_proxy;
        const data = await new Promise((resolve, reject) => {
            let rawResponse = '';
            (0, node_https_1.get)(url, {
                agent: httpsProxy ? new https_proxy_agent_1.HttpsProxyAgent(httpsProxy) : undefined,
                headers: {
                    /**
                     * Always use a Windows UA. This is because Google fonts will including hinting in fonts for Windows.
                     * Hinting is a technique used with Windows files to improve appearance however
                     * results in 20-50% larger file sizes.
                     *
                     * @see http://google3/java/com/google/fonts/css/OpenSansWebFontsCssBuilder.java?l=22
                     * @see https://fonts.google.com/knowledge/glossary/hinting (short)
                     * @see https://glyphsapp.com/learn/hinting-manual-truetype-hinting (deep dive)
                     */
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                },
            }, (res) => {
                if (res.statusCode !== 200) {
                    reject(new Error(`Inlining of fonts failed. ${url} returned status code: ${res.statusCode}.`));
                    return;
                }
                res.on('data', (chunk) => (rawResponse += chunk)).on('end', () => resolve(rawResponse));
            }).on('error', (e) => reject(new Error(`Inlining of fonts failed. An error has occurred while retrieving ${url} over the internet.\n` +
                e.message)));
        });
        if (cacheFile) {
            try {
                const dataHash = (0, node_crypto_1.createHash)(CONTENT_HASH_ALGORITHM).update(data).digest('hex');
                await (0, promises_1.writeFile)(cacheFile, dataHash + data);
            }
            catch { }
        }
        return data;
    }
    async processURL(url) {
        const normalizedURL = url instanceof URL ? url : this.createNormalizedUrl(url);
        if (!normalizedURL) {
            return;
        }
        const provider = this.getFontProviderDetails(normalizedURL);
        if (!provider) {
            return undefined;
        }
        let cssContent = await this.getResponse(normalizedURL);
        if (this.options.minify) {
            cssContent = cssContent
                // Comments.
                .replace(/\/\*([\s\S]*?)\*\//g, '')
                // New lines.
                .replace(/\n/g, '')
                // Safe spaces.
                .replace(/\s?[{:;]\s+/g, (s) => s.trim());
        }
        return cssContent;
    }
    canInlineRequest(url) {
        const normalizedUrl = this.createNormalizedUrl(url);
        return normalizedUrl ? !!this.getFontProviderDetails(normalizedUrl) : false;
    }
    getFontProviderDetails(url) {
        return SUPPORTED_PROVIDERS[url.hostname];
    }
    createNormalizedUrl(value) {
        // Need to convert '//' to 'https://' because the URL parser will fail with '//'.
        const url = new URL(value.startsWith('//') ? `https:${value}` : value, 'resolve://');
        switch (url.protocol) {
            case 'http:':
            case 'https:':
                url.protocol = 'https:';
                return url;
            default:
                return undefined;
        }
    }
}
exports.InlineFontsProcessor = InlineFontsProcessor;

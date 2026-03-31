"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexHtmlGenerator = void 0;
const promises_1 = require("node:fs/promises");
const node_path_1 = require("node:path");
const add_event_dispatch_contract_1 = require("./add-event-dispatch-contract");
const augment_index_html_1 = require("./augment-index-html");
const auto_csp_1 = require("./auto-csp");
const inline_critical_css_1 = require("./inline-critical-css");
const inline_fonts_1 = require("./inline-fonts");
const ngcm_attribute_1 = require("./ngcm-attribute");
const nonce_1 = require("./nonce");
class IndexHtmlGenerator {
    options;
    plugins;
    csrPlugins = [];
    ssrPlugins = [];
    constructor(options) {
        this.options = options;
        const extraCommonPlugins = [];
        if (options?.optimization?.fonts.inline) {
            extraCommonPlugins.push(inlineFontsPlugin(this), nonce_1.addNonce);
        }
        // Common plugins
        this.plugins = [augmentIndexHtmlPlugin(this), ...extraCommonPlugins, postTransformPlugin(this)];
        // CSR plugins
        if (options?.optimization?.styles?.inlineCritical) {
            this.csrPlugins.push(inlineCriticalCssPlugin(this, !!options.autoCsp));
        }
        this.csrPlugins.push(addNoncePlugin());
        // SSR plugins
        if (options.generateDedicatedSSRContent) {
            this.csrPlugins.push(addNgcmAttributePlugin());
            this.ssrPlugins.push(addEventDispatchContractPlugin(), addNoncePlugin());
        }
        // Auto-CSP (as the last step)
        if (options.autoCsp) {
            if (options.generateDedicatedSSRContent) {
                throw new Error('Cannot set both SSR and auto-CSP at the same time.');
            }
            this.csrPlugins.push(autoCspPlugin(options.autoCsp.unsafeEval));
        }
    }
    async process(options) {
        let content = await this.readIndex(this.options.indexPath);
        const warnings = [];
        const errors = [];
        content = await this.runPlugins(content, this.plugins, options, warnings, errors);
        const [csrContent, ssrContent] = await Promise.all([
            this.runPlugins(content, this.csrPlugins, options, warnings, errors),
            this.ssrPlugins.length
                ? this.runPlugins(content, this.ssrPlugins, options, warnings, errors)
                : undefined,
        ]);
        return {
            ssrContent,
            csrContent,
            warnings,
            errors,
        };
    }
    async runPlugins(content, plugins, options, warnings, errors) {
        for (const plugin of plugins) {
            const result = await plugin(content, options);
            if (typeof result === 'string') {
                content = result;
            }
            else {
                content = result.content;
                if (result.warnings.length) {
                    warnings.push(...result.warnings);
                }
                if (result.errors.length) {
                    errors.push(...result.errors);
                }
            }
        }
        return content;
    }
    async readAsset(path) {
        try {
            return await (0, promises_1.readFile)(path, 'utf-8');
        }
        catch {
            throw new Error(`Failed to read asset "${path}".`);
        }
    }
    async readIndex(path) {
        try {
            return new TextDecoder('utf-8').decode(await (0, promises_1.readFile)(path));
        }
        catch (cause) {
            throw new Error(`Failed to read index HTML file "${path}".`, { cause });
        }
    }
}
exports.IndexHtmlGenerator = IndexHtmlGenerator;
function augmentIndexHtmlPlugin(generator) {
    const { deployUrl, crossOrigin, sri = false, entrypoints, imageDomains } = generator.options;
    return async (html, options) => {
        const { lang, baseHref, outputPath = '', files, hints } = options;
        return (0, augment_index_html_1.augmentIndexHtml)({
            html,
            baseHref,
            deployUrl,
            crossOrigin,
            sri,
            lang,
            entrypoints,
            loadOutputFile: (filePath) => generator.readAsset((0, node_path_1.join)(outputPath, filePath)),
            imageDomains,
            files,
            hints,
        });
    };
}
function inlineFontsPlugin({ options }) {
    const inlineFontsProcessor = new inline_fonts_1.InlineFontsProcessor({
        minify: options.optimization?.styles.minify,
    });
    return async (html) => inlineFontsProcessor.process(html);
}
function inlineCriticalCssPlugin(generator, autoCsp) {
    const inlineCriticalCssProcessor = new inline_critical_css_1.InlineCriticalCssProcessor({
        minify: generator.options.optimization?.styles.minify,
        deployUrl: generator.options.deployUrl,
        readAsset: (filePath) => generator.readAsset(filePath),
        autoCsp,
    });
    return async (html, options) => inlineCriticalCssProcessor.process(html, { outputPath: options.outputPath });
}
function addNoncePlugin() {
    return (html) => (0, nonce_1.addNonce)(html);
}
function autoCspPlugin(unsafeEval) {
    return (html) => (0, auto_csp_1.autoCsp)(html, unsafeEval);
}
function postTransformPlugin({ options }) {
    return async (html) => (options.postTransform ? options.postTransform(html) : html);
}
function addEventDispatchContractPlugin() {
    return (html) => (0, add_event_dispatch_contract_1.addEventDispatchContract)(html);
}
function addNgcmAttributePlugin() {
    return (html) => (0, ngcm_attribute_1.addNgcmAttribute)(html);
}

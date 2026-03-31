"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateIndexHtml = generateIndexHtml;
const node_assert_1 = __importDefault(require("node:assert"));
const node_path_1 = __importDefault(require("node:path"));
const index_html_generator_1 = require("../../utils/index-file/index-html-generator");
const bundler_context_1 = require("./bundler-context");
/**
 * The maximum number of module preload link elements that should be added for
 * initial scripts.
 */
const MODULE_PRELOAD_MAX = 10;
async function generateIndexHtml(initialFiles, outputFiles, buildOptions, lang) {
    // Analyze metafile for initial link-based hints.
    // Skip if the internal externalPackages option is enabled since this option requires
    // dev server cooperation to properly resolve and fetch imports.
    const hints = [];
    const { indexHtmlOptions, externalPackages, optimizationOptions, crossOrigin, subresourceIntegrity, baseHref, } = buildOptions;
    (0, node_assert_1.default)(indexHtmlOptions, 'indexHtmlOptions cannot be undefined.');
    if (!externalPackages && indexHtmlOptions.preloadInitial) {
        const modulePreloads = [];
        for (const [key, value] of initialFiles) {
            if (value.entrypoint || value.serverFile) {
                // Entry points are already referenced in the HTML
                continue;
            }
            if (value.type === 'script') {
                modulePreloads.push({ url: key, mode: 'modulepreload', depth: value.depth });
            }
            else if (value.type === 'style') {
                // Provide an "as" value of "style" to ensure external URLs which may not have a
                // file extension are treated as stylesheets.
                hints.push({ url: key, mode: 'preload', as: 'style' });
            }
        }
        // Limit the number of module preloads with smallest depth given priority
        modulePreloads.sort((a, b) => a.depth - b.depth);
        hints.push(...modulePreloads.slice(0, MODULE_PRELOAD_MAX));
    }
    /** Virtual output path to support reading in-memory files. */
    const browserOutputFiles = outputFiles.filter(({ type }) => type === bundler_context_1.BuildOutputFileType.Browser);
    const virtualOutputPath = '/';
    const readAsset = async function (filePath) {
        // Remove leading directory separator
        const relativefilePath = node_path_1.default.relative(virtualOutputPath, filePath);
        const file = browserOutputFiles.find((file) => file.path === relativefilePath);
        if (file) {
            return file.text;
        }
        throw new Error(`Output file does not exist: ${relativefilePath}`);
    };
    // Create an index HTML generator that reads from the in-memory output files
    const indexHtmlGenerator = new index_html_generator_1.IndexHtmlGenerator({
        indexPath: indexHtmlOptions.input,
        entrypoints: indexHtmlOptions.insertionOrder,
        sri: subresourceIntegrity,
        optimization: optimizationOptions,
        crossOrigin: crossOrigin,
        deployUrl: buildOptions.publicPath,
        postTransform: indexHtmlOptions.transformer,
        generateDedicatedSSRContent: !!(buildOptions.ssrOptions ||
            buildOptions.prerenderOptions ||
            buildOptions.appShellOptions),
        autoCsp: buildOptions.security.autoCsp,
    });
    indexHtmlGenerator.readAsset = readAsset;
    return indexHtmlGenerator.process({
        baseHref,
        lang,
        outputPath: virtualOutputPath,
        files: [...initialFiles]
            .filter(([, file]) => !file.serverFile)
            .map(([file, record]) => ({
            name: record.name ?? '',
            file,
            extension: node_path_1.default.extname(file),
        })),
        hints,
    });
}

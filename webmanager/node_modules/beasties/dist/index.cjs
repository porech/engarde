'use strict';

const node_fs = require('node:fs');
const path = require('node:path');
const postcss = require('postcss');
const mediaParser = require('postcss-media-query-parser');
const cssSelect = require('css-select');
const cssWhat = require('css-what');
const render = require('dom-serializer');
const domhandler = require('domhandler');
const htmlparser2 = require('htmlparser2');
const pc = require('picocolors');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

const path__default = /*#__PURE__*/_interopDefaultCompat(path);
const mediaParser__default = /*#__PURE__*/_interopDefaultCompat(mediaParser);
const render__default = /*#__PURE__*/_interopDefaultCompat(render);
const pc__default = /*#__PURE__*/_interopDefaultCompat(pc);

function parseStylesheet(stylesheet) {
  return postcss.parse(stylesheet);
}
function serializeStylesheet(ast, options) {
  const cssParts = [];
  postcss.stringify(ast, (result, node, type) => {
    if (node?.type === "decl" && node.value.includes("</style>")) {
      return;
    }
    if (!options.compress) {
      cssParts.push(result);
      return;
    }
    if (node?.type === "comment")
      return;
    if (node?.type === "decl") {
      const prefix = node.prop + node.raws.between;
      cssParts.push(result.replace(prefix, prefix.trim()));
      return;
    }
    if (type === "start") {
      if (node?.type === "rule" && node.selectors) {
        if (node.selectors.length === 1) {
          cssParts.push(node.selectors[0] ?? "", "{");
        } else {
          cssParts.push(node.selectors.join(","), "{");
        }
      } else {
        cssParts.push(result.trim());
      }
      return;
    }
    if (type === "end" && result === "}" && node?.raws?.semicolon) {
      const lastItemIdx = cssParts.length - 2;
      if (lastItemIdx >= 0 && cssParts[lastItemIdx]) {
        cssParts[lastItemIdx] = cssParts[lastItemIdx].slice(0, -1);
      }
    }
    cssParts.push(result.trim());
  });
  return cssParts.join("");
}
function markOnly(predicate) {
  return (rule) => {
    const sel = "selectors" in rule ? rule.selectors : void 0;
    if (predicate(rule) === false) {
      rule.$$remove = true;
    }
    if ("selectors" in rule) {
      rule.$$markedSelectors = rule.selectors;
      rule.selectors = sel;
    }
    if (rule._other) {
      rule._other.$$markedSelectors = rule._other.selectors;
    }
  };
}
function applyMarkedSelectors(rule) {
  if (rule.$$markedSelectors) {
    rule.selectors = rule.$$markedSelectors;
  }
  if (rule._other) {
    applyMarkedSelectors(rule._other);
  }
}
function walkStyleRules(node, iterator) {
  if (!("nodes" in node)) {
    return;
  }
  node.nodes = node.nodes?.filter((rule) => {
    if (hasNestedRules(rule)) {
      walkStyleRules(rule, iterator);
    }
    rule._other = void 0;
    rule.filterSelectors = filterSelectors;
    return iterator(rule) !== false;
  });
}
function walkStyleRulesWithReverseMirror(node, node2, iterator) {
  if (!node2)
    return walkStyleRules(node, iterator);
  [node.nodes, node2.nodes] = splitFilter(
    node.nodes,
    node2.nodes,
    (rule, index, _rules, rules2) => {
      const rule2 = rules2?.[index];
      if (hasNestedRules(rule)) {
        walkStyleRulesWithReverseMirror(rule, rule2, iterator);
      }
      rule._other = rule2;
      rule.filterSelectors = filterSelectors;
      return iterator(rule) !== false;
    }
  );
}
function hasNestedRules(rule) {
  return "nodes" in rule && !!rule.nodes?.length && (!("name" in rule) || rule.name !== "keyframes" && rule.name !== "-webkit-keyframes") && rule.nodes.some((n) => n.type === "rule" || n.type === "atrule");
}
function splitFilter(a, b, predicate) {
  const aOut = [];
  const bOut = [];
  for (let index = 0; index < a.length; index++) {
    const item = a[index];
    if (predicate(item, index, a, b)) {
      aOut.push(item);
    } else {
      bOut.push(item);
    }
  }
  return [aOut, bOut];
}
function filterSelectors(predicate) {
  if (this._other) {
    const [a, b] = splitFilter(
      this.selectors,
      this._other.selectors,
      predicate
    );
    this.selectors = a;
    this._other.selectors = b;
  } else {
    this.selectors = this.selectors.filter(predicate);
  }
}
const MEDIA_TYPES = /* @__PURE__ */ new Set(["all", "print", "screen", "speech"]);
const MEDIA_KEYWORDS = /* @__PURE__ */ new Set(["and", "not", ","]);
const MEDIA_FEATURES = new Set(
  [
    "width",
    "aspect-ratio",
    "color",
    "color-index",
    "grid",
    "height",
    "monochrome",
    "orientation",
    "resolution",
    "scan"
  ].flatMap((feature) => [feature, `min-${feature}`, `max-${feature}`])
);
function validateMediaType(node) {
  const { type: nodeType, value: nodeValue } = node;
  if (nodeType === "media-type") {
    return MEDIA_TYPES.has(nodeValue);
  } else if (nodeType === "keyword") {
    return MEDIA_KEYWORDS.has(nodeValue);
  } else if (nodeType === "media-feature") {
    return MEDIA_FEATURES.has(nodeValue);
  }
}
function validateMediaQuery(query) {
  const mediaParserFn = "default" in mediaParser__default ? mediaParser__default.default : mediaParser__default;
  const mediaTree = mediaParserFn(query);
  const nodeTypes = /* @__PURE__ */ new Set(["media-type", "keyword", "media-feature"]);
  const stack = [mediaTree];
  while (stack.length > 0) {
    const node = stack.pop();
    if (nodeTypes.has(node.type) && !validateMediaType(node)) {
      return false;
    }
    if (node.nodes) {
      stack.push(...node.nodes);
    }
  }
  return true;
}

let classCache = null;
let idCache = null;
function buildCache(container) {
  classCache = /* @__PURE__ */ new Set();
  idCache = /* @__PURE__ */ new Set();
  const queue = [container];
  while (queue.length) {
    const node = queue.shift();
    if (node.hasAttribute?.("class")) {
      const classList = node.getAttribute("class").trim().split(" ");
      classList.forEach((cls) => {
        classCache.add(cls);
      });
    }
    if (node.hasAttribute?.("id")) {
      const id = node.getAttribute("id").trim();
      idCache.add(id);
    }
    if ("children" in node) {
      queue.push(...node.children.filter((child) => child.type === "tag"));
    }
  }
}
function createDocument(html) {
  const document = htmlparser2.parseDocument(html, { decodeEntities: false });
  extendDocument(document);
  extendElement(domhandler.Element.prototype);
  let beastiesContainer = document.querySelector("[data-beasties-container]");
  if (!beastiesContainer) {
    document.documentElement?.setAttribute("data-beasties-container", "");
    beastiesContainer = document.documentElement || document;
  }
  document.beastiesContainer = beastiesContainer;
  buildCache(beastiesContainer);
  return document;
}
function serializeDocument(document) {
  return render__default(document, { decodeEntities: false });
}
let extended = false;
function extendElement(element) {
  if (extended) {
    return;
  }
  extended = true;
  Object.defineProperties(element, {
    nodeName: {
      get() {
        return this.tagName.toUpperCase();
      }
    },
    id: {
      get() {
        return this.getAttribute("id");
      },
      set(value) {
        this.setAttribute("id", value);
      }
    },
    className: {
      get() {
        return this.getAttribute("class");
      },
      set(value) {
        this.setAttribute("class", value);
      }
    },
    insertBefore: {
      value(child, referenceNode) {
        if (!referenceNode)
          return this.appendChild(child);
        htmlparser2.DomUtils.prepend(referenceNode, child);
        return child;
      }
    },
    appendChild: {
      value(child) {
        htmlparser2.DomUtils.appendChild(this, child);
        return child;
      }
    },
    removeChild: {
      value(child) {
        htmlparser2.DomUtils.removeElement(child);
      }
    },
    remove: {
      value() {
        htmlparser2.DomUtils.removeElement(this);
      }
    },
    textContent: {
      get() {
        return htmlparser2.DomUtils.getText(this);
      },
      set(text) {
        this.children = [];
        htmlparser2.DomUtils.appendChild(this, new domhandler.Text(text));
      }
    },
    setAttribute: {
      value(name, value) {
        if (this.attribs == null)
          this.attribs = {};
        if (value == null)
          value = "";
        this.attribs[name] = value;
      }
    },
    removeAttribute: {
      value(name) {
        if (this.attribs != null) {
          delete this.attribs[name];
        }
      }
    },
    getAttribute: {
      value(name) {
        return this.attribs != null && this.attribs[name];
      }
    },
    hasAttribute: {
      value(name) {
        return this.attribs != null && this.attribs[name] != null;
      }
    },
    getAttributeNode: {
      value(name) {
        const value = this.getAttribute(name);
        if (value != null)
          return { specified: true, value };
      }
    },
    exists: {
      value(sel) {
        return cachedQuerySelector(sel, this);
      }
    },
    querySelector: {
      value(sel) {
        return cssSelect.selectOne(sel, this);
      }
    },
    querySelectorAll: {
      value(sel) {
        return cssSelect.selectAll(sel, this);
      }
    }
  });
}
function extendDocument(document) {
  Object.defineProperties(document, {
    // document is just an Element in htmlparser2, giving it a nodeType of ELEMENT_NODE.
    // TODO: verify if these are needed for css-select
    nodeType: {
      get() {
        return 9;
      }
    },
    contentType: {
      get() {
        return "text/html";
      }
    },
    nodeName: {
      get() {
        return "#document";
      }
    },
    documentElement: {
      get() {
        return this.children.find(
          (child) => "tagName" in child && String(child.tagName).toLowerCase() === "html"
        );
      }
    },
    head: {
      get() {
        return this.querySelector("head");
      }
    },
    body: {
      get() {
        return this.querySelector("body");
      }
    },
    createElement: {
      value(name) {
        return new domhandler.Element(name, {});
      }
    },
    createTextNode: {
      value(text) {
        return new domhandler.Text(text);
      }
    },
    exists: {
      value(sel) {
        return cachedQuerySelector(sel, this);
      }
    },
    querySelector: {
      value(sel) {
        return cssSelect.selectOne(sel, this);
      }
    },
    querySelectorAll: {
      value(sel) {
        if (sel === ":root") {
          return this;
        }
        return cssSelect.selectAll(sel, this);
      }
    }
  });
}
const selectorTokensCache = /* @__PURE__ */ new Map();
function cachedQuerySelector(sel, node) {
  let selectorTokens = selectorTokensCache.get(sel);
  if (selectorTokens === void 0) {
    selectorTokens = parseRelevantSelectors(sel);
    selectorTokensCache.set(sel, selectorTokens);
  }
  if (selectorTokens) {
    for (const token of selectorTokens) {
      if (token.name === "class") {
        return classCache.has(token.value);
      }
      if (token.name === "id") {
        return idCache.has(token.value);
      }
    }
  }
  return !!cssSelect.selectOne(sel, node);
}
function parseRelevantSelectors(sel) {
  const tokens = cssWhat.parse(sel);
  const relevantTokens = [];
  for (let i = 0; i < tokens.length; i++) {
    const tokenGroup = tokens[i];
    if (tokenGroup?.length !== 1) {
      continue;
    }
    const token = tokenGroup[0];
    if (token?.type === "attribute" && (token.name === "class" || token.name === "id")) {
      relevantTokens.push(token);
    }
  }
  return relevantTokens.length > 0 ? relevantTokens : null;
}

const LOG_LEVELS = ["trace", "debug", "info", "warn", "error", "silent"];
const defaultLogger = {
  trace(msg) {
    console.trace(msg);
  },
  debug(msg) {
    console.debug(msg);
  },
  warn(msg) {
    console.warn(pc__default.yellow(msg));
  },
  error(msg) {
    console.error(pc__default.bold(pc__default.red(msg)));
  },
  info(msg) {
    console.info(pc__default.bold(pc__default.blue(msg)));
  },
  silent() {
  }
};
function createLogger(logLevel) {
  const logLevelIdx = LOG_LEVELS.indexOf(logLevel);
  return LOG_LEVELS.reduce((logger, type, index) => {
    if (index >= logLevelIdx) {
      logger[type] = defaultLogger[type];
    } else {
      logger[type] = defaultLogger.silent;
    }
    return logger;
  }, {});
}
function isSubpath(basePath, currentPath) {
  return !path__default.relative(basePath, currentPath).startsWith("..");
}

const removePseudoClassesAndElementsPattern = /(?<!\\)::?[a-z-]+(?:\(.+\))?/gi;
const implicitUniversalPattern = /([>+~])\s*(?!\1)([>+~])/g;
const emptyCombinatorPattern = /([>+~])\s*(?=\1|$)/g;
const removeTrailingCommasPattern = /\(\s*,|,\s*\)/g;
class Beasties {
  #selectorCache = /* @__PURE__ */ new Map();
  options;
  logger;
  fs;
  constructor(options = {}) {
    this.options = Object.assign({
      logLevel: "info",
      path: "",
      publicPath: "",
      reduceInlineStyles: true,
      pruneSource: false,
      additionalStylesheets: [],
      allowRules: []
    }, options);
    this.logger = this.options.logger || createLogger(this.options.logLevel);
  }
  /**
   * Read the contents of a file from the specified filesystem or disk
   */
  readFile(filename) {
    const fs = this.fs;
    return new Promise((resolve, reject) => {
      const callback = (err, data) => {
        if (err)
          reject(err);
        else resolve(data.toString());
      };
      if (fs && fs.readFile) {
        fs.readFile(filename, callback);
      } else {
        node_fs.readFile(filename, "utf-8", callback);
      }
    });
  }
  /**
   * Write content to a file
   */
  writeFile(filename, data) {
    const fs = this.fs;
    return new Promise((resolve, reject) => {
      const callback = (err) => {
        if (err)
          reject(err);
        else resolve();
      };
      if (fs && fs.writeFile) {
        fs.writeFile(filename, data, callback);
      } else {
        node_fs.writeFile(filename, data, callback);
      }
    });
  }
  /**
   * Apply critical CSS processing to the html
   */
  async process(html) {
    const start = Date.now();
    const document = createDocument(html);
    if (this.options.additionalStylesheets.length > 0) {
      await this.embedAdditionalStylesheet(document);
    }
    if (this.options.external !== false) {
      const externalSheets = [...document.querySelectorAll('link[rel="stylesheet"]')];
      await Promise.all(
        externalSheets.map((link) => this.embedLinkedStylesheet(link, document))
      );
    }
    const styles = this.getAffectedStyleTags(document);
    for (const style of styles) {
      this.processStyle(style, document);
    }
    if (this.options.mergeStylesheets !== false && styles.length !== 0) {
      this.mergeStylesheets(document);
    }
    const output = serializeDocument(document);
    const end = Date.now();
    this.logger.info?.(`Time ${end - start}ms`);
    return output;
  }
  /**
   * Get the style tags that need processing
   */
  getAffectedStyleTags(document) {
    const styles = [...document.querySelectorAll("style")];
    if (this.options.reduceInlineStyles === false) {
      return styles.filter((style) => style.$$external);
    }
    return styles;
  }
  mergeStylesheets(document) {
    const styles = this.getAffectedStyleTags(document);
    if (styles.length === 0) {
      this.logger.warn?.(
        "Merging inline stylesheets into a single <style> tag skipped, no inline stylesheets to merge"
      );
      return;
    }
    const first = styles[0];
    let sheet = first.textContent;
    for (let i = 1; i < styles.length; i++) {
      const node = styles[i];
      sheet += node.textContent;
      node.remove();
    }
    first.textContent = sheet;
  }
  /**
   * Given href, find the corresponding CSS asset
   */
  async getCssAsset(href, _style) {
    const outputPath = this.options.path;
    const publicPath = this.options.publicPath;
    let normalizedPath = href.replace(/^\//, "");
    const pathPrefix = `${(publicPath || "").replace(/(^\/|\/$)/g, "")}/`;
    if (normalizedPath.startsWith(pathPrefix)) {
      normalizedPath = normalizedPath.substring(pathPrefix.length).replace(/^\//, "");
    }
    if (/^https?:\/\//.test(normalizedPath) || href.startsWith("//")) {
      return void 0;
    }
    const filename = path__default.resolve(outputPath, normalizedPath);
    if (!isSubpath(outputPath, filename)) {
      return void 0;
    }
    let sheet;
    try {
      sheet = await this.readFile(filename);
    } catch {
      this.logger.warn?.(`Unable to locate stylesheet: ${filename}`);
    }
    return sheet;
  }
  checkInlineThreshold(link, style, sheet) {
    if (this.options.inlineThreshold && sheet.length < this.options.inlineThreshold) {
      const href = style.$$name;
      style.$$reduce = false;
      this.logger.info?.(
        `\x1B[32mInlined all of ${href} (${sheet.length} was below the threshold of ${this.options.inlineThreshold})\x1B[39m`
      );
      link.remove();
      return true;
    }
    return false;
  }
  /**
   * Inline the stylesheets from options.additionalStylesheets (assuming it passes `options.filter`)
   */
  async embedAdditionalStylesheet(document) {
    const styleSheetsIncluded = [];
    const sources = await Promise.all(
      this.options.additionalStylesheets.map((cssFile) => {
        if (styleSheetsIncluded.includes(cssFile)) {
          return [];
        }
        styleSheetsIncluded.push(cssFile);
        const style = document.createElement("style");
        style.$$external = true;
        return this.getCssAsset(cssFile, style).then((sheet) => [sheet, style]);
      })
    );
    for (const [sheet, style] of sources) {
      if (sheet) {
        style.textContent = sheet;
        document.head.appendChild(style);
      }
    }
  }
  /**
   * Inline the target stylesheet referred to by a <link rel="stylesheet"> (assuming it passes `options.filter`)
   */
  async embedLinkedStylesheet(link, document) {
    const href = link.getAttribute("href");
    if (!href?.endsWith(".css")) {
      return void 0;
    }
    const style = document.createElement("style");
    style.$$external = true;
    const sheet = await this.getCssAsset(href, style);
    if (!sheet) {
      return;
    }
    style.textContent = sheet;
    style.$$name = href;
    style.$$links = [link];
    link.parentNode?.insertBefore(style, link);
    if (this.checkInlineThreshold(link, style, sheet)) {
      return;
    }
    let media = link.getAttribute("media");
    if (media && !validateMediaQuery(media)) {
      media = void 0;
    }
    const preloadMode = this.options.preload;
    let cssLoaderPreamble = "function $loadcss(u,m,l){(l=document.createElement('link')).rel='stylesheet';l.href=u;document.head.appendChild(l)}";
    const lazy = preloadMode === "js-lazy";
    if (lazy) {
      cssLoaderPreamble = cssLoaderPreamble.replace(
        "l.href",
        "l.media='print';l.onload=function(){l.media=m};l.href"
      );
    }
    if (preloadMode === false)
      return;
    let noscriptFallback = false;
    let updateLinkToPreload = false;
    const noscriptLink = link.cloneNode(false);
    if (preloadMode === "body") {
      document.body.appendChild(link);
    } else {
      if (preloadMode === "js" || preloadMode === "js-lazy") {
        const script = document.createElement("script");
        script.setAttribute("data-href", href);
        script.setAttribute("data-media", media || "all");
        const js = `${cssLoaderPreamble}$loadcss(document.currentScript.dataset.href,document.currentScript.dataset.media)`;
        script.textContent = js;
        link.parentNode.insertBefore(script, link.nextSibling);
        style.$$links.push(script);
        cssLoaderPreamble = "";
        noscriptFallback = true;
        updateLinkToPreload = true;
      } else if (preloadMode === "media") {
        link.setAttribute("media", "print");
        link.setAttribute("onload", `this.media='${media || "all"}'`);
        noscriptFallback = true;
      } else if (preloadMode === "swap-high") {
        link.setAttribute("rel", "alternate stylesheet preload");
        link.setAttribute("title", "styles");
        link.setAttribute("onload", `this.title='';this.rel='stylesheet'`);
        noscriptFallback = true;
      } else if (preloadMode === "swap-low") {
        link.setAttribute("rel", "alternate stylesheet");
        link.setAttribute("title", "styles");
        link.setAttribute("onload", `this.title='';this.rel='stylesheet'`);
        noscriptFallback = true;
      } else if (preloadMode === "swap") {
        link.setAttribute("onload", "this.rel='stylesheet'");
        updateLinkToPreload = true;
        noscriptFallback = true;
      } else {
        const bodyLink = link.cloneNode(false);
        bodyLink.removeAttribute("id");
        document.body.appendChild(bodyLink);
        style.$$links.push(bodyLink);
        updateLinkToPreload = true;
      }
    }
    if (this.options.noscriptFallback !== false && noscriptFallback && !href.includes("</noscript>")) {
      const noscript = document.createElement("noscript");
      noscriptLink.removeAttribute("id");
      noscript.appendChild(noscriptLink);
      link.parentNode.insertBefore(noscript, link.nextSibling);
      style.$$links.push(noscript);
    }
    if (updateLinkToPreload) {
      link.setAttribute("rel", "preload");
      link.setAttribute("as", "style");
    }
  }
  /**
   * Prune the source CSS files
   */
  pruneSource(style, before, sheetInverse) {
    const minSize = this.options.minimumExternalSize;
    const name = style.$$name;
    const shouldInline = minSize && sheetInverse.length < minSize;
    if (shouldInline) {
      this.logger.info?.(
        `\x1B[32mInlined all of ${name} (non-critical external stylesheet would have been ${sheetInverse.length}b, which was below the threshold of ${minSize})\x1B[39m`
      );
    }
    if (shouldInline || !sheetInverse) {
      style.textContent = before;
      if (style.$$links) {
        for (const link of style.$$links) {
          const parent = link.parentNode;
          parent?.removeChild(link);
        }
      }
    }
    return !!shouldInline;
  }
  /**
   * Parse the stylesheet within a <style> element, then reduce it to contain only rules used by the document.
   */
  processStyle(style, document) {
    if (style.$$reduce === false)
      return;
    const name = style.$$name ? style.$$name.replace(/^\//, "") : "inline CSS";
    const options = this.options;
    const beastiesContainer = document.beastiesContainer;
    let keyframesMode = options.keyframes ?? "critical";
    if (keyframesMode === true)
      keyframesMode = "all";
    if (keyframesMode === false)
      keyframesMode = "none";
    let sheet = style.textContent;
    const before = sheet;
    if (!sheet)
      return;
    const ast = parseStylesheet(sheet);
    const astInverse = options.pruneSource ? parseStylesheet(sheet) : null;
    let criticalFonts = "";
    const failedSelectors = [];
    const criticalKeyframeNames = /* @__PURE__ */ new Set();
    let includeNext = false;
    let includeAll = false;
    let excludeNext = false;
    let excludeAll = false;
    const shouldPreloadFonts = options.fonts === true || options.preloadFonts === true;
    const shouldInlineFonts = options.fonts !== false && options.inlineFonts === true;
    walkStyleRules(
      ast,
      markOnly((rule) => {
        if (rule.type === "comment") {
          const beastiesComment = rule.text.match(/^(?<!! )beasties:(.*)/);
          const command = beastiesComment && beastiesComment[1];
          if (command) {
            switch (command) {
              case "include":
                includeNext = true;
                break;
              case "exclude":
                excludeNext = true;
                break;
              case "include start":
                includeAll = true;
                break;
              case "include end":
                includeAll = false;
                break;
              case "exclude start":
                excludeAll = true;
                break;
              case "exclude end":
                excludeAll = false;
                break;
            }
          }
        }
        if (rule.type === "rule") {
          if (includeNext) {
            includeNext = false;
            return true;
          }
          if (excludeNext) {
            excludeNext = false;
            return false;
          }
          if (includeAll) {
            return true;
          }
          if (excludeAll) {
            return false;
          }
          rule.filterSelectors?.((sel) => {
            const isAllowedRule = options.allowRules.some((exp) => {
              if (exp instanceof RegExp) {
                return exp.test(sel);
              }
              return exp === sel;
            });
            if (isAllowedRule)
              return true;
            if (sel === ":root" || sel === "html" || sel === "body" || sel[0] === ":" && /^::?(?:before|after)$/.test(sel)) {
              return true;
            }
            sel = this.normalizeCssSelector(sel);
            if (!sel)
              return false;
            try {
              return beastiesContainer.exists(sel);
            } catch (e) {
              failedSelectors.push(`${sel} -> ${e.message || e.toString()}`);
              return false;
            }
          });
          if (!rule.selector) {
            return false;
          }
          if (rule.nodes) {
            for (const decl of rule.nodes) {
              if (!("prop" in decl)) {
                continue;
              }
              if (shouldInlineFonts && /\bfont(?:-family)?\b/i.test(decl.prop)) {
                criticalFonts += ` ${decl.value}`;
              }
              if (decl.prop === "animation" || decl.prop === "animation-name") {
                for (const name2 of decl.value.split(/\s+/)) {
                  const nameTrimmed = name2.trim();
                  if (nameTrimmed)
                    criticalKeyframeNames.add(nameTrimmed);
                }
              }
            }
          }
        }
        if (rule.type === "atrule" && (rule.name === "font-face" || rule.name === "layer"))
          return;
        const hasRemainingRules = ("nodes" in rule && rule.nodes?.some((rule2) => !rule2.$$remove)) ?? true;
        return hasRemainingRules;
      })
    );
    if (failedSelectors.length !== 0) {
      this.logger.warn?.(
        `${failedSelectors.length} rules skipped due to selector errors:
  ${failedSelectors.join("\n  ")}`
      );
    }
    const preloadedFonts = /* @__PURE__ */ new Set();
    walkStyleRulesWithReverseMirror(ast, astInverse, (rule) => {
      if (rule.$$remove === true)
        return false;
      if ("selectors" in rule) {
        applyMarkedSelectors(rule);
      }
      if (rule.type === "atrule" && rule.name === "keyframes") {
        if (keyframesMode === "none")
          return false;
        if (keyframesMode === "all")
          return true;
        return criticalKeyframeNames.has(rule.params);
      }
      if (rule.type === "atrule" && rule.name === "font-face") {
        let family, src;
        if (rule.nodes) {
          for (const decl of rule.nodes) {
            if (!("prop" in decl)) {
              continue;
            }
            if (decl.prop === "src") {
              src = (decl.value.match(/url\s*\(\s*(['"]?)(.+?)\1\s*\)/) || [])[2];
            } else if (decl.prop === "font-family") {
              family = decl.value;
            }
          }
          if (src && shouldPreloadFonts && !preloadedFonts.has(src)) {
            preloadedFonts.add(src);
            const preload = document.createElement("link");
            preload.setAttribute("rel", "preload");
            preload.setAttribute("as", "font");
            preload.setAttribute("crossorigin", "anonymous");
            preload.setAttribute("href", src.trim());
            document.head.appendChild(preload);
          }
        }
        if (!shouldInlineFonts || !family || !src || !criticalFonts.includes(family)) {
          return false;
        }
      }
    });
    sheet = serializeStylesheet(ast, {
      compress: this.options.compress !== false
    });
    if (sheet.trim().length === 0) {
      if (style.parentNode) {
        style.remove();
      }
      return;
    }
    let afterText = "";
    let styleInlinedCompletely = false;
    if (options.pruneSource) {
      const sheetInverse = serializeStylesheet(astInverse, {
        compress: this.options.compress !== false
      });
      styleInlinedCompletely = this.pruneSource(style, before, sheetInverse);
      if (styleInlinedCompletely) {
        const percent2 = sheetInverse.length / before.length * 100;
        afterText = `, reducing non-inlined size ${percent2 | 0}% to ${formatSize(sheetInverse.length)}`;
      }
      const cssFilePath = path__default.resolve(this.options.path, name);
      this.writeFile(cssFilePath, sheetInverse).then(() => this.logger.info?.(`${name} was successfully updated`)).catch((err) => this.logger.error?.(err));
    }
    if (!styleInlinedCompletely) {
      style.textContent = sheet;
    }
    const percent = sheet.length / before.length * 100 | 0;
    this.logger.info?.(
      `\x1B[32mInlined ${formatSize(sheet.length)} (${percent}% of original ${formatSize(before.length)}) of ${name}${afterText}.\x1B[39m`
    );
  }
  normalizeCssSelector(sel) {
    let normalizedSelector = this.#selectorCache.get(sel);
    if (normalizedSelector !== void 0) {
      return normalizedSelector;
    }
    normalizedSelector = sel.replace(removePseudoClassesAndElementsPattern, "").replace(removeTrailingCommasPattern, (match) => match.includes("(") ? "(" : ")").replace(implicitUniversalPattern, "$1 * $2").replace(emptyCombinatorPattern, "$1 *").trim();
    this.#selectorCache.set(sel, normalizedSelector);
    return normalizedSelector;
  }
}
function formatSize(size) {
  if (size <= 0) {
    return "0 bytes";
  }
  const abbreviations = ["bytes", "kB", "MB", "GB"];
  const index = Math.floor(Math.log(size) / Math.log(1024));
  const roundedSize = size / 1024 ** index;
  const fractionDigits = index === 0 ? 0 : 2;
  return `${roundedSize.toFixed(fractionDigits)} ${abbreviations[index]}`;
}

module.exports = Beasties;

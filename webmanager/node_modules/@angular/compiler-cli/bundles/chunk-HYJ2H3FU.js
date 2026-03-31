
      import {createRequire as __cjsCompatRequire} from 'module';
      const require = __cjsCompatRequire(import.meta.url);
    

// packages/compiler-cli/src/ngtsc/sourcemaps/src/source_file.js
import { decode, encode } from "@jridgewell/sourcemap-codec";
import mapHelpers from "convert-source-map";

// packages/compiler-cli/src/ngtsc/sourcemaps/src/segment_marker.js
function compareSegments(a, b) {
  return a.position - b.position;
}
function offsetSegment(startOfLinePositions, marker, offset) {
  if (offset === 0) {
    return marker;
  }
  let line = marker.line;
  const position = marker.position + offset;
  while (line < startOfLinePositions.length - 1 && startOfLinePositions[line + 1] <= position) {
    line++;
  }
  while (line > 0 && startOfLinePositions[line] > position) {
    line--;
  }
  const column = position - startOfLinePositions[line];
  return { line, column, position, next: void 0 };
}

// packages/compiler-cli/src/ngtsc/sourcemaps/src/source_file.js
function removeSourceMapComments(contents) {
  return mapHelpers.removeMapFileComments(mapHelpers.removeComments(contents)).replace(/\n\n$/, "\n");
}
var SourceFile = class {
  sourcePath;
  contents;
  rawMap;
  sources;
  fs;
  /**
   * The parsed mappings that have been flattened so that any intermediate source mappings have been
   * flattened.
   *
   * The result is that any source file mentioned in the flattened mappings have no source map (are
   * pure original source files).
   */
  flattenedMappings;
  startOfLinePositions;
  constructor(sourcePath, contents, rawMap, sources, fs) {
    this.sourcePath = sourcePath;
    this.contents = contents;
    this.rawMap = rawMap;
    this.sources = sources;
    this.fs = fs;
    this.contents = removeSourceMapComments(contents);
    this.startOfLinePositions = computeStartOfLinePositions(this.contents);
    this.flattenedMappings = this.flattenMappings();
  }
  /**
   * Render the raw source map generated from the flattened mappings.
   */
  renderFlattenedSourceMap() {
    const sources = new IndexedMap();
    const names = new IndexedSet();
    const mappings = [];
    const sourcePathDir = this.fs.dirname(this.sourcePath);
    const relativeSourcePathCache = new Cache((input) => this.fs.relative(sourcePathDir, input));
    for (const mapping of this.flattenedMappings) {
      const sourceIndex = sources.set(relativeSourcePathCache.get(mapping.originalSource.sourcePath), mapping.originalSource.contents);
      const mappingArray = [
        mapping.generatedSegment.column,
        sourceIndex,
        mapping.originalSegment.line,
        mapping.originalSegment.column
      ];
      if (mapping.name !== void 0) {
        const nameIndex = names.add(mapping.name);
        mappingArray.push(nameIndex);
      }
      const line = mapping.generatedSegment.line;
      while (line >= mappings.length) {
        mappings.push([]);
      }
      mappings[line].push(mappingArray);
    }
    const sourceMap = {
      version: 3,
      file: this.fs.relative(sourcePathDir, this.sourcePath),
      sources: sources.keys,
      names: names.values,
      mappings: encode(mappings),
      sourcesContent: sources.values
    };
    return sourceMap;
  }
  /**
   * Find the original mapped location for the given `line` and `column` in the generated file.
   *
   * First we search for a mapping whose generated segment is at or directly before the given
   * location. Then we compute the offset between the given location and the matching generated
   * segment. Finally we apply this offset to the original source segment to get the desired
   * original location.
   */
  getOriginalLocation(line, column) {
    if (this.flattenedMappings.length === 0) {
      return null;
    }
    let position;
    if (line < this.startOfLinePositions.length) {
      position = this.startOfLinePositions[line] + column;
    } else {
      position = this.contents.length;
    }
    const locationSegment = { line, column, position, next: void 0 };
    let mappingIndex = findLastMappingIndexBefore(this.flattenedMappings, locationSegment, false, 0);
    if (mappingIndex < 0) {
      mappingIndex = 0;
    }
    const { originalSegment, originalSource, generatedSegment } = this.flattenedMappings[mappingIndex];
    const offset = locationSegment.position - generatedSegment.position;
    const offsetOriginalSegment = offsetSegment(originalSource.startOfLinePositions, originalSegment, offset);
    return {
      file: originalSource.sourcePath,
      line: offsetOriginalSegment.line,
      column: offsetOriginalSegment.column
    };
  }
  /**
   * Flatten the parsed mappings for this source file, so that all the mappings are to pure original
   * source files with no transitive source maps.
   */
  flattenMappings() {
    const mappings = parseMappings(this.rawMap && this.rawMap.map, this.sources, this.startOfLinePositions);
    ensureOriginalSegmentLinks(mappings);
    const flattenedMappings = [];
    for (let mappingIndex = 0; mappingIndex < mappings.length; mappingIndex++) {
      const aToBmapping = mappings[mappingIndex];
      const bSource = aToBmapping.originalSource;
      if (bSource.flattenedMappings.length === 0) {
        flattenedMappings.push(aToBmapping);
        continue;
      }
      const incomingStart = aToBmapping.originalSegment;
      const incomingEnd = incomingStart.next;
      let outgoingStartIndex = findLastMappingIndexBefore(bSource.flattenedMappings, incomingStart, false, 0);
      if (outgoingStartIndex < 0) {
        outgoingStartIndex = 0;
      }
      const outgoingEndIndex = incomingEnd !== void 0 ? findLastMappingIndexBefore(bSource.flattenedMappings, incomingEnd, true, outgoingStartIndex) : bSource.flattenedMappings.length - 1;
      for (let bToCmappingIndex = outgoingStartIndex; bToCmappingIndex <= outgoingEndIndex; bToCmappingIndex++) {
        const bToCmapping = bSource.flattenedMappings[bToCmappingIndex];
        flattenedMappings.push(mergeMappings(this, aToBmapping, bToCmapping));
      }
    }
    return flattenedMappings;
  }
};
function findLastMappingIndexBefore(mappings, marker, exclusive, lowerIndex) {
  let upperIndex = mappings.length - 1;
  const test = exclusive ? -1 : 0;
  if (compareSegments(mappings[lowerIndex].generatedSegment, marker) > test) {
    return -1;
  }
  let matchingIndex = -1;
  while (lowerIndex <= upperIndex) {
    const index = upperIndex + lowerIndex >> 1;
    if (compareSegments(mappings[index].generatedSegment, marker) <= test) {
      matchingIndex = index;
      lowerIndex = index + 1;
    } else {
      upperIndex = index - 1;
    }
  }
  return matchingIndex;
}
function mergeMappings(generatedSource, ab, bc) {
  const name = bc.name || ab.name;
  const diff = compareSegments(bc.generatedSegment, ab.originalSegment);
  if (diff > 0) {
    return {
      name,
      generatedSegment: offsetSegment(generatedSource.startOfLinePositions, ab.generatedSegment, diff),
      originalSource: bc.originalSource,
      originalSegment: bc.originalSegment
    };
  } else {
    return {
      name,
      generatedSegment: ab.generatedSegment,
      originalSource: bc.originalSource,
      originalSegment: offsetSegment(bc.originalSource.startOfLinePositions, bc.originalSegment, -diff)
    };
  }
}
function parseMappings(rawMap, sources, generatedSourceStartOfLinePositions) {
  if (rawMap === null) {
    return [];
  }
  const rawMappings = decode(rawMap.mappings);
  if (rawMappings === null) {
    return [];
  }
  const mappings = [];
  for (let generatedLine = 0; generatedLine < rawMappings.length; generatedLine++) {
    const generatedLineMappings = rawMappings[generatedLine];
    for (const rawMapping of generatedLineMappings) {
      if (rawMapping.length >= 4) {
        const originalSource = sources[rawMapping[1]];
        if (originalSource === null || originalSource === void 0) {
          continue;
        }
        const generatedColumn = rawMapping[0];
        const name = rawMapping.length === 5 ? rawMap.names[rawMapping[4]] : void 0;
        const line = rawMapping[2];
        const column = rawMapping[3];
        const generatedSegment = {
          line: generatedLine,
          column: generatedColumn,
          position: generatedSourceStartOfLinePositions[generatedLine] + generatedColumn,
          next: void 0
        };
        const originalSegment = {
          line,
          column,
          position: originalSource.startOfLinePositions[line] + column,
          next: void 0
        };
        mappings.push({ name, generatedSegment, originalSegment, originalSource });
      }
    }
  }
  return mappings;
}
function extractOriginalSegments(mappings) {
  const originalSegments = /* @__PURE__ */ new Map();
  for (const mapping of mappings) {
    const originalSource = mapping.originalSource;
    if (!originalSegments.has(originalSource)) {
      originalSegments.set(originalSource, []);
    }
    const segments = originalSegments.get(originalSource);
    segments.push(mapping.originalSegment);
  }
  originalSegments.forEach((segmentMarkers) => segmentMarkers.sort(compareSegments));
  return originalSegments;
}
function ensureOriginalSegmentLinks(mappings) {
  const segmentsBySource = extractOriginalSegments(mappings);
  segmentsBySource.forEach((markers) => {
    for (let i = 0; i < markers.length - 1; i++) {
      markers[i].next = markers[i + 1];
    }
  });
}
function computeStartOfLinePositions(str) {
  const NEWLINE_MARKER_OFFSET = 1;
  const lineLengths = computeLineLengths(str);
  const startPositions = [0];
  for (let i = 0; i < lineLengths.length - 1; i++) {
    startPositions.push(startPositions[i] + lineLengths[i] + NEWLINE_MARKER_OFFSET);
  }
  return startPositions;
}
function computeLineLengths(str) {
  return str.split(/\n/).map((s) => s.length);
}
var IndexedMap = class {
  map = /* @__PURE__ */ new Map();
  /**
   * An array of keys added to this map.
   *
   * This array is guaranteed to be in the order of the first time the key was added to the map.
   */
  keys = [];
  /**
   * An array of values added to this map.
   *
   * This array is guaranteed to be in the order of the first time the associated key was added to
   * the map.
   */
  values = [];
  /**
   * Associate the `value` with the `key` and return the index of the key in the collection.
   *
   * If the `key` already exists then the `value` is not set and the index of that `key` is
   * returned; otherwise the `key` and `value` are stored and the index of the new `key` is
   * returned.
   *
   * @param key the key to associated with the `value`.
   * @param value the value to associated with the `key`.
   * @returns the index of the `key` in the `keys` array.
   */
  set(key, value) {
    if (this.map.has(key)) {
      return this.map.get(key);
    }
    const index = this.values.push(value) - 1;
    this.keys.push(key);
    this.map.set(key, index);
    return index;
  }
};
var IndexedSet = class {
  map = /* @__PURE__ */ new Map();
  /**
   * An array of values added to this set.
   * This array is guaranteed to be in the order of the first time the value was added to the set.
   */
  values = [];
  /**
   * Add the `value` to the `values` array, if it doesn't already exist; returning the index of the
   * `value` in the `values` array.
   *
   * If the `value` already exists then the index of that `value` is returned, otherwise the new
   * `value` is stored and the new index returned.
   *
   * @param value the value to add to the set.
   * @returns the index of the `value` in the `values` array.
   */
  add(value) {
    if (this.map.has(value)) {
      return this.map.get(value);
    }
    const index = this.values.push(value) - 1;
    this.map.set(value, index);
    return index;
  }
};
var Cache = class {
  computeFn;
  map = /* @__PURE__ */ new Map();
  constructor(computeFn) {
    this.computeFn = computeFn;
  }
  get(input) {
    if (!this.map.has(input)) {
      this.map.set(input, this.computeFn(input));
    }
    return this.map.get(input);
  }
};

// packages/compiler-cli/src/ngtsc/sourcemaps/src/source_file_loader.js
import mapHelpers2 from "convert-source-map";

// packages/compiler-cli/src/ngtsc/sourcemaps/src/content_origin.js
var ContentOrigin;
(function(ContentOrigin2) {
  ContentOrigin2[ContentOrigin2["Provided"] = 0] = "Provided";
  ContentOrigin2[ContentOrigin2["Inline"] = 1] = "Inline";
  ContentOrigin2[ContentOrigin2["FileSystem"] = 2] = "FileSystem";
})(ContentOrigin || (ContentOrigin = {}));

// packages/compiler-cli/src/ngtsc/sourcemaps/src/source_file_loader.js
var SCHEME_MATCHER = /^([a-z][a-z0-9.-]*):\/\//i;
var SourceFileLoader = class {
  fs;
  logger;
  schemeMap;
  currentPaths = [];
  constructor(fs, logger, schemeMap) {
    this.fs = fs;
    this.logger = logger;
    this.schemeMap = schemeMap;
  }
  loadSourceFile(sourcePath, contents = null, mapAndPath = null) {
    const contentsOrigin = contents !== null ? ContentOrigin.Provided : ContentOrigin.FileSystem;
    const sourceMapInfo = mapAndPath && {
      origin: ContentOrigin.Provided,
      ...mapAndPath
    };
    return this.loadSourceFileInternal(sourcePath, contents, contentsOrigin, sourceMapInfo);
  }
  /**
   * The overload used internally to load source files referenced in a source-map.
   *
   * In this case there is no guarantee that it will return a non-null SourceMap.
   *
   * @param sourcePath The path to the source file to load.
   * @param contents The contents of the source file to load, if provided inline. If `null`,
   *     the contents will be read from the file at the `sourcePath`.
   * @param sourceOrigin Describes where the source content came from.
   * @param sourceMapInfo The raw contents and path of the source-map file. If `null` the
   *     source-map will be computed from the contents of the source file, either inline or loaded
   *     from the file-system.
   *
   * @returns a SourceFile if the content for one was provided or was able to be loaded from disk,
   * `null` otherwise.
   */
  loadSourceFileInternal(sourcePath, contents, sourceOrigin, sourceMapInfo) {
    const previousPaths = this.currentPaths.slice();
    try {
      if (contents === null) {
        if (!this.fs.exists(sourcePath)) {
          return null;
        }
        contents = this.readSourceFile(sourcePath);
      }
      if (sourceMapInfo === null) {
        sourceMapInfo = this.loadSourceMap(sourcePath, contents, sourceOrigin);
      }
      let sources = [];
      if (sourceMapInfo !== null) {
        const basePath = sourceMapInfo.mapPath || sourcePath;
        sources = this.processSources(basePath, sourceMapInfo);
      }
      return new SourceFile(sourcePath, contents, sourceMapInfo, sources, this.fs);
    } catch (e) {
      this.logger.warn(`Unable to fully load ${sourcePath} for source-map flattening: ${e.message}`);
      return null;
    } finally {
      this.currentPaths = previousPaths;
    }
  }
  /**
   * Find the source map associated with the source file whose `sourcePath` and `contents` are
   * provided.
   *
   * Source maps can be inline, as part of a base64 encoded comment, or external as a separate file
   * whose path is indicated in a comment or implied from the name of the source file itself.
   *
   * @param sourcePath the path to the source file.
   * @param sourceContents the contents of the source file.
   * @param sourceOrigin where the content of the source file came from.
   * @returns the parsed contents and path of the source-map, if loading was successful, null
   *     otherwise.
   */
  loadSourceMap(sourcePath, sourceContents, sourceOrigin) {
    const lastLine = this.getLastNonEmptyLine(sourceContents);
    const inline = mapHelpers2.commentRegex.exec(lastLine);
    if (inline !== null) {
      return {
        map: mapHelpers2.fromComment(inline.pop()).sourcemap,
        mapPath: null,
        origin: ContentOrigin.Inline
      };
    }
    if (sourceOrigin === ContentOrigin.Inline) {
      return null;
    }
    const external = mapHelpers2.mapFileCommentRegex.exec(lastLine);
    if (external) {
      try {
        const fileName = external[1] || external[2];
        const externalMapPath = this.fs.resolve(this.fs.dirname(sourcePath), fileName);
        return {
          map: this.readRawSourceMap(externalMapPath),
          mapPath: externalMapPath,
          origin: ContentOrigin.FileSystem
        };
      } catch (e) {
        this.logger.warn(`Unable to fully load ${sourcePath} for source-map flattening: ${e.message}`);
        return null;
      }
    }
    const impliedMapPath = this.fs.resolve(sourcePath + ".map");
    if (this.fs.exists(impliedMapPath)) {
      return {
        map: this.readRawSourceMap(impliedMapPath),
        mapPath: impliedMapPath,
        origin: ContentOrigin.FileSystem
      };
    }
    return null;
  }
  /**
   * Iterate over each of the "sources" for this source file's source map, recursively loading each
   * source file and its associated source map.
   */
  processSources(basePath, { map, origin: sourceMapOrigin }) {
    const sourceRoot = this.fs.resolve(this.fs.dirname(basePath), this.replaceSchemeWithPath(map.sourceRoot || ""));
    return map.sources.map((source, index) => {
      const path = this.fs.resolve(sourceRoot, this.replaceSchemeWithPath(source));
      const content = map.sourcesContent && map.sourcesContent[index] || null;
      const sourceOrigin = content !== null && sourceMapOrigin !== ContentOrigin.Provided ? ContentOrigin.Inline : ContentOrigin.FileSystem;
      return this.loadSourceFileInternal(path, content, sourceOrigin, null);
    });
  }
  /**
   * Load the contents of the source file from disk.
   *
   * @param sourcePath The path to the source file.
   */
  readSourceFile(sourcePath) {
    this.trackPath(sourcePath);
    return this.fs.readFile(sourcePath);
  }
  /**
   * Load the source map from the file at `mapPath`, parsing its JSON contents into a `RawSourceMap`
   * object.
   *
   * @param mapPath The path to the source-map file.
   */
  readRawSourceMap(mapPath) {
    this.trackPath(mapPath);
    return JSON.parse(this.fs.readFile(mapPath));
  }
  /**
   * Track source file paths if we have loaded them from disk so that we don't get into an infinite
   * recursion.
   */
  trackPath(path) {
    if (this.currentPaths.includes(path)) {
      throw new Error(`Circular source file mapping dependency: ${this.currentPaths.join(" -> ")} -> ${path}`);
    }
    this.currentPaths.push(path);
  }
  getLastNonEmptyLine(contents) {
    let trailingWhitespaceIndex = contents.length - 1;
    while (trailingWhitespaceIndex > 0 && (contents[trailingWhitespaceIndex] === "\n" || contents[trailingWhitespaceIndex] === "\r")) {
      trailingWhitespaceIndex--;
    }
    let lastRealLineIndex = contents.lastIndexOf("\n", trailingWhitespaceIndex - 1);
    if (lastRealLineIndex === -1) {
      lastRealLineIndex = 0;
    }
    return contents.slice(lastRealLineIndex + 1);
  }
  /**
   * Replace any matched URL schemes with their corresponding path held in the schemeMap.
   *
   * Some build tools replace real file paths with scheme prefixed paths - e.g. `webpack://`.
   * We use the `schemeMap` passed to this class to convert such paths to "real" file paths.
   * In some cases, this is not possible, since the file was actually synthesized by the build tool.
   * But the end result is better than prefixing the sourceRoot in front of the scheme.
   */
  replaceSchemeWithPath(path) {
    return path.replace(SCHEME_MATCHER, (_, scheme) => this.schemeMap[scheme.toLowerCase()] || "");
  }
};

export {
  SourceFile,
  SourceFileLoader
};
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */


      import {createRequire as __cjsCompatRequire} from 'module';
      const require = __cjsCompatRequire(import.meta.url);
    

// packages/compiler-cli/src/ngtsc/file_system/src/invalid_file_system.js
var InvalidFileSystem = class {
  exists(path) {
    throw makeError();
  }
  readFile(path) {
    throw makeError();
  }
  readFileBuffer(path) {
    throw makeError();
  }
  writeFile(path, data, exclusive) {
    throw makeError();
  }
  removeFile(path) {
    throw makeError();
  }
  symlink(target, path) {
    throw makeError();
  }
  readdir(path) {
    throw makeError();
  }
  lstat(path) {
    throw makeError();
  }
  stat(path) {
    throw makeError();
  }
  pwd() {
    throw makeError();
  }
  chdir(path) {
    throw makeError();
  }
  extname(path) {
    throw makeError();
  }
  copyFile(from, to) {
    throw makeError();
  }
  moveFile(from, to) {
    throw makeError();
  }
  ensureDir(path) {
    throw makeError();
  }
  removeDeep(path) {
    throw makeError();
  }
  isCaseSensitive() {
    throw makeError();
  }
  resolve(...paths) {
    throw makeError();
  }
  dirname(file) {
    throw makeError();
  }
  join(basePath, ...paths) {
    throw makeError();
  }
  isRoot(path) {
    throw makeError();
  }
  isRooted(path) {
    throw makeError();
  }
  relative(from, to) {
    throw makeError();
  }
  basename(filePath, extension) {
    throw makeError();
  }
  realpath(filePath) {
    throw makeError();
  }
  getDefaultLibLocation() {
    throw makeError();
  }
  normalize(path) {
    throw makeError();
  }
};
function makeError() {
  return new Error("FileSystem has not been configured. Please call `setFileSystem()` before calling this method.");
}

// packages/compiler-cli/src/ngtsc/file_system/src/util.js
var TS_DTS_JS_EXTENSION = /(?:\.d)?\.ts$|\.js$/;
function normalizeSeparators(path) {
  return path.replace(/\\/g, "/");
}
function stripExtension(path) {
  return path.replace(TS_DTS_JS_EXTENSION, "");
}
function getSourceFileOrError(program, fileName) {
  const sf = program.getSourceFile(fileName);
  if (sf === void 0) {
    throw new Error(`Program does not contain "${fileName}" - available files are ${program.getSourceFiles().map((sf2) => sf2.fileName).join(", ")}`);
  }
  return sf;
}

// packages/compiler-cli/src/ngtsc/file_system/src/helpers.js
var fs = new InvalidFileSystem();
function getFileSystem() {
  return fs;
}
function setFileSystem(fileSystem) {
  fs = fileSystem;
}
function absoluteFrom(path) {
  if (!fs.isRooted(path)) {
    throw new Error(`Internal Error: absoluteFrom(${path}): path is not absolute`);
  }
  return fs.resolve(path);
}
var ABSOLUTE_PATH = Symbol("AbsolutePath");
function absoluteFromSourceFile(sf) {
  const sfWithPatch = sf;
  if (sfWithPatch[ABSOLUTE_PATH] === void 0) {
    sfWithPatch[ABSOLUTE_PATH] = fs.resolve(sfWithPatch.fileName);
  }
  return sfWithPatch[ABSOLUTE_PATH];
}
function relativeFrom(path) {
  const normalized = normalizeSeparators(path);
  if (fs.isRooted(normalized)) {
    throw new Error(`Internal Error: relativeFrom(${path}): path is not relative`);
  }
  return normalized;
}
function dirname(file) {
  return fs.dirname(file);
}
function join(basePath, ...paths) {
  return fs.join(basePath, ...paths);
}
function resolve(basePath, ...paths) {
  return fs.resolve(basePath, ...paths);
}
function isRoot(path) {
  return fs.isRoot(path);
}
function isRooted(path) {
  return fs.isRooted(path);
}
function relative(from, to) {
  return fs.relative(from, to);
}
function basename(filePath, extension) {
  return fs.basename(filePath, extension);
}
function isLocalRelativePath(relativePath) {
  return !isRooted(relativePath) && !relativePath.startsWith("..");
}
function toRelativeImport(relativePath) {
  return isLocalRelativePath(relativePath) ? `./${relativePath}` : relativePath;
}

// packages/compiler-cli/src/ngtsc/file_system/src/compiler_host.js
import * as os from "os";
import ts from "typescript";
var NgtscCompilerHost = class {
  fs;
  options;
  constructor(fs2, options = {}) {
    this.fs = fs2;
    this.options = options;
  }
  getSourceFile(fileName, languageVersion) {
    const text = this.readFile(fileName);
    return text !== void 0 ? ts.createSourceFile(fileName, text, languageVersion, true) : void 0;
  }
  getDefaultLibFileName(options) {
    return this.fs.join(this.getDefaultLibLocation(), ts.getDefaultLibFileName(options));
  }
  getDefaultLibLocation() {
    return this.fs.getDefaultLibLocation();
  }
  writeFile(fileName, data, writeByteOrderMark, onError, sourceFiles) {
    const path = absoluteFrom(fileName);
    this.fs.ensureDir(this.fs.dirname(path));
    this.fs.writeFile(path, data);
  }
  getCurrentDirectory() {
    return this.fs.pwd();
  }
  getCanonicalFileName(fileName) {
    return this.useCaseSensitiveFileNames() ? fileName : fileName.toLowerCase();
  }
  useCaseSensitiveFileNames() {
    return this.fs.isCaseSensitive();
  }
  getNewLine() {
    switch (this.options.newLine) {
      case ts.NewLineKind.CarriageReturnLineFeed:
        return "\r\n";
      case ts.NewLineKind.LineFeed:
        return "\n";
      default:
        return os.EOL;
    }
  }
  fileExists(fileName) {
    const absPath = this.fs.resolve(fileName);
    return this.fs.exists(absPath) && this.fs.stat(absPath).isFile();
  }
  readFile(fileName) {
    const absPath = this.fs.resolve(fileName);
    if (!this.fileExists(absPath)) {
      return void 0;
    }
    return this.fs.readFile(absPath);
  }
  realpath(path) {
    return this.fs.realpath(this.fs.resolve(path));
  }
};

// packages/compiler-cli/src/ngtsc/file_system/src/logical.js
var LogicalProjectPath = {
  /**
   * Get the relative path between two `LogicalProjectPath`s.
   *
   * This will return a `PathSegment` which would be a valid module specifier to use in `from` when
   * importing from `to`.
   */
  relativePathBetween: function(from, to) {
    const relativePath = relative(dirname(resolve(from)), resolve(to));
    return toRelativeImport(relativePath);
  }
};
var LogicalFileSystem = class {
  compilerHost;
  /**
   * The root directories of the project, sorted with the longest path first.
   */
  rootDirs;
  /**
   * The same root directories as `rootDirs` but with each one converted to its
   * canonical form for matching in case-insensitive file-systems.
   */
  canonicalRootDirs;
  /**
   * A cache of file paths to project paths, because computation of these paths is slightly
   * expensive.
   */
  cache = /* @__PURE__ */ new Map();
  constructor(rootDirs, compilerHost) {
    this.compilerHost = compilerHost;
    this.rootDirs = rootDirs.concat([]).sort((a, b) => b.length - a.length);
    this.canonicalRootDirs = this.rootDirs.map((dir) => this.compilerHost.getCanonicalFileName(dir));
  }
  /**
   * Get the logical path in the project of a `ts.SourceFile`.
   *
   * This method is provided as a convenient alternative to calling
   * `logicalPathOfFile(absoluteFromSourceFile(sf))`.
   */
  logicalPathOfSf(sf) {
    return this.logicalPathOfFile(absoluteFromSourceFile(sf));
  }
  /**
   * Get the logical path in the project of a source file.
   *
   * @returns A `LogicalProjectPath` to the source file, or `null` if the source file is not in any
   * of the TS project's root directories.
   */
  logicalPathOfFile(physicalFile) {
    if (!this.cache.has(physicalFile)) {
      const canonicalFilePath = this.compilerHost.getCanonicalFileName(physicalFile);
      let logicalFile = null;
      for (let i = 0; i < this.rootDirs.length; i++) {
        const rootDir = this.rootDirs[i];
        const canonicalRootDir = this.canonicalRootDirs[i];
        if (isWithinBasePath(canonicalRootDir, canonicalFilePath)) {
          logicalFile = this.createLogicalProjectPath(physicalFile, rootDir);
          if (logicalFile.indexOf("/node_modules/") !== -1) {
            logicalFile = null;
          } else {
            break;
          }
        }
      }
      this.cache.set(physicalFile, logicalFile);
    }
    return this.cache.get(physicalFile);
  }
  createLogicalProjectPath(file, rootDir) {
    const logicalPath = stripExtension(file.slice(rootDir.length));
    return logicalPath.startsWith("/") ? logicalPath : "/" + logicalPath;
  }
};
function isWithinBasePath(base, path) {
  return isLocalRelativePath(relative(base, path));
}

// packages/compiler-cli/src/ngtsc/file_system/src/ts_read_directory.js
import ts2 from "typescript";
function createFileSystemTsReadDirectoryFn(fs2) {
  if (ts2.matchFiles === void 0) {
    throw Error("Unable to read directory in configured file system. This means that TypeScript changed its file matching internals.\n\nPlease consider downgrading your TypeScript version, and report an issue in the Angular framework repository.");
  }
  const matchFilesFn = ts2.matchFiles.bind(ts2);
  return (rootDir, extensions, excludes, includes, depth) => {
    const directoryExists = (p) => {
      const resolvedPath = fs2.resolve(p);
      return fs2.exists(resolvedPath) && fs2.stat(resolvedPath).isDirectory();
    };
    return matchFilesFn(rootDir, extensions, excludes, includes, fs2.isCaseSensitive(), fs2.pwd(), depth, (p) => {
      const resolvedPath = fs2.resolve(p);
      if (!directoryExists(resolvedPath)) {
        return { directories: [], files: [] };
      }
      const children = fs2.readdir(resolvedPath);
      const files = [];
      const directories = [];
      for (const child of children) {
        if (fs2.stat(fs2.join(resolvedPath, child))?.isDirectory()) {
          directories.push(child);
        } else {
          files.push(child);
        }
      }
      return { files, directories };
    }, (p) => fs2.resolve(p), (p) => directoryExists(p));
  };
}

export {
  InvalidFileSystem,
  stripExtension,
  getSourceFileOrError,
  getFileSystem,
  setFileSystem,
  absoluteFrom,
  absoluteFromSourceFile,
  relativeFrom,
  dirname,
  join,
  resolve,
  isRoot,
  isRooted,
  relative,
  basename,
  isLocalRelativePath,
  toRelativeImport,
  NgtscCompilerHost,
  LogicalProjectPath,
  LogicalFileSystem,
  createFileSystemTsReadDirectoryFn
};
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */

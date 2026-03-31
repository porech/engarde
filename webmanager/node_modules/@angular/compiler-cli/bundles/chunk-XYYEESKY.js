
      import {createRequire as __cjsCompatRequire} from 'module';
      const require = __cjsCompatRequire(import.meta.url);
    
import {
  __require
} from "./chunk-G7GFT6BU.js";

// packages/compiler-cli/src/ngtsc/file_system/src/node_js_file_system.js
import fs from "fs";
import { createRequire } from "module";
import * as p from "path";
import * as url from "url";
var NodeJSPathManipulation = class {
  pwd() {
    return this.normalize(process.cwd());
  }
  chdir(dir) {
    process.chdir(dir);
  }
  resolve(...paths) {
    return this.normalize(p.resolve(...paths));
  }
  dirname(file) {
    return this.normalize(p.dirname(file));
  }
  join(basePath, ...paths) {
    return this.normalize(p.join(basePath, ...paths));
  }
  isRoot(path) {
    return this.dirname(path) === this.normalize(path);
  }
  isRooted(path) {
    return p.isAbsolute(path);
  }
  relative(from, to) {
    return this.normalize(p.relative(from, to));
  }
  basename(filePath, extension) {
    return p.basename(filePath, extension);
  }
  extname(path) {
    return p.extname(path);
  }
  normalize(path) {
    return path.replace(/\\/g, "/");
  }
};
var isCommonJS = typeof __filename !== "undefined";
var currentFileUrl = isCommonJS ? null : import.meta.url;
var currentFileName = isCommonJS ? __filename : url.fileURLToPath?.(currentFileUrl) ?? null;
var NodeJSReadonlyFileSystem = class extends NodeJSPathManipulation {
  _caseSensitive = void 0;
  isCaseSensitive() {
    if (this._caseSensitive === void 0) {
      this._caseSensitive = currentFileName !== null ? !fs.existsSync(this.normalize(toggleCase(currentFileName))) : true;
    }
    return this._caseSensitive;
  }
  exists(path) {
    return fs.existsSync(path);
  }
  readFile(path) {
    return fs.readFileSync(path, "utf8");
  }
  readFileBuffer(path) {
    return fs.readFileSync(path);
  }
  readdir(path) {
    return fs.readdirSync(path);
  }
  lstat(path) {
    return fs.lstatSync(path);
  }
  stat(path) {
    return fs.statSync(path);
  }
  realpath(path) {
    return this.resolve(fs.realpathSync(path));
  }
  getDefaultLibLocation() {
    const requireFn = isCommonJS ? __require : createRequire(currentFileUrl);
    return this.resolve(requireFn.resolve("typescript"), "..");
  }
};
var NodeJSFileSystem = class extends NodeJSReadonlyFileSystem {
  writeFile(path, data, exclusive = false) {
    fs.writeFileSync(path, data, exclusive ? { flag: "wx" } : void 0);
  }
  removeFile(path) {
    fs.unlinkSync(path);
  }
  symlink(target, path) {
    fs.symlinkSync(target, path);
  }
  copyFile(from, to) {
    fs.copyFileSync(from, to);
  }
  moveFile(from, to) {
    fs.renameSync(from, to);
  }
  ensureDir(path) {
    fs.mkdirSync(path, { recursive: true });
  }
  removeDeep(path) {
    fs.rmdirSync(path, { recursive: true });
  }
};
function toggleCase(str) {
  return str.replace(/\w/g, (ch) => ch.toUpperCase() === ch ? ch.toLowerCase() : ch.toUpperCase());
}

export {
  NodeJSFileSystem
};
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */

"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSystemHost = void 0;
exports.createFileSystemCompilerHost = createFileSystemCompilerHost;
exports.createFormatDiagnosticHost = createFormatDiagnosticHost;
const ts = require("typescript");
/**
 * Implementation of a TypeScript parse config host that relies fully on
 * a given virtual file system.
 */
class FileSystemHost {
    constructor(_fileSystem) {
        this._fileSystem = _fileSystem;
        this.useCaseSensitiveFileNames = ts.sys.useCaseSensitiveFileNames;
    }
    fileExists(path) {
        return this._fileSystem.fileExists(this._fileSystem.resolve(path));
    }
    readFile(path) {
        const content = this._fileSystem.read(this._fileSystem.resolve(path));
        if (content === null) {
            return undefined;
        }
        // Strip BOM as otherwise TSC methods (e.g. "getWidth") will return an offset which
        // which breaks the CLI UpdateRecorder. https://github.com/angular/angular/pull/30719
        return content.replace(/^\uFEFF/, '');
    }
    readDirectory(rootDir, extensions, excludes, includes, depth) {
        if (ts.matchFiles === undefined) {
            throw Error('Unable to read directory in virtual file system host. This means that ' +
                'TypeScript changed its file matching internals.\n\nPlease consider downgrading your ' +
                'TypeScript version, and report an issue in the Angular Components repository.');
        }
        return ts.matchFiles(rootDir, extensions, extensions, includes, this.useCaseSensitiveFileNames, '/', depth, p => this._getFileSystemEntries(p), p => this._fileSystem.resolve(p), p => this._fileSystem.directoryExists(this._fileSystem.resolve(p)));
    }
    _getFileSystemEntries(path) {
        return this._fileSystem.readDirectory(this._fileSystem.resolve(path));
    }
}
exports.FileSystemHost = FileSystemHost;
/**
 * Creates a TypeScript compiler host that fully relies fully on the given
 * virtual file system. i.e. no interactions with the working directory.
 */
function createFileSystemCompilerHost(options, fileSystem) {
    const host = ts.createCompilerHost(options, true);
    const virtualHost = new FileSystemHost(fileSystem);
    host.readFile = virtualHost.readFile.bind(virtualHost);
    host.readDirectory = virtualHost.readDirectory.bind(virtualHost);
    host.fileExists = virtualHost.fileExists.bind(virtualHost);
    host.directoryExists = dirPath => fileSystem.directoryExists(fileSystem.resolve(dirPath));
    host.getCurrentDirectory = () => '/';
    host.getCanonicalFileName = p => fileSystem.resolve(p);
    return host;
}
/** Creates a format diagnostic host that works with the given file system. */
function createFormatDiagnosticHost(fileSystem) {
    return {
        getCanonicalFileName: p => fileSystem.resolve(p),
        getCurrentDirectory: () => '/',
        getNewLine: () => '\n',
    };
}
//# sourceMappingURL=virtual-host.js.map
import ts from 'typescript';
export declare function relativePathBetween(from: string, to: string): string | null;
export declare function normalizeSeparators(path: string): string;
/**
 * Attempts to generate a project-relative path for a file.
 * @param fileName Absolute path to the file.
 * @param rootDirs Root directories of the project.
 * @param compilerHost Host used to resolve file names.
 * @returns
 */
export declare function getProjectRelativePath(fileName: string, rootDirs: readonly string[], compilerHost: Pick<ts.CompilerHost, 'getCanonicalFileName'>): string | null;

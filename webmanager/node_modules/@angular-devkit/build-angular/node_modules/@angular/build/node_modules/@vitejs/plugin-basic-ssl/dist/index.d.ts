import { Plugin } from 'vite';

interface Options {
    certDir: string;
    domains: string[];
    name: string;
}
declare function viteBasicSslPlugin(options?: Partial<Options>): Plugin;
declare function getCertificate(cacheDir: string, name?: string, domains?: string[]): Promise<string>;

export = viteBasicSslPlugin;
export { getCertificate };

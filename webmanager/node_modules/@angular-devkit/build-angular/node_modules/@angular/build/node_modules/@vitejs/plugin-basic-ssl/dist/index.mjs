import path from 'node:path';
import { promises } from 'node:fs';

const defaultCacheDir = "node_modules/.vite";
function viteBasicSslPlugin(options) {
  return {
    name: "vite:basic-ssl",
    async configResolved(config) {
      const certificate = await getCertificate(
        options?.certDir ?? (config.cacheDir ?? defaultCacheDir) + "/basic-ssl",
        options?.name,
        options?.domains
      );
      const https = () => ({ cert: certificate, key: certificate });
      if (config.server.https === void 0 || !!config.server.https) {
        config.server.https = Object.assign({}, config.server.https, https());
      }
      if (config.preview.https === void 0 || !!config.preview.https) {
        config.preview.https = Object.assign({}, config.preview.https, https());
      }
    }
  };
}
async function getCertificate(cacheDir, name, domains) {
  const cachePath = path.join(cacheDir, "_cert.pem");
  try {
    const [stat, content] = await Promise.all([
      promises.stat(cachePath),
      promises.readFile(cachePath, "utf8")
    ]);
    if (Date.now() - stat.ctime.valueOf() > 30 * 24 * 60 * 60 * 1e3) {
      throw new Error("cache is outdated.");
    }
    return content;
  } catch {
    const content = (await import('./chunks/certificate.mjs')).createCertificate(
      name,
      domains
    );
    promises.mkdir(cacheDir, { recursive: true }).then(() => promises.writeFile(cachePath, content)).catch(() => {
    });
    return content;
  }
}

export { viteBasicSslPlugin as default, getCertificate };

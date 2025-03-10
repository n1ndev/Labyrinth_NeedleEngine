import { defineConfig } from 'vite';
import viteCompression from 'vite-plugin-compression';
import react from '@vitejs/plugin-react'
import mkcert from'vite-plugin-mkcert'

const isCIEnvironment = process.env.CI !== undefined;

export default defineConfig(async (command) => {

    const { needlePlugins, useGzip, loadConfig } = await import("@needle-tools/engine/plugins/vite/index.js");
    const needleConfig = await loadConfig();

    return {
        base: "./",
        assetsInclude: ['*'],
        plugins: [
            react(),
            mkcert(),
            useGzip(needleConfig) && !isCIEnvironment ? viteCompression({ deleteOriginFile: true }) : null,
            needlePlugins(command, needleConfig),
        ],
        server: {
            https: true,
            proxy: { // workaround: specifying a proxy skips HTTP2 which is currently problematic in Vite since it causes session memory timeouts.
                'https://localhost:3000': 'https://localhost:3000'
            },
            strictPort: true,
            port: 3000,
        },
        build: {
            outDir: "./dist",
            emptyOutDir: true,
        }
    }
});
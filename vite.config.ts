import {defineConfig} from 'vite';
import {resolve} from 'path';
import {fileURLToPath} from 'url';
import dts from 'vite-plugin-dts';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
    plugins: [
        dts({
            bundleTypes: true,
        })
    ],
    build: {
        lib: {
            entry: resolve(__dirname, 'src/Wee.ts'),
            name: 'weeJS',
            fileName: (format) => `wee.${format}.js`,
            formats: ['es', 'iife'],
        },
        sourcemap: true,
        emptyOutDir: true,
    },
});
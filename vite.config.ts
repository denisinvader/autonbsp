import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
    plugins: [
        dts({
            tsconfigPath: resolve(__dirname, 'tsconfig.app.json'),
            exclude: '**/*.test.*',
        }),
    ],
    build: {
        lib: {
            entry: [
                resolve(__dirname, 'src/index.ts'),
                resolve(__dirname, 'src/presets/en.ts'),
                resolve(__dirname, 'src/presets/ru.ts'),
            ],
            formats: ['es'],
            name: 'autonbsp',
        },
        rollupOptions: {
            output: {
                preserveModules: true,
            },
        },
    },
});

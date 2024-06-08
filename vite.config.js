import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

const port = 5173;
const origin = `${process.env.DDEV_PRIMARY_URL}:${port}`;

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css'],
            refresh: true,
        }),
        react(),
    ],

    optimizeDeps: {
        force: true,
        esbuildOptions: {
          loader: {
            '.js': 'jsx',
          },
        },
      },
      server: {
        // respond to all network requests:
        host: '0.0.0.0',
        port: port,
        strictPort: true,
        // Defines the origin of the generated asset URLs during development
        origin: origin
      },
});

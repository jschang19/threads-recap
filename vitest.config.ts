import { defineConfig } from 'vitest/config';
import { defineVitestProject } from '@nuxt/test-utils/config';
import path from 'node:path';

export default defineConfig({
  test: {
    projects: [
      {
        resolve: {
          alias: {
            '~': path.resolve(__dirname, './app'),
            '@': path.resolve(__dirname, './app'),
          },
        },
        test: {
          name: 'unit',
          include: ['test/{e2e,unit}/**/*.{test,spec}.ts'],
          environment: 'node',
        },
      },
      await defineVitestProject({
        test: {
          name: 'nuxt',
          include: ['test/nuxt/**/*.{test,spec}.ts'],
          environment: 'nuxt',
        },
      }),
    ],
  },
});

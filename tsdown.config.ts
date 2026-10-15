import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  platform: 'node',
  target: 'node20',
  // with "type": "module", emit .js instead of .mjs
  fixedExtension: false,
  clean: true,
  minify: false,
  sourcemap: true,
  // CLI: keep shebang; auto-set package.json bin from it
  exports: {
    bin: true,
  },
});

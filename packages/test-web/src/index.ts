import FastGlob from 'fast-glob';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { UserConfigExport } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const IS_SUB = process.env['APP_TYPE'] === 'sub';

const PRJ_DIR = process.cwd();
const SRC_DIR = resolve(PRJ_DIR, 'src');

let ROOT_DIR = PRJ_DIR;
const hasYarnLockFile = (dir: string) => existsSync(resolve(dir, 'yarn.lock'));
while (!hasYarnLockFile(ROOT_DIR)) ROOT_DIR = dirname(ROOT_DIR);

const entries = FastGlob.sync(resolve(SRC_DIR, '*.html'), { stats: false });

export const config = {
  appType: 'mpa',
  build: {
    emptyOutDir: true,
    modulePreload: false,
    outDir: resolve(PRJ_DIR, 'dist'),
    rollupOptions: { input: entries },
    sourcemap: true,
    target: 'esnext',
  },
  plugins: [tsconfigPaths()],
  publicDir: resolve(ROOT_DIR, 'public'),
  root: SRC_DIR,
  server: {
    host: '0.0.0.0',
    open: !IS_SUB,
    port: IS_SUB ? 3001 : Number(process.env['PORT'] || '3000'),
    strictPort: true,
  },
} satisfies UserConfigExport;

export default config;

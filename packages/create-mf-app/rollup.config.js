import typescript from '@rollup/plugin-typescript';
import nodeResolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import pkg from './package.json' assert { type: 'json' };

const external = [...Object.keys(pkg.dependencies)];

export default {
  input: 'src/cli.ts',
  output: {
    dir: 'dist',
    format: 'es',
  },
  external,
  plugins: [nodeResolve(), typescript(), terser()],
};

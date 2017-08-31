import uglify from 'rollup-plugin-uglify';
import { minify } from 'uglify-es';

export default {
  input: 'src/js/Main.js',
  output: {
    file: 'dist/app.js',
    format: 'iife'
  },
  sourcemap: 'inline',
  plugins: [
    (process.env.NODE_ENV === 'production' && uglify({}, minify))
  ]
};

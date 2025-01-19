import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const version = process.env.VERSION || '0.1';

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/sui-helper.user.js',
    format: 'iife',
    banner: `// ==UserScript==
// @name         Sui
// @namespace    http://tampermonkey.net/
// @version      ${version}
// @description  try to take over the world!
// @author       You
// @match        https://www.sui.com/tally/new.do
// @icon         https://www.google.com/s2/favicons?sz=64&domain=undefined.
// @grant        GM.setValue
// @grant        GM.getValue
// @require      tampermonkey://vendor/jquery.js
// @require      https://www.unpkg.com/papaparse@5.4.1/papaparse.min.js
// ==/UserScript==`,
  },
  plugins: [
    typescript(),
    resolve(),
    commonjs()
  ]
}; 
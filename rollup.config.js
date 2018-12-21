import typescript from 'rollup-plugin-typescript2';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

const filenames = ['facebook', 'instagram', 'tumblr', 'twitter', 'vine', 'google/plus', 'index'];

export default {
    input: `src/index.ts`,
    output: {
        format: 'esm',
        file: `dist/index.js`
    },
    plugins: [
        typescript(),
        resolve({
            browser: true
        }),
        commonjs()
    ]
};

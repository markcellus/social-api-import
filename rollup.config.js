import typescript from 'rollup-plugin-typescript2';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

const filenames = ['facebook', 'instagram', 'tumblr', 'twitter', 'vine', 'index'];

const exports = filenames.map(name => {
    return {
        input: `src/${name}.ts`,
        output: {
            format: 'esm',
            file: `dist/${name}.js`
        },
        plugins: [resolve(), typescript(), commonjs()]
    };
});

export default exports;

import fs from 'fs'
import vue from 'rollup-plugin-vue'
import dsv from 'rollup-plugin-dsv'
import copy from 'rollup-plugin-copy'
import scss from 'rollup-plugin-scss'
import json from 'rollup-plugin-json'
import serve from 'rollup-plugin-serve'
import alias from 'rollup-plugin-alias'
import buble from 'rollup-plugin-buble'
import uglify from 'rollup-plugin-uglify'
import cssnano from 'cssnano'
import postcss from 'postcss'
import replace from 'rollup-plugin-replace'
import builtins from 'rollup-plugin-node-builtins';
import commonjs from 'rollup-plugin-commonjs'
import livereload from 'rollup-plugin-livereload'
import nodeResolve from 'rollup-plugin-node-resolve'
import nodeGlobals from 'rollup-plugin-node-globals'
import autoprefixer from 'autoprefixer'

if (fs.existsSync('./dist/main.js.map')) fs.unlinkSync('./dist/main.js.map')

let plugins = [
    builtins(), 
    json({
         // include: 'node_modules/entities/**',
         // exclude: 'node_modules/**'
    }),
    alias({ vue$: 'vue/dist/vue.common.js' }),
    dsv({
        exclude: 'node_modules/**'
    }),
    vue({ autoStyles: false, styleToImports: true }),
    scss({
        output: true,
        output: 'dist/styles.css',
        processor: css => postcss([autoprefixer/*, cssnano*/]).process(css, { from: undefined, zindex: false }).then(result => result.css)
    }),
    buble({
        objectAssign: 'Object.assign',
        exclude: '**/*.json'
    }),
    nodeResolve({
        jsnext: true,
        main: true,
        browser: true,
        exclude: '**/*.json'
    }),
    commonjs({exclude: '**/*.json'}),
    nodeGlobals(),
    copy({ 'src/index.html': 'dist/index.html' }),
    process.env.NODE_ENV === 'prod' && replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
    process.env.NODE_ENV === 'prod' && uglify(),
    process.env.NODE_ENV !== 'prod' && process.env.PORT !== undefined && livereload(),
    process.env.PORT !== undefined && serve({
        contentBase: './dist/',
        port: process.env.PORT,
        open: true
    })
]

let config = {
    input: './src/main.js',
    output: {
        file: './dist/main.js',
        format: 'iife',
        sourcemap: true //process.env.NODE_ENV !== 'prod'
    },
    plugins: plugins
}

export default config
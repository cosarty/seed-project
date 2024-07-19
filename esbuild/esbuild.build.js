const esbuild = require('esbuild');
const sassPlugin = require('esbuild-plugin-sass');
const { htmlPlugin } = require('@craftamap/esbuild-plugin-html');
const inlineImagePlugin = require('esbuild-plugin-inline-image');
const entryPoints = ['src/main.tsx'];
const path = require('path');
const { clean } = require("esbuild-plugin-clean");
const aliasPlugin = require('esbuild-plugin-path-alias');
const options = {
  // 入口文件
  entryPoints,
  // 启动打包
  bundle: true,
  // 输出目录文件夹
  outdir: 'dist/',
  metafile: true,
  sourcemap: true,
  assetNames: "assets/[name]-[hash]",
  // 对 js、cs 进行分类
  chunkNames: "[ext]/[name]-[hash]",
  // 对入口文件进行分类并加 hash
  entryNames: "[name]-[hash]",
  // external:['react'],
  minify: true,
  target: ["es2015", "chrome63", "firefox68"],
  drop:['console'],
  // keepNames: true,
  splitting: true,
  format: 'esm',
  plugins: [
    sassPlugin(),
    inlineImagePlugin({
      limit: 1 * 1024, // 默认为10000，超过这个数用 file loader，否则用 dataurl loader
      // 这里如果 loader 中配置了 png 格式用 file loader，但是插件这里又配了，以这里的为准
      extensions: ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'avif', 'ttf'], // 要处理的文件格式，默认为这些
    }),
    clean({ patterns: "dist/*" }),
    aliasPlugin({}),
    htmlPlugin({
      files: [
        {
          // entryPoints (string[]): 要注入到创建的HTML文件中的入口点（Entry Points）数组。例如，['src/index.jsx']。可以指定多个入口点。
          entryPoints,
          // 输出的HTML文件的文件名，例如 index.html。路径是相对于输出目录的。
          filename: './index.html',
          // title (string): 注入到<head>中的<title>标签的内容，如果未指定，则不设置。
          // 会覆盖模版中默认的title
          title: '学习',
          // htmlTemplate (string): 自定义HTML文档模板字符串。如果省略模板，则将使用默认模板。可以是HTML字符串，也可以是指向HTML文件的相对路径。
          htmlTemplate: './public/index.html',
          // define (Record<string, string>): 定义可在 html 模板上下文中访问的自定义值。
          define: {
            name: '不要秃头啊',
          },
          // scriptLoading ('blocking' | 'defer' | 'module'): 决定是否将脚本标签插入为阻塞脚本标签，带有 defer=""（默认），或带有   type="module"。
          scriptLoading: '',
          // findRelatedCssFiles (boolean): 查找相关的输出 *.css 文件并将它们注入到HTML中。默认为 true。
          findRelatedCssFiles: true,
          // 默认为false，开启后相当于将所有的css,js文件全部放在html文件中，这样相当于只需要用到html文件
          // 属性用于控制是否将脚本和样式资源嵌入到 HTML 文件中，而不是作为外部文件引用。这可以有助于减少页面的请求次数，从而提高页面加载性能，特别是对于较小的应用
          inline: false,
          scriptLoading: 'module',
        },
      ],
    }),
  ],
  loader: {
    // '.ttf': 'dataurl', // 为了支持字体图标
    // '.eot': 'dataurl', // 为了支持字体图标
    // '.woff': 'dataurl', // 为了支持字体图标
    // '.woff2': 'dataurl', // 为了支持字体图标
    // '.svg': 'dataurl', // 为了支持字体图标
    '.txt': 'text',
  },
  alias: {
    // 这里还运行替换包名，当识别hello 这个包时自己用成 react 包，这个功能还是很有用的，比如替换为华为最近发布的包
    // hello: "react",
    '@': path.resolve(__dirname, './src'),
    '@/imgs': path.resolve(__dirname, './src/imgs'),
    '@/pages': path.resolve(__dirname, './src/pages'),
  },
};

esbuild.build({ ...options}).catch((e) => console.log(e));

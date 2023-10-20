var webpack = require("webpack");
var path = require("path");
var HtmlWebpackPlugin = require("html-webpack-plugin");
const preprocess = require("svelte-preprocess");
const { optimizeImports } = require("carbon-preprocess-svelte");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
var PACKAGE = require("./package.json");
var debug = process.env.NODE_ENV !== "production";
var entryPath = "./";

const pages = [
  "mpPageManageMain",
  "messageBoard",
  "uploadSvelte",
  "taskMgmtMain",
  "userMgmtMain",
];

const TITLE = "svelte";
const PUBLISH = "/cusys/svelte/";

function getEntry() {
  let entry = {};
  pages.forEach((elem) => {
    entry[elem] = `${entryPath}src/containers/${elem}.ts`;
  });
  return entry;
}

function getPlugins() {
  let plugins = [];
  pages.forEach((elem) => {
    plugins.push(
      new HtmlWebpackPlugin({
        title: TITLE, //指定页面名称
        filename: `${elem}.html`, //指定生成的页面名称 默认生成在output指定的路径
        template: `templates/${elem}.ejs`, //以当前指定的页面为模板去生成
        chunks: [elem, "vendor"], // 多入口时需要用到  去掉节约23629ms
      })
    );
  });
  return plugins;
}

module.exports = {
  devServer: {
    host: "0.0.0.0",
    port: "7070",
    compress: true,
    proxy: {
      "/b2b": {
        target: "http://127.0.0.1:7777/",
        // target: 'http://109.14.6.243:7777/',

        pathRewrite: { "^/b2b": "" },
        changeOrigin: true,
      },
    },
  },

  entry: getEntry(),

  output: {
    filename: "script/[name]-[chunkhash].js",
    path: __dirname + "/built",
    // publicPath: PUBLISH,
  },

  optimization: {
    minimize: true,
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor", //不要定义固定的name 节约11000ms
          chunks: "all",
          priority: -20,
        },
      },
    },
  },

  plugins: [
    ...getPlugins(),
    new webpack.DefinePlugin({
      DEBUG: debug,
    }),
    new MiniCssExtractPlugin({
      filename: "styles/[name]-[chunkhash].css",
      chunkFilename: "styles/[name]-[chunkhash].css",
    }),
    new CompressionPlugin({
      algorithm: "gzip",
      test: /\.js(\?.+)?$|\.css(\?.+)?$/,
      threshold: 0,
      minRatio: 0.8,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          "css-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: ["ts-loader"],
      },
      {
        test: /\.svelte$/,
        use: {
          loader: "svelte-loader",
          options: {
            preprocess: [preprocess(), optimizeImports()],
            emitCss: true,
          },
        },
      },
      {
        test: /\.(png|svg|gif)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024,
          },
        },
        generator: {
          filename: "static/uploadlist/svelteImg/[name][ext]",
        },
      },
      {
        test: /\.(.t|j|mj)s$/,

        resolve: {
          fullySpecified: false,
        },
      },
    ],
  },
  resolve: {
    modules: [path.join(__dirname, "src"), "node_modules"],
    alias: {
      "@": path.join(__dirname, "src"),
      svelte: path.resolve("node_modules", "svelte"),
    },
    extensions: [".js", ".ts", ".tsx", ".svelte", "module"],
    mainFields: ["svelte", "browser", "module", "main"],
    conditionNames: ["svelte", "browser"],
  },
};

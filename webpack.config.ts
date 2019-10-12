var path = require("path");
var webpack = require("webpack")
var HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');


//configurable webpack build

interface Environment {
  build?: boolean;
  sourceMap?: boolean;
}

var config = (env: Environment = {}) => {
  console.log({ env })
  const isBuild = !!env.build;
  const isDev = !env.build;
  const isSourceMap = !!env.sourceMap || isDev;
  console.log(`isBuild: ${isBuild} isDev: ${isDev} isSourceMap: ${isSourceMap}`)


  /*
   * app.ts represents the entry point to your web application. Webpack will
   * recursively go through every "require" statement in app.ts and
   * efficiently build out the application's dependency tree.
   */
  return {
    entry: {
      main: "./src/app.tsx",
    },

    devtool: isDev ? 'eval-source-map' : 'source-map',
    mode: isDev ? "development" : "production",

    /*
    * The combination of path and filename tells Webpack what name to give to
    * the final bundled JavaScript file and where to store this file.
    */
    output: {
      path: path.resolve(__dirname, "dist"),
      //filename: "[name].bundle.[hash].js"
      filename: "[name].bundle.[hash].js"
    },

    /*
    * resolve lets Webpack now in advance what file extensions you plan on
    * "require"ing into the web application, and allows you to drop them
    * in your code.
    */
    resolve: {
      extensions: [".ts", ".tsx", ".js"]
    },

    module: {
      /*
      * Each loader needs an associated Regex test that goes through each
      * of the files you've included (or in this case, all files but the
      * ones in the excluded directories) and finds all files that pass
      * the test. Then it will apply the loader to that file. I haven't
      * installed ts-loader yet, but will do that shortly.
      */
      rules: [
        //typescript
        {
          test: /\.tsx?$/,
          loader: "ts-loader",
          exclude: /node_modules/
        },

        //styles
        {
          test: /\.css$/,
          exclude: /node_modules/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                // you can specify a publicPath here
                // by default it uses publicPath in webpackOptions.output
                publicPath: '../',
                hmr: process.env.NODE_ENV === 'development',
              },
            },
            'css-loader',
          ]
        },

        //fonts
        {
          test: /\.(ttf|eot|woff|woff2)$/,
          loader: "file-loader",
          options: {
            name: "fonts/[name].[ext]",
          },
        },

        //images
        {
          test: /\.jpe?g$|\.ico$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf$|\.wav$|\.mp3$/,
          exclude: /node_modules/,
          loader: 'file-loader',
          options: {
            name: '[name].[ext]' // <-- retain original file name
          }
        }
      ]
    },

    optimization: {
      splitChunks: {
        // include all types of chunks
        chunks: 'all'
      },
      minimize: isBuild,
      minimizer: [new TerserPlugin()],
    },

    plugins: [//development/production environment
      /*new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(isDev ? 'development' : 'production'),
        },
      }),*/
      //clean dist folder
      new CleanWebpackPlugin({ dry: false, verbose: true }),

      //extract styles text to bundle
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // all options are optional
        filename: '[name].css',
        chunkFilename: '[id].css',
        ignoreOrder: false, // Enable to remove warnings about conflicting order
      }),


      //generate index html
      new HtmlWebpackPlugin(
        {
          title: "Tiling",
          inject: false,
          template: require('html-webpack-template'),

          //https://github.com/jantimon/html-webpack-plugin/issues/129
          favicon: 'assets/favicon.ico',

          appMountIds: ["root"], //div with ids for react app
          hash: true,
          //scripts: ["APIConfig.js"],
          //chunks: ["vendor", "common", "main"],
          minify: { collapseWhitespace: true, preserveLineBreaks: true }
        }),

    ],

    devServer: {
      //contentBase: path.join(__dirname, "dist"),
      contentBase: [path.join(__dirname, 'public'), path.join(__dirname, 'assets')],
      //publicPath: "/BN/Billing/",
      open: true,
      compress: true,
      //port: 9000,
    }
  }

};

module.exports = config;
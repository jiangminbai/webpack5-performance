const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const TerserWebpackPlugin = require('terser-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  optimization: {
    // hints: 'warning',  // 或者设置为 false 来禁用性能提示
    // maxAssetSize: 500000,  // 设置文件大小阈值为 500 KiB
    // maxEntrypointSize: 500000,  // 入口点大小
    // splitChunks: {
    //   chunks: 'all',
    // },
    minimizer: [
      new TerserWebpackPlugin({parallel: true}) // 开启多进程压缩
    ]
  },
  performance: {
    hints: 'warning',  // 或者设置为 false 来禁用性能提示
    maxAssetSize: 1000000,  // 设置文件大小阈值为 500 KiB
    maxEntrypointSize: 1000000,  // 入口点大小
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name].[contenthash].bundle.js',
    clean: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ],
  // resolve: {
  //   // 使用绝对路径指明第三方模块存放的位置，以减少搜索步骤
  //   // __diename 表示当前工作目录，也就是项目根目录
  //   modules: [path.resolve(__dirname, 'node_modules')]
  // },
  // 打包解析时，忽略某些没有模块化的文件
  // externals: {
  //   lodash: '_',
  //   moment: 'moment',
  //   jquery: '$'
  // },
  module: {
    noParse: /jquery|lodash|moment/, // 忽略没有模块化的文件
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          // 开启多进程打包。 
          {
            loader: 'thread-loader', // 需要安装
            options: {
              workers: 3 // 进程3个
            }
          },
          {
          loader: 'babel-loader',
          options: {
            // cacheDirectory: true,
            presets: [
              ['@babel/preset-env'],
              ['@babel/preset-react', {runtime: 'automatic'}]
            ]  // 支持 ES6 和 JSX
          }
        }]
      },
      {
        test: /\.(less)$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader'
        ]
      }
    ]
  }
}
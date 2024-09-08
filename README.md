# webpack5 性能优化
从`时间`和`体积`两个层面去优化

### 优化构建速度
#### 减少构建模块
1. noParse 打包解析时，忽略没有模块化的文件

```javascript
  module: {
    noParse: /jquery|lodash|moment/
  }
```

效果：`7100ms` --> `5000ms`

2. externals 无需打包哪些文件，使用CDN加速
```javascript
  externals: {
    lodash: '-',
    moment: 'moment',
    jquery: '$'
  }
```
效果：`7100ms` --> `2645ms`

3. loader 的include exclude，loader会批量命中多个文件，尽可能精确地命中文件
```javascript
  rules: [
    {
      test: /\.(js|jsx)$/,
      exclude: /node_modules/
    },
    {
      test: /\.less$/,
      exclude: /node_modules/
    }
  ]
```
效果： `11000ms` --> `7200ms`

#### 并行构建和并行压缩
1. thread-loader 创建多个worker池并行执行loader解析
```javascript
  {
    test: /\.(js|jsx)$/,
    use: [
      {
        loader: 'thread-loader',
        options: {
          workers: 3
        }
      },
      {
        loader: 'babel-loader'
      }
    ]
  }
```
效果： 项目足够大效果才比较明显

2. terser-webpack-plugin 并行压缩
```javascript
  optimization: {
    minimizer: {
      new TerserWebpackPlugin({parallel: true})
    }
  }
```
效果： `7200ms` --> `6400ms`

### 优化构建体积

#### 压缩代码
1.压缩html
```javascript
  new HtmlWebpackPlugin({
    minify: {
      removeComments: true, // 去掉HTML的注释
      collapseWhitespace: true, // 删除空白符与换行符
      minifyCSS: true, // 压缩内联css
    }
  })
```
2. 压缩css
```javascript
  // 抽离css到单独文件(mini-css-extract-plugin)
  use: [
    MiniCssExtractPlugin.loader,
    'css-loader',
  ]
  plugins: [
    new MiniCssExtractPlugin()
  ]
  // 压缩css(css-minimizer-webpack-plugin)
  optimization: {
    minimize: true, // 是否需要压缩
    minimizer: [
      new CssMinimizerWebpackPlugin()
    ]
  }
```
3. 压缩js
webpack 5 在mode=production模式下默认配置了terser-webpack-plugin来压缩

4. 压缩图片
image-minimizer-webpack-plugin

#### Tree Shaking
1. js tree shaking 在生产模式下已经默认开启
2. css tree shaking 
```javascript
  new PurgeCSSPlugin({
    paths: glob.sync(
      path.join(__dirname, 'src/**/*'),
      { nodir: true }
    ),
  }),
```

### 参考
https://juejin.cn/post/7244819106342780988
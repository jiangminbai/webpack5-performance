const webpack = require('webpack')
const config = require('./webpack.config')

const compiler = webpack(config)

compiler.run((err, stats) => {
  if (err) {
    // console.log(err)
    return
  }
  console.log(
    stats.toString({
      chunks: false,
      colors: true,
      modules: false,
      assets: true,
      all: undefined,
      cachedAssets: true,
      // errors: true,
      // errorStack: true,
    })
  )
})
const path = require('path')
const SkeletonWebpackPlugin = require('vue-skeleton-webpack-plugin')

module.exports = {
  css: {
    // css拆分ExtractTextPlugin插件，默认true - 骨架屏需要为true
    extract: true
  },
  devServer: {
    proxy: {
      '/api/*': {
        target: 'http://127.0.0.1:3000',
        ws: true,
        changeOrigin: true
      }
    }
  },

  pwa: {
    // configure the workbox plugin
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      // swSrc is required in InjectManifest mode.
      swSrc: 'src/pwa/service-worker.js'
    }
  },

  configureWebpack: config => {
    // vue骨架屏插件配置
    config.plugins.push(
      new SkeletonWebpackPlugin({
        webpackConfig: {
          entry: {
            app: path.join(__dirname, './src/components/skeleton/skeleton.config.js')
          }
        },
        minimize: true,
        quiet: true
      })
    )
  }
}

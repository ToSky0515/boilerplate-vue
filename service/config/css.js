'use strict'

const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const genStyleRules = () => {
  const isProd = process.env.NODE_ENV === 'production'

  const cssLoader = {
    loader: 'css-loader',
    options: {
      // how many loaders before css-loader should be applied to [@import]ed resources.
      // stylePostLoader injected by vue-loader + postcss-loader
      importLoaders: 1 + 1,
    },
  }
  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      plugins: [require('autoprefixer')],
    },
  }
  const extractPluginLoader = {
    loader: MiniCssExtractPlugin.loader,
    options: {
      hmr: !isProd,
    },
  }
  const vueStyleLoader = {
    loader: 'vue-style-loader',
  }

  function createCSSRule(test, loader, loaderOptions) {
    const loaders = [cssLoader, postcssLoader]

    if (isProd) {
      loaders.unshift(extractPluginLoader)
    } else {
      loaders.unshift(vueStyleLoader)
    }

    if (loader) {
      loaders.push({ loader, options: loaderOptions })
    }

    return { test, use: loaders }
  }

  return [
    createCSSRule(/\.css$/),
    createCSSRule(/\.p(ost)?css$/),
    createCSSRule(/\.scss$/, 'sass-loader'),
  ]
}

module.exports = {
  module: {
    rules: genStyleRules(),
  },
}

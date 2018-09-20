process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const environment = require('./environment');

// =========================================================================
// Bundle Analyzer
// Enable this section to load up the bundle analyzer when compiling
// =========================================================================
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// environment.plugins.append("BundleAnalyzer",
//   new BundleAnalyzerPlugin()
// );

module.exports = environment.toWebpackConfig()

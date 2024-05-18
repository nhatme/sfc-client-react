const path = require('path');

module.exports = {
    webpack: {
        configure: (webpackConfig) => {
            webpackConfig.resolve.fallback = {
                crypto: require.resolve('crypto-browserify'),
                stream: require.resolve('stream-browserify'),
            };
            return webpackConfig;
        },
    },
};

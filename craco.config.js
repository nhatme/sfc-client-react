const path = require('path');

module.exports = {
    webpack: {
        configure: (webpackConfig) => {
            webpackConfig.resolve.fallback = {
                crypto: require.resolve('crypto-browserify'),
                stream: require.resolve('stream-browserify'),
                vm: require.resolve("vm-browserify"),
                util: require.resolve("util"),
                assert: require.resolve("assert"),
                fs: false,
                process: false,
                path: false,
                zlib: false,
            };
            return webpackConfig;
        },
    },
};

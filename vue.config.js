const { postcss } = require('./src/config/pxtorem')
module.exports = {
    publicPath:"",
    outputDir:"dist",
    css: {
        loaderOptions: {
            postcss: {
                plugins: [
                    postcss
                ]
            }
        }
    },
    lintOnSave: false,
    devServer: {
        proxy: {
            '/lis_appointment': {
                // target: 'https://lisalarm.coyotebio-lab.com',
                target: 'https://scldev.coyotebio-lab.com:8443',
                changeOrigin: true,
                pathRewrite:{
                    '^/lis_appointment': '/lis_appointment'
                }
            },
        }
    }
}
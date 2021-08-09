module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
        ? '/waterfall/'
        : '/',
    assetsDir: 'static'
}
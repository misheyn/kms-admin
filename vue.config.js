module.exports = {
  transpileDependencies: [],
  chainWebpack: config => {
    config.plugin('define').tap(definitions => {
      definitions[0].__VUE_PROD_HYDRATION_MISMATCH_DETAILS__ = false
      return definitions
    })
  }
}

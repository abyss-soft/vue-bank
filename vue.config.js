module.exports = {
  devServer: {
    historyApiFallback: true,
    proxy: {
      "/api": {
        target: "http://192.168.88.189:8000",
        secure: false,
        changeOrigin: true
      }
    }
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/utilits/include-all.scss";`
      }
    }
  }
};

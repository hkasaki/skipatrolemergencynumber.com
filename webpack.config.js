const path = require("path");

module.exports = {
  entry: "./src/spen.js",
  output: {
    path: path.resolve(__dirname, "./site"),
    filename: "index.js",
  },
  devServer: {
    static: {
        directory: path.join(__dirname, "./site")
    },
    hot: true,
    watchFiles: ["src/**/*.js"]
  }
};

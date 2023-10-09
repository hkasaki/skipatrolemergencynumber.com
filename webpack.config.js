const path = require("path");

module.exports = {
  entry: "./src/spen.js",
  output: {
    path: path.resolve(__dirname, "./site"),
    filename: "index.js",
  },
  mode: "development"
};

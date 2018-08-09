/**
 * External dependencies
 */
const ExtractTextPlugin = require("extract-text-webpack-plugin");

// Main CSS loader for everything but blocks..
const cssExtractTextPlugin = new ExtractTextPlugin({
  filename: "./scripts/[name]/build/style.css"
});

// Configuration for the ExtractTextPlugin.
const extractConfig = {
  use: [
    { loader: "raw-loader" },
    {
      loader: "postcss-loader",
      options: {
        plugins: [require("autoprefixer")]
      }
    },
    {
      loader: "sass-loader",
      query: {
        outputStyle:
          "production" === process.env.NODE_ENV ? "compressed" : "nested"
      }
    }
  ]
};

const entryPointNames = ["sidebar", "i18n"];

const externals = {
  react: "React"
};
entryPointNames.forEach(entryPointName => {
  externals["@dropit/" + entryPointName] = {
    this: ["dropit", entryPointName]
  };
});

const wpDependencies = [
  "components",
  "element",
  "blocks",
  "utils",
  "date",
  "data",
  "i18n",
  "editPost",
  "plugins",
  "apiRequest",
  "editor",
  "compose"
];
wpDependencies.forEach(wpDependency => {
  externals["@wordpress/" + wpDependency] = {
    this: ["wp", wpDependency]
  };
});

const config = {
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
  entry: entryPointNames.reduce((memo, entryPointName) => {
    memo[entryPointName] = "./scripts/" + entryPointName + "/index.js";
    return memo;
  }, {}),
  externals,
  output: {
    filename: "scripts/[name]/build/index.js",
    path: __dirname,
    library: ["dropit", "[name]"],
    libraryTarget: "this"
  },
  resolve: {
    modules: [__dirname, "node_modules"]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader"
      },
      {
        test: /\.s?css$/,
        use: cssExtractTextPlugin.extract(extractConfig)
      }
    ]
  },
  plugins: [cssExtractTextPlugin],
  stats: {
    children: false
  }
};

module.exports = config;

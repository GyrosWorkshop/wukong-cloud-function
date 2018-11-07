module.exports = {
  "presets": [
    ["@babel/preset-env", {
      useBuiltIns: "usage",
      targets: {
        node: "6.10"
      }
    }]
  ],
  "plugins": ["@babel/plugin-proposal-do-expressions"]
}

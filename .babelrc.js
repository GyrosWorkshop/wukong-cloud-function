module.exports = {
  "presets": [
    ["@babel/preset-env", {
      useBuiltIns: "usage",
      targets: {
        node: "8.9"
      }
    }]
  ],
  "plugins": ["@babel/plugin-proposal-do-expressions"]
}

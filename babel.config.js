module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@app": "./src/core",
            "@components": "./src/components",
            "@features": "./src/features",
            "@api": "./src/api",
            "@store": "./src/store",
            "@hooks": "./src/hooks",
            "@types": "./src/types",
            "@utils": "./src/utils",
            "@theme": "./src/theme",
            "@constants": "./src/constants"
          }
        }
      ]
    ]
  };
};

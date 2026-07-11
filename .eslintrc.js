module.exports = {
  root: true,
  extends: ["universe/native"],
  rules: {
    "import/order": [
      "warn",
      { "newlines-between": "always", alphabetize: { order: "asc" } }
    ]
  }
};

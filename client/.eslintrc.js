module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ["airbnb", "prettier"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": ["off", { endOfLine: "auto" }],
    "import/no-extraneous-dependencies": ["error", { devDependencies: true }],
    "react/jsx-props-no-spreading": "off",
    "anchor-is-valid": "off",
    "no-static-element-interactions": "off",
    "click-events-have-key-events": "off",
    "no-underscore-dangle": "off",
    "no-nested-ternary": "off",
  },
};

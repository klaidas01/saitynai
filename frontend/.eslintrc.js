/* eslint-disable linebreak-style */
module.exports = {
  parser: "babel-eslint",
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "prettier",
    "prettier/react",
    "plugin:prettier/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
  ],
  plugins: ["react", "prettier", "react-hooks"],
  rules: {
    "linebreak-style": ["error", "windows"],
    "no-var": "error",
    "prefer-const": "error",
    "react/jsx-uses-react": "error",
    "react/jsx-uses-vars": "error",
    "react/no-unused-prop-types": "error",
    "react/require-default-props": "error",
    "prettier/prettier": "error",
    "no-duplicate-imports": "error",
    "no-restricted-imports": "error",
    "no-mixed-requires": "error",
  },
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
    jest: true,
  },
};

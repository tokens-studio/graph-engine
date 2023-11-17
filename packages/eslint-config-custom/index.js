// Eslint does not support module exports, so we need to use CommonJS syntax
// eslint-disable-next-line no-undef
module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "prettier",
    "plugin:react/recommended",
  ],
  parser: "@typescript-eslint/parser",
  plugins: [
    "sort-imports-es6-autofix",
    "jest",
    "@typescript-eslint",
    "unused-imports",
  ],
  rules: {
    'indent': ['error', 2],
    "react/react-in-jsx-scope": "off",
    "react/jsx-key": "off",
    //If we do this, it must be a good reason
    "@typescript-eslint/ban-ts-comment": "off",
    "sort-imports-es6-autofix/sort-imports-es6": [
      2,
      {
        ignoreCase: false,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ["none", "all", "multiple", "single"]
      }
    ],
    "react/jsx-curly-spacing": ["error", "never"],
    "react/jsx-indent-props": ["error", 2],
    "no-unused-vars": "off",
    "unused-imports/no-unused-imports": "error"
  }
};

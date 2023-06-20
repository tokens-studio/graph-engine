// Eslint does not support module exports, so we need to use CommonJS syntax
// eslint-disable-next-line no-undef
module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["sort-imports-es6-autofix", "jest", "@typescript-eslint"],
  rules: {
    "react/jsx-key": "off",
    //If we do this, it must be a good reason
    "@typescript-eslint/ban-ts-comment": "off",
    "sort-imports-es6-autofix/sort-imports-es6": [
      2,
      {
        ignoreCase: false,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ["none", "all", "multiple", "single"],
      },
    ],
  },
};

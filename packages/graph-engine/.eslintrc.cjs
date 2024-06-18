/* eslint-disable no-undef */
/** @type {import("eslint").Linter.Config} */

module.exports = {
  root: true,
  extends: [require.resolve('@tokens-studio/eslint-custom-config/index.js')],
  "rules": {
    //There are multiple legitimate use cases for the any type in this project
    "@typescript-eslint/no-explicit-any": "off"
  }
};
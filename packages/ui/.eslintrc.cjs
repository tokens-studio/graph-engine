/* eslint-disable no-undef */
/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: [require.resolve('@tokens-studio/eslint-config-custom')],
  rules: {
    "@typescript-eslint/no-explicit-any": "off"
  },
};
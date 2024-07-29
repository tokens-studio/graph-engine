/* eslint-disable @typescript-eslint/no-var-requires */
"use strict";
const path = require("path");
const assert = require("yeoman-assert");
const helpers = require("yeoman-test");
const { beforeAll, describe, it } = require("@jest/globals");

describe("generator-graph-engine:app", () => {
  beforeAll(() => {
    return helpers
      .run(path.join(__dirname, "../generators/app"))
      .withPrompts({ name: "foo" });
  });

  it("creates files", () => {
    assert.file(["package.json"]);
    assert.file(["readme.md"]);
    assert.file(["tsconfig.json"]);
  });
});

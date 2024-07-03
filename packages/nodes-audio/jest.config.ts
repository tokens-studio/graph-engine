/* eslint-disable import/no-anonymous-default-export */
import tsconfig from "./tsconfig.json";

export default {
  coverageDirectory: "<rootDir>/jest-coverage",
  collectCoverage: true,
  collectCoverageFrom: ["<rootDir>/src/**.{js,jsx,ts,tsx}"],
  coverageReporters: ["json"],
  coveragePathIgnorePatterns: [
    "!<rootDir>/dist/",
    "!<rootDir>/jest-coverage",
    "!<rootDir>/types/",
    "!*.d.ts",
  ],
  // preset: 'ts-jest/presets/js-with-ts',
  moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json"],
  moduleNameMapper: {
    // Yes it should be an array to ensure consistency, but jest does not offer this
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/tests/__mocks__/file-mock.js",
    ".+\\.(css|less|scss|sass|styl)$": "identity-obj-proxy",
  },
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.test.json",
      },
    ],
  },
  transformIgnorePatterns: [
    // Change MODULE_NAME_HERE to your module that isn't being compiled
    "/node_modules/(?!(apca-w3|colorparsley|dot-prop)).+\\.js$",
  ],
  resolver: "ts-jest-resolver",
  reporters: [
    "default",
    [
      "jest-junit",
      {
        outputDirectory: "<rootDir>/jest-coverage",
        outputName: "junit.xml",
      },
    ],
  ],
  testPathIgnorePatterns: [],
  globals: {
    __PATH_PREFIX__: "",
  },
  roots: ["<rootDir>"],
  rootDir: ".",
};

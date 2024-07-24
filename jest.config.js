/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  clearMocks: true,
  coverageProvider: "v8",
  moduleFileExtensions: ["ts", "js", "jsx", "tsx", "json", "node"],
  roots: ["<rootDir>/src"],

  testMatch: ["**/?(*.)+(test).ts"],
  testEnvironment: "node",
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
};
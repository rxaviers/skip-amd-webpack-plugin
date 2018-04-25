"use strict";

const SkipAMDPlugin = require("../index");
const expect = require("chai").expect;
const fs = require("fs");
const mkdirp = require("mkdirp");
const path = require("path");
const rimraf = require("rimraf");
const util = require("util");
const webpack = require("webpack");

const promisefiedRimraf = util.promisify(rimraf);
const promisefiedWebpack = config =>
  new Promise((resolve, reject) => {
    webpack(config, (error, stats) => {
      if (error) {
        return reject(error);
      }
      return resolve(stats);
    });
  });

const outputPath = path.join(__dirname, "../tmp/test-output");

describe("SkipAMDPlugin Plugin", () => {
  before(async () => {
    await promisefiedRimraf(outputPath);
    mkdirp.sync(outputPath);
    await promisefiedWebpack({
      entry: {
        app: path.join(__dirname, "fixtures/app")
      },
      mode: "development",
      output: {
        path: outputPath,
        filename: "app.js"
      },
      plugins: [new SkipAMDPlugin(/[/\\]fixtures[/\\]app/)]
    });
  });

  it("should extract formatters and parsers from basic code", () => {
    const outputFilepath = path.join(outputPath, "app.js");
    const outputFileExists = fs.existsSync(outputFilepath);
    expect(outputFileExists).to.be.true;
    const content = fs.readFileSync(outputFilepath).toString();
    expect(content).to.be.a("string");
    expect(content).to.include(
      "// UMD returnExports\\n  if (false) {} else if (true) {\\n    // Node, CommonJS\\n    module.exports = factory(__webpack_require__("
    );
  });
});

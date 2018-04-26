"use strict";

const SkipAMDPlugin = require("../index");
const expect = require("chai").expect;
const fs = require("fs");
const mkdirp = require("mkdirp");
const path = require("path");
const rimraf = require("rimraf");
const webpack = require("webpack");

const outputPath = path.join(__dirname, "../tmp/test-output");

const promisefiedWebpack = config =>
  new Promise((resolve, reject) => {
    webpack(config, (error, stats) => {
      if (error) {
        return reject(error);
      }
      return resolve(stats);
    });
  });

describe("SkipAMDPlugin Plugin", () => {
  before(done => {
    rimraf(outputPath, () => {
      mkdirp.sync(outputPath);
      promisefiedWebpack({
        entry: {
          app: path.join(__dirname, "fixtures/app")
        },
        output: {
          path: outputPath,
          filename: "app.js"
        },
        plugins: [new SkipAMDPlugin(/[/\\]fixtures[/\\]app/)]
      })
        .then(() => done())
        .catch(done);
    });
  });

  it("should extract formatters and parsers from basic code", () => {
    const outputFilepath = path.join(outputPath, "app.js");
    const outputFileExists = fs.existsSync(outputFilepath);
    expect(outputFileExists).to.be.true;
    const content = fs.readFileSync(outputFilepath).toString();
    expect(content).to.be.a("string");
    expect(content).to.include(`// UMD returnExports
  if (false) {
    // AMD
    define(["dep"], factory);
  } else if (true) {
    // Node, CommonJS
    module.exports = factory(__webpack_require__(1));
  } else {`);
  });
});

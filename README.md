## Why Skip AMD Webpack Plugin?

Use *skip-amd-webpack-plugin* to have webpack to skip AMD defines and therefore
favor CJS. Useful to skip the AMD part of an UMD wrapper.

## Usage

    npm install skip-amd-webpack-plugin --save-dev

```js
var SkipAMDPlugin = require("skip-amd-webpack-plugin");

MyPlugin.prototype.apply = function(compiler) {

    // Skip AMD part (therefore using CJS) of my-umd-wrapped-mode module.
    compiler.apply(new SkipAMDPlugin(/(^|\/)my-umd-wrapped-module($|\/)/));
});
```

## API

**SkipAMDPlugin(requestRegExp)**

*requestRegExp* is a RegExp to match against module.request.

## Development

### Tests

    npm install
    npm test

## Why Skip AMD Webpack Plugin?

Use *skip-amd-webpack-plugin* to have webpack to skip AMD defines and therefore
favor CJS. Useful to skip the AMD part of an UMD wrapper.

## Usage

Starting from *v1.0.0*, only *webpack 4* is supported. If you need support for *webpack 3* or older, use our *v0.x* releases.

| skip-amd-webpack-plugin | webpack                        |
| ----------------------- | ------------------------------ |
| 1.x                     | ^4.0.0                         |
| 0.x                     | ^1.9.0 \|\| ^2.2.0 \|\| ^3.0.0 |

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

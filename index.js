const ConstDependency = require("webpack/lib/dependencies/ConstDependency");

class SkipAMDPlugin {
  constructor(requestRegExp) {
    this.requestRegExp = requestRegExp;
  }

  apply(compiler) {
    compiler.hooks.compilation.tap(
      "SkipAMDPlugin",
      (compilation, { normalModuleFactory }) => {
        // Note: We're using `this.requestRegExp` instead of a plain `requestRegExp`
        // variable to allow this variable to be changed dynamically. Because, it
        // allows the following hacky usage. In other words, it allows one to update
        // the regular expression on the fly instead of appending more plugins.
        //
        // https://github.com/rxaviers/globalize-webpack-plugin/blob/v0.1.1/ProductionModePlugin.js#L78-L92
        //
        // TODO: The statement below was true for Tapable, not sure for the new .hooks approach in webpack 4.
        // This hacky usage shouldn't be needed if it was possible to prepend plugins instead of just appending them.
        const handler = parser => {
          parser.hooks.evaluateTypeof
            .for("define")
            .tap("SkipAMDPlugin", expr => {
              if (this.requestRegExp.test(parser.state.current.request)) {
                const res = parser.evaluate("typeof (false)");
                res.setRange(expr.range);
                return res;
              }
            });
          parser.hooks.typeof.for("define").tap("SkipAMDPlugin", expr => {
            if (this.requestRegExp.test(parser.state.current.request)) {
              const dep = new ConstDependency("typeof (false)", expr.range);
              dep.loc = expr.loc;
              parser.state.current.addDependency(dep);
              return true;
            }
          });
        };

        normalModuleFactory.hooks.parser
          .for("javascript/auto")
          .tap("SkipAMDPlugin", handler);
        normalModuleFactory.hooks.parser
          .for("javascript/dynamic")
          .tap("SkipAMDPlugin", handler);
      }
    );
  }
}

module.exports = SkipAMDPlugin;

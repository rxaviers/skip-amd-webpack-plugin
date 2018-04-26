var ConstDependency = require("webpack/lib/dependencies/ConstDependency");
var NormalModuleFactory = require("webpack/lib/NormalModuleFactory");

function SkipAMDPlugin(requestRegExp) {
  this.requestRegExp = requestRegExp;
}

SkipAMDPlugin.prototype.apply = function(compiler) {
  // Note: We're using `self.requestRegExp` instead of a plain `requestRegExp`
  // variable to allow this variable to be changed dynamically. Because, it
  // allows the following hacky usage. In other words, it allows one to update
  // the regular expression on the fly instead of appending more plugins.
  //
  // https://github.com/rxaviers/globalize-webpack-plugin/blob/v0.1.1/ProductionModePlugin.js#L78-L92
  //
  // This hacky usage shouldn't be needed if Tapable provides a way to prepend
  // plugins instead of just appending them.
  var self = this;

  var run = function(parser) {
    parser.plugin("evaluate typeof define", function(expr) {
      if (self.requestRegExp.test(this.state.current.request)) {
        var res = parser.evaluate("typeof (false)");
        res.setRange(expr.range);
        return res;
      }
    });
    parser.plugin("typeof define", function(expr) {
      if (self.requestRegExp.test(this.state.current.request)) {
        var dep = new ConstDependency("typeof (false)", expr.range);
        dep.loc = expr.loc;
        this.state.current.addDependency(dep);
        return true;
      }
    });
  };

  // Hack to support webpack 1.x and 2.x.
  // webpack 2.x
  if (NormalModuleFactory.prototype.createParser) {
    compiler.plugin("compilation", function(compilation, params) {
      params.normalModuleFactory.plugin("parser", run);
    });

    // webpack 1.x
  } else {
    run(compiler.parser);
  }
};

module.exports = SkipAMDPlugin;

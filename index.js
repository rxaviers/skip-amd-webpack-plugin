var ConstDependency = require("webpack/lib/dependencies/ConstDependency");

function SkipAMDOfUMDPlugin(requestRegExp) {
  this.requestRegExp = requestRegExp;
}

SkipAMDOfUMDPlugin.prototype.apply = function(compiler) {
  var requestRegExp = this.requestRegExp;

  compiler.parser.plugin("can-rename define", function() {
    return false;
  });
  compiler.parser.plugin("evaluate typeof define", function(expr) {
    if (requestRegExp.test(this.state.current.request)) {
      var res = compiler.parser.evaluate("typeof (false)");
      res.setRange(expr.range);
      return res;
    }
  });
  compiler.parser.plugin("typeof define", function(expr) {
    if (requestRegExp.test(this.state.current.request)) {
      var dep = new ConstDependency("typeof (false)", expr.range);
      dep.loc = expr.loc;
      this.state.current.addDependency(dep);
      return true;
    }
  });

};

module.exports = SkipAMDOfUMDPlugin;

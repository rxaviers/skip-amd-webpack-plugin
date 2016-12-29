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

  compiler.plugin('normal-module-factory', function(nmf) {
    nmf.plugin('before-resolve', function(result, callback) {
      if (!result) {
        return callback();
      }
      if (self.requestRegExp.test(result.request)) {
        result.request = 'imports-loader?define=>false!' + result.request;
      }
      return callback(null, result);
    });
  });
};

module.exports = SkipAMDPlugin;

(function(root, factory) {
  // UMD returnExports
  if (typeof define === "function" && define.amd) {
    // AMD
    define(["dep"], factory);
  } else if (typeof exports === "object") {
    // Node, CommonJS
    module.exports = factory(require("./dep"));
  } else {
    // Global
    root.App = factory(root.dep);
  }
  // eslint-disable-next-line no-unused-vars
})(this, function(dep) {});

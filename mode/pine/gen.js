const fs = require("fs");

function replace_vars(vars) {
    return `(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.pineVars = factory());
    }(this, (function () { 'use strict';

    return ${vars};
})))`;
}

let output = fs.readFileSync("./output.json").toString();
fs.writeFileSync("./vars.js", replace_vars(output));

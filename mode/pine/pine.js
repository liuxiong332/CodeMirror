// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

(function(mod) {
    if (typeof exports == "object" && typeof module == "object") // CommonJS
      mod(require("../../lib/codemirror"), require("../../addon/mode/simple"), require("./vars.js"));
    else if (typeof define == "function" && define.amd) // AMD
      define(["../../lib/codemirror", "../../addon/mode/simple", "./vars.js"], mod);
    else // Plain browser env
      mod(CodeMirror, CodeMirror, pineVars);
  })(function(CodeMirror, _, pineVars) {
  "use strict";
  
  var buildvars = pineVars.variables.concat(pineVars.functions).map(function(s) {
      return s.replace(".", "\\.");
  }).join("|");

  CodeMirror.defineSimpleMode("pine",{
    start: [
        // double string
        {regex: /"/, token: "string", next: "string"},
        // single string
        {regex: /'/, token: "string", next: "single_string"},
        {regex: /\/\/.*$/, token: "comment"},
        {
            regex: /(?:(?:[0-9][0-9_]*)(?:(?:[Ee][+-]?[0-9_]+)|\.[0-9_]+(?:[Ee][+-]?[0-9_]+)?)?)/,
            token: "number"
        },

        {
            regex: /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\(.+?=>)/, 
            token: ["def"],
            next: "def_parameter",
        },

        {
            regex: /\b(var|if|else|for|to|by|return|break|continue)\b/, 
            token: ["keyword"],
        },
        {
            regex: /\b(bool|int|float|string|color)\b/,
            token: ["type"],
        },
        {
            regex: /\b(true|false|na|open|close|high|low)\b/,
            token: ["builtin"],
        },
        {
            regex: new RegExp("\\b(" + buildvars + ")\\b") ,
            token: ["builtin"],
        },
        {
            regex: /(\#[0-9a-fA-F]+)/,
            token: "atom",
        },
        {
            regex: /=(?!=)|:=|\*|\+|-|%|\/|!=|==|>=|<=|<|>|\?|:/,
            token: "operator"
        },
        {
            regex: /\b(and|or|not)\b/,
            token: "keyword",
        },
        {
            regex: /\b([a-zA-Z_][a-zA-Z0-9_]*)\b\s*(?=\()/,
            token: ["variable-2"],
        },
        {
            regex: /\b([a-zA-Z_][a-zA-Z0-9_]*)\b/,
            token: ["variable"],
        },
        {
            regex: /\.\s*\b([a-zA-Z_][a-zA-Z0-9_]*)\b/,
            token: ["property"],
        }
    ],
    string: [
      {regex: /"/, token: "string", next: "start"},
      {regex: /(?:[^\\"]|\\(?:.|$))*/, token: "string"}
    ],
    single_string: [
        {regex: /'/, token: "string", next: "start"},
        {regex: /(?:[^\\']|\\(?:.|$))*/, token: "string"}
    ],
    def_parameter: [
        {regex: /\(/, token: "matchingbracket"},
        {regex: /\)/, token: "matchingbracket"},
        {
            regex: /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(,)/, 
            token: ["def", null],
        },
        {
            regex: /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=[)\n])/, 
            token: ["def"],
        },
        {regex: /=>/, token: "tag", next: "start"},
    ],
    comment: [
      {regex: /.*?\*\//, token: "comment", next: "start"},
      {regex: /.*/, token: "comment"}
    ],
    meta: {
      dontIndentStates: ["comment"],
      // electricInput: /^\s*\}$/,
      // blockCommentStart: "/*",
      // blockCommentEnd: "*/",
      lineComment: "//",
      fold: "brace"
    }
  });
  
  
  CodeMirror.defineMIME("text/x-pine", "pine");
  CodeMirror.defineMIME("text/pine", "pine");
  });
  
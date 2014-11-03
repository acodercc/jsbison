var testcfg = {
  "start": "A",
  "bnf": {
    "A": {
      "a": "\n            this.$$ = $1;\n        ",
      "A B C": "\n            this.$$ = $1 + $2 + $3;\n        "
    },
    "B": {
      "": "\n            this.$$ = \"\";\n        ",
      "b": "\n            this.$$ = $1;\n        "
    },
    "C": {
      "c": " this.$$ = $1 "
    }
  },
  "lex": {
    "rules": [
      {
        "regex": "/a/",
        "action": "   return \"a\";"
      },
      {
        "regex": "/b/",
        "action": "   return \"b\";"
      },
      {
        "regex": "/c/",
        "action": "   return \"c\";"
      }
    ],
    "states": {}
  },
  "type": "LR(1)"
}
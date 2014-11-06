var testcfg = {
  "start": "term",
  "defaultAction": "\n    this.$$ = $1+2;\n    console.log('run');\n",
  "bnf": {
    "term": {
      "term * factoy": "\n            this.$$ = $1 * $3;\n        ",
      "factoy": ""
    },
    "factoy": {
      "NUMBER": "\n            this.$$ = parseInt($1, 10);\n        "
    }
  },
  "lex": {
    "rules": [
      {
        "regex": "/\\d+/",
        "action": "     return \"NUMBER\";"
      },
      {
        "regex": "/\\+/",
        "action": "      return \"+\";"
      },
      {
        "regex": "/\\*/",
        "action": "      return \"*\";"
      },
      {
        "regex": "/\\-/",
        "action": "      return \"-\";"
      },
      {
        "regex": "/\\//",
        "action": "      return \"/\";"
      },
      {
        "regex": "/\\(/",
        "action": "      return \"(\";"
      },
      {
        "regex": "/\\)/",
        "action": "      return \")\";"
      }
    ],
    "states": {}
  },
  "type": "LR(1)"
}
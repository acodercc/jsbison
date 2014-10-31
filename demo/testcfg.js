var testcfg = {
  "start": "expr",
  "bnf": {
    "expr": {
      " expr + term": "\n            this.$$ = $1 + $3;\n        ",
      " term": ""
    },
    "term": {
      " term * factoy": "\n            this.$$ = $1 * $3;\n        ",
      " factoy": ""
    },
    "factoy": {
      " NUMBER": "",
      "   ( expr )": "\n            this.$$ = $2;\n        "
    }
  },
  "code": "\n\nglobal.exprParser = parser;\n",
  "lex": {
    "rules": [
      {
        "regex": {},
        "action": "           return \"*\";"
      },
      {
        "regex": {},
        "action": "    if(parseInt(this.yytext,10).toString() !== \"NaN\"){        this.yytext = parseInt(this.yytext, 10);    }else{        this.yytext = \"0\";    }    return \"NUMBER\";"
      },
      {
        "regex": {},
        "action": "           return \"+\";"
      },
      {
        "regex": {},
        "action": "           return \"(\";"
      },
      {
        "regex": {},
        "action": "           return \")\";"
      },
      {
        "regex": {},
        "action": "           return \"{\";"
      },
      {
        "regex": {},
        "action": "           return \"}\";"
      },
      {
        "regex": {},
        "action": ""
      }
    ],
    "states": {}
  },
  "type": "LR(1)"
}
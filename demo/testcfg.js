var testcfg = {
  "start": "Program",
  "bnf": {
    "Program": {
      "SourceElements $end": "\n            this.$$ = new Program($1);\n            setNodeName(this.$$);\n        ",
      "$end": "\n            this.$$ = new Program(0);\n        "
    },
    "SourceElements": {
      "SourceElements SourceElement": "\n            $1.childrens.push($2);\n            this.$$ = $1;\n        ",
      "SourceElement": "\n            this.$$ = new SourceElements($1);\n        "
    },
    "SourceElement": {
      "Statement": "",
      "FunctionDeclaration": ""
    },
    "Statement": {
      "Block": "",
      "VariableStatement": "",
      "EmptyStatement": "",
      "ExpressionStatement": "",
      "IfStatement": "",
      "IterationStatement": "",
      "ContinueStatement": "",
      "BreakStatement": "",
      "ReturnStatement": "",
      "WithStatement": "",
      "LabelledStatement": "",
      "SwitchStatement": "",
      "ThrowStatement": "",
      "TryStatement": ""
    },
    "FunctionDeclaration": {
      "FUNCTION IDENT ( ) FunctionBody": "\n            this.$$ = new FunctionDecl($2, 0, $5);\n        ",
      "FUNCTION IDENT ( FormalParameterList ) FunctionBody": "\n            this.$$ = new FunctionDecl($2, $4, $6);\n        "
    },
    "FunctionBody": {
      "{ }": "\n            this.$$ = new FunctionBody(0);\n        ",
      "{ SourceElements }": "\n            this.$$ = new FunctionBody($2);\n        "
    },
    "FormalParameterList": {
      "Ident": "\n            this.$$ = new Parameter($1);\n        ",
      "FormalParameterList , Ident": "\n            this.$$ = $1;\n            this.$$.push($2);\n        "
    },
    "Block": {
      "{ }": "\n            this.$$ = new Block(0);\n        ",
      "{ StatementList }": "\n            this.$$ = new Block($2);\n        "
    },
    "StatementList": {
      "StatementList Statement": "\n            $1.push($2);\n            this.$$ = $1;\n        ",
      "Statement": "\n            this.$$ = new StatementList($1);\n        "
    },
    "IfStatement": {
      "IF ( CommaExpression ) Statement": "\n            this.$$ = new IfStatement($3, $5, 0);\n        ",
      "IF ( CommaExpression ) Statement ELSE Statement": "\n            this.$$ = new IfStatement($3, $5, $7);\n        "
    },
    "EmptyStatement": {
      ";": ""
    },
    "ExpressionStatement": {
      "AssignmentExpression ;": "\n            this.$$ = $1;\n        "
    },
    "VariableStatement": {
      "VAR VariableDeclarationList ;": "\n            this.$$ = new VarStatement($2)\n        "
    },
    "VariableDeclarationList": {
      "VariableDeclarationList , VariableDeclaration": "\n            this.$$ = $1;\n            this.$$.childrens.push($3);\n        ",
      "VariableDeclaration": "\n            this.$$ = new VarDeclList($1);\n        "
    },
    "VariableDeclaration": {
      "Ident": "\n            this.$$ = new VarDecl($1, 0);\n        ",
      "Ident Initializer": "\n            this.$$ = new VarDecl($1, $2);\n        "
    },
    "Ident": {
      "IDENT": "\n            this.$$ = $1;\n        "
    },
    "Initializer": {
      "= AssignmentExpression": "\n            this.$$ = new AssignExpression($2);\n        "
    },
    "CommaExpression": {
      "AssignmentExpression": "\n            this.$$ = new CommaExpression($1);\n        ",
      "CommaExpression , AssignmentExpression": "\n            this.$$ = $1;\n            this.$$.push($3);\n        "
    },
    "AssignmentExpression": {
      "ConditionalExpression": ""
    },
    "AssignmentOperator": {
      "=": "",
      "+=": "",
      "-=": "",
      "/=": "",
      "*=": "",
      "<<=": "",
      ">>=": "",
      ">>>=": "",
      "&=": "",
      "^=": "",
      "|=": "",
      "%=": ""
    },
    "ConditionalExpression": {
      "LogicalORExpression ? AssignmentExpression : AssignmentExpression": "\n            this.$$ = new Conditional($1, $3, $5);\n        ",
      "LogicalORExpression": ""
    },
    "LogicalORExpression": {
      "LogicalANDExpression": "",
      "LogicalORExpression OR LogicalANDExpression": "\n            this.$$ = new BinaryLogical($1, $2, $3, true);\n        "
    },
    "LogicalANDExpression": {
      "BitwiseORExpression": ""
    },
    "BitwiseORExpression": {
      "BitwiseXORExpression": ""
    },
    "BitwiseXORExpression": {
      "BitwiseANDExpression": ""
    },
    "BitwiseANDExpression": {
      "EqualityExpression": ""
    },
    "EqualityExpression": {
      "RelationalExpression": "",
      "EqualityExpression == RelationalExpression": "\n            this.$$ = new EqualityExpression($1, $2, $3);\n        ",
      "EqualityExpression != RelationalExpression": "\n            this.$$ = new EqualityExpression($1, $2, $3);\n        ",
      "EqualityExpression === RelationalExpression": "\n            this.$$ = new EqualityExpression($1, $2, $3);\n        ",
      "EqualityExpression !== RelationalExpression": "\n            this.$$ = new EqualityExpression($1, $2, $3);\n        "
    },
    "RelationalExpression": {
      "ShiftExpression": ""
    },
    "ShiftExpression": {
      "AdditiveExpression": ""
    },
    "AdditiveExpression": {
      "MultiplicativeExpression": ""
    },
    "MultiplicativeExpression": {
      "UnaryExpression": ""
    },
    "UnaryExpression": {
      "PostfixExpression": ""
    },
    "PostfixExpression": {
      "LeftHandSideExpression": ""
    },
    "LeftHandSideExpression": {
      "NewExpression": "",
      "CallExpression": ""
    },
    "NewExpression": {
      "MemberExpression": "",
      "NEW NewExpression": "\n            this.$$ = new NewExpression($2);\n        ",
      "NEW MemberExpression Arguments": "\n            this.$$ = new NewExpression($2, $3);\n        "
    },
    "Arguments": {
      "( )": "\n            this.$$ = new Arguments(0);\n        ",
      "( ArgumentList )": "\n            this.$$ = new Arguments($2);\n        "
    },
    "ArgumentList": {
      "AssignmentExpression": "\n            this.$$ = new ArgumentList($1);\n        ",
      "ArgumentList , AssignmentExpression": "\n            this.$$ = $1;\n            this.$$.push($3);\n        "
    },
    "MemberExpression": {
      "PrimaryExpression": "",
      "FunctionExpression": "",
      "MemberExpression [ CommaExpression ]": "\n            this.$$ = new BracketAccessor($1, $3);\n        ",
      "MemberExpression . IdentifierName": "\n            this.$$ = new DotAccessor($1, $3);\n        "
    },
    "IdentifierName": {
      "IDENT": "",
      "BREAK": "",
      "CASE": "",
      "CATCH": "",
      "CONTINUE": "",
      "DEFAULT": "",
      "DELETE": "",
      "DO": "",
      "ELSE": "",
      "FALSE": "",
      "FINALLY": "",
      "FOR": "",
      "FUNCTION": "",
      "GET": "",
      "IF": "",
      "IN": "",
      "INSTANCEOF": "",
      "NEW": "",
      "NULL": "",
      "RETURN": "",
      "SET": "",
      "SWITCH": "",
      "THIS": "",
      "THROW": "",
      "TRUE": "",
      "TRY": "",
      "TYPEOF": "",
      "VAR": "",
      "CONST": "",
      "VOID": "",
      "WHILE": "",
      "WITH": ""
    },
    "FunctionExpression": {
      "FUNCTION ( ) FunctionBody": "\n            this.$$ = new FunctionExpression(0, $4);\n        ",
      "FUNCTION ( FormalParameterList ) FunctionBody": "\n            this.$$ = new FunctionExpression($3, $5);\n        ",
      "FUNCTION IDENT ( ) FunctionBody": "\n            this.$$ = new FunctionExpression(0, $5, $2);\n        ",
      "FUNCTION IDENT ( FormalParameterList ) FunctionBody": "\n            this.$$ = new FunctionExpression($4, $6, $2);\n        "
    },
    "PrimaryExpression": {
      "Literal": ""
    },
    "Literal": {
      "IDENT": "",
      "NULL": "",
      "TRUE": "",
      "FALSE": "",
      "NUMBER": "",
      "STRING": ""
    }
  },
  "code": "\n\nfunction Program(x){\n    this.childrens = [x];\n}\nfunction SourceElements(x){\n    this.childrens = [x];\n}\nfunction Block(x){\n    this.childrens = [!!x ? x : 0];\n}\nfunction StatementList(x){\n    this.childrens = [x];\n}\nfunction VarStatement(x){\n    this.childrens = [x];\n}\nfunction IfStatement(x, y, z){\n    this.childrens = [x, y, z];\n}\nfunction VarDeclList(x){\n    this.childrens = [x];\n}\nfunction VarDecl(x, y){\n    this.childrens = [x, y];\n}\nfunction CommaExpression(x){\n    this.childrens = [x];\n}\nfunction AssignExpression(x){\n    this.childrens = [x];\n}\nfunction EqualityExpression(x, y, z){\n    this.childrens = [x, y, z];\n}\nfunction Arguments(argumentList){\n    this.childrens = [argumentList];\n}\nfunction ArgumentList(assignmentExpression){\n    this.childrens = [assignmentExpression];\n}\n\nfunction BracketAccessor(memberExpression, commaExpression){\n    this.childrens = [memberExpression, commaExpression];\n}\nfunction DotAccessor(memberExpression, identifierName){\n    this.childrens = [memberExpression, identifierName];\n}\n\n\nfunction FuncitonDecl(x, y, z){\n    this.childrens = [x, y, z];\n}\n\nfunction FunctionExpression(params, block, name){\n    this.childrens = [params, block, name];\n}\n\nfunction Parameter(x){\n    this.childrens = [x];\n}\nfunction FunctionBody(x){\n    this.childrens = [x];\n}\n\nfunction setNodeName(node){\n    var childrens;\n    if(node){\n        if(node.constructor !== Object){\n            node.nodeName = node.constructor.name;\n            childrens = node.childrens;\n            delete node.childrens;\n            node.childrens = childrens;\n        }\n        if(node.childrens){\n            for(var i=0; i<node.childrens.length; i++){\n                setNodeName(node.childrens[i]);\n            }\n        }\n    }\n}\n\n\nglobal.jsparser = parser;\n",
  "lex": {
    "rules": [
      {
        "regex": "/^\\/\\/[^\\n]*/",
        "action": "                  /* skip singleline comment */"
      },
      {
        "regex": "/^\\/\\*(.|\\n|\\r)*?\\*\\//",
        "action": "         /* skip multiline comment */ "
      },
      {
        "regex": "/^\"(\\\\\"|[^\"])*\"/",
        "action": "               return \"STRING\";"
      },
      {
        "regex": "/^'(\\\\'|[^'])*'/",
        "action": "               return \"STRING\";"
      },
      {
        "regex": "/^((0|[1-9][0-9]*)(\\.[0-9]*)?|\\.[0-9]+)([eE][+-]?[0-9]+)?|[0][xX][0-9a-fA-F]+/",
        "action": "   return \"NUMBER\""
      },
      {
        "regex": "/^>>>=/",
        "action": "                        return \">>>=\";  //URSHIFT EQUAL"
      },
      {
        "regex": "/^!==/",
        "action": "                         return \"!==\";   //STRNEX"
      },
      {
        "regex": "/^===/",
        "action": "                         return \"===\";   //STREQ"
      },
      {
        "regex": "/^>>>/",
        "action": "                         return \">>>\";   //URSHIFT"
      },
      {
        "regex": "/^\\<<=/",
        "action": "                        return \"<<=\";   //LSHIFT EQUAL"
      },
      {
        "regex": "/^>>=/",
        "action": "                         return \">>=\";   //RSHIFT EQUAL"
      },
      {
        "regex": "/^%=/",
        "action": "                          return \"%=\";    //MOD EQUAL"
      },
      {
        "regex": "/^&&/",
        "action": "                          return \"&&\";    //AND"
      },
      {
        "regex": "/^&=/",
        "action": "                          return \"&=\";    //AND EQUAL"
      },
      {
        "regex": "/^\\*=/",
        "action": "                         return \"*=\";    //MULT EQUAL"
      },
      {
        "regex": "/^\\+\\+/",
        "action": "                        return \"++\";    //PLUS PLUS"
      },
      {
        "regex": "/^\\+=/",
        "action": "                         return \"+=\";    //PLUS EQUAL"
      },
      {
        "regex": "/^--/",
        "action": "                          return \"--\";    //MINUS MINUS"
      },
      {
        "regex": "/^-=/",
        "action": "                          return \"-=\";    //MINUS EQUAL"
      },
      {
        "regex": "/^\\/=/",
        "action": "                         return \"/=\";    //DIV EQUAL"
      },
      {
        "regex": "/^\\<</",
        "action": "                          return \"<<\";    //LSHIFT"
      },
      {
        "regex": "/^\\<=/",
        "action": "                          return \"<=\";    //LE"
      },
      {
        "regex": "/^>=/",
        "action": "                          return \">=\";    //GE"
      },
      {
        "regex": "/^==/",
        "action": "                          return \"==\";    //EQEQ"
      },
      {
        "regex": "/^>>/",
        "action": "                          return \">>\";    //RSHIFT"
      },
      {
        "regex": "/^\\^=/",
        "action": "                         return \"^=\";    //XOR EQUAL"
      },
      {
        "regex": "/^\\|=/",
        "action": "                         return \"|=\";    //OR EQUAL"
      },
      {
        "regex": "/^\\|\\|/",
        "action": "                        return \"||\";    //OR"
      },
      {
        "regex": "/^&/",
        "action": "                           return \"&\";     //LOGIC AND"
      },
      {
        "regex": "/^%/",
        "action": "                           return \"%\";     //MOD"
      },
      {
        "regex": "/^!=/",
        "action": "                          return \"!=\";    //NE"
      },
      {
        "regex": "/^\\=/",
        "action": "                          return \"=\";"
      },
      {
        "regex": "/^\\(/",
        "action": "                          return \"(\";"
      },
      {
        "regex": "/^\\)/",
        "action": "                          return \")\";"
      },
      {
        "regex": "/^\\+/",
        "action": "                          return \"+\";"
      },
      {
        "regex": "/^\\*/",
        "action": "                          return \"*\";"
      },
      {
        "regex": "/^\\,/",
        "action": "                          return \",\";"
      },
      {
        "regex": "/^\\-/",
        "action": "                          return \"-\";"
      },
      {
        "regex": "/^\\!/",
        "action": "                          return \"!\";"
      },
      {
        "regex": "/^\\./",
        "action": "                          return \".\";"
      },
      {
        "regex": "/^\\//",
        "action": "                          return \"/\";"
      },
      {
        "regex": "/^:/",
        "action": "                           return \":\";"
      },
      {
        "regex": "/^\\;/",
        "action": "                          return \";\";"
      },
      {
        "regex": "/^\\</",
        "action": "                          return \"<\";"
      },
      {
        "regex": "/^>/",
        "action": "                           return \">\";"
      },
      {
        "regex": "/^\\?/",
        "action": "                          return \"?\";"
      },
      {
        "regex": "/^\\[/",
        "action": "                          return \"[\";"
      },
      {
        "regex": "/^\\]/",
        "action": "                          return \"]\";"
      },
      {
        "regex": "/^\\^/",
        "action": "                          return \"^\";"
      },
      {
        "regex": "/^\\{/",
        "action": "                          return \"{\";"
      },
      {
        "regex": "/^\\}/",
        "action": "                          return \"}\";"
      },
      {
        "regex": "/^\\|/",
        "action": "                          return \"|\";"
      },
      {
        "regex": "/^\\~/",
        "action": "                          return \"~\";"
      },
      {
        "regex": "/^\\&/",
        "action": "                          return \"&\";"
      },
      {
        "regex": "/^break/",
        "action": "                       return \"BREAK\";"
      },
      {
        "regex": "/^case/",
        "action": "                        return \"CASE\";"
      },
      {
        "regex": "/^catch/",
        "action": "                       return \"CATCH\";"
      },
      {
        "regex": "/^continue/",
        "action": "                    return \"CONTINUE\";"
      },
      {
        "regex": "/^default/",
        "action": "                     return \"DEFAULT\";"
      },
      {
        "regex": "/^delete/",
        "action": "                      return \"DELETE\";"
      },
      {
        "regex": "/^do/",
        "action": "                          return \"DO\";"
      },
      {
        "regex": "/^else/",
        "action": "                        return \"ELSE\";"
      },
      {
        "regex": "/^false/",
        "action": "                       return \"FALSE\";"
      },
      {
        "regex": "/^finally/",
        "action": "                     return \"FINALLY\";"
      },
      {
        "regex": "/^for/",
        "action": "                         return \"FOR\";"
      },
      {
        "regex": "/^function/",
        "action": "                    return \"FUNCTION\";"
      },
      {
        "regex": "/^get/",
        "action": "                         return \"GET\";"
      },
      {
        "regex": "/^if/",
        "action": "                          return \"IF\";"
      },
      {
        "regex": "/^in/",
        "action": "                          return \"IN\";"
      },
      {
        "regex": "/^instanceof/",
        "action": "                  return \"INSTANCEOF\";"
      },
      {
        "regex": "/^new/",
        "action": "                         return \"NEW\";"
      },
      {
        "regex": "/^return/",
        "action": "                      return \"RETURN\";"
      },
      {
        "regex": "/^set/",
        "action": "                         return \"SET\";"
      },
      {
        "regex": "/^switch/",
        "action": "                      return \"SWITCH\";"
      },
      {
        "regex": "/^this/",
        "action": "                        return \"THIS\";"
      },
      {
        "regex": "/^throw/",
        "action": "                       return \"THROW\";"
      },
      {
        "regex": "/^true/",
        "action": "                        return \"TRUE\";"
      },
      {
        "regex": "/^try/",
        "action": "                         return \"TRY\";"
      },
      {
        "regex": "/^typeof/",
        "action": "                      return \"TYPEOF\";"
      },
      {
        "regex": "/^var/",
        "action": "                         return \"VAR\";"
      },
      {
        "regex": "/^const/",
        "action": "                       return \"CONST\";"
      },
      {
        "regex": "/^void/",
        "action": "                        return \"VOID\";"
      },
      {
        "regex": "/^while/",
        "action": "                       return \"WHILE\";"
      },
      {
        "regex": "/^whith/",
        "action": "                       return \"WHITH\";"
      },
      {
        "regex": "/^[A-Za-z$_]\\w*/",
        "action": "               return \"IDENT\";"
      },
      {
        "regex": "/^\\s+/",
        "action": "                         /* skip whitespace */"
      },
      {
        "regex": "/^\\n/",
        "action": "                          /* skip lineterminal */"
      },
      {
        "regex": "/^./",
        "action": "                           return \"INVALID\";"
      }
    ],
    "states": {
      "exclusive": {}
    }
  },
  "type": "LR(1)"
}
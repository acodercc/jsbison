var testcfg = {
  "start": "Program",
  "bnf": {
    "Program": {
      "SourceElements $end": "\n            this.$$ = new Program($1);\n            setType(this.$$);\n        ",
      "$end": "\n            this.$$ = new Program(0);\n        "
    },
    "SourceElements": {
      "SourceElements SourceElement": "\n            this.$$ = $1;\n            this.$$.push($2);\n        ",
      "SourceElement": "\n            this.$$ = [$1];\n        "
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
      "FUNCTION Identifier ( ) FunctionBody": "\n            this.$$ = new FunctionDeclaration($2, 0, $5);\n        ",
      "FUNCTION Identifier ( FormalParameterList ) FunctionBody": "\n            this.$$ = new FunctionDeclaration($2, $4, $6);\n        "
    },
    "FunctionBody": {
      "{ }": "\n            this.$$ = new FunctionBody(0);\n        ",
      "{ SourceElements }": "\n            this.$$ = new FunctionBody($2);\n        "
    },
    "FormalParameterList": {
      "Identifier": "\n            this.$$ = [$1];\n        ",
      "FormalParameterList , Identifier": "\n            this.$$ = $1;\n            this.$$.push($3);\n        "
    },
    "Block": {
      "{ }": "\n            this.$$ = new Block(0);\n        ",
      "{ StatementList }": "\n            this.$$ = new Block($2);\n        "
    },
    "StatementList": {
      "StatementList Statement": "\n            $1.push($2);\n            this.$$ = $1;\n        ",
      "Statement": "\n            this.$$ = new StatementList($1);\n        "
    },
    "VariableStatement": {
      "VAR VariableDeclarationList ;": "\n            this.$$ = $2;\n        "
    },
    "IfStatement": {
      "IF ( CommaExpression ) Statement": "\n            this.$$ = new IfStatement($3, $5, 0);\n        ",
      "IF ( CommaExpression ) Statement ELSE Statement": "\n            this.$$ = new IfStatement($3, $5, $7);\n        "
    },
    "IterationStatement": {
      "DO Statement WHILE ( CommaExpression ) ;": "\n            this.$$ = new DoWhileStatement($2, $5);\n        ",
      "WHILE ( CommaExpression ) Statement": "\n            this.$$ = new WhileStatement($3, $5);\n        ",
      "FOR ( Identifier IN CommaExpression ) Statement": "\n            this.$$ = new ForInStatement($3, $5, $7);\n        ",
      "FOR ( LeftHandSideExpression IN CommaExpression ) Statement": "\n            this.$$ = new ForInStatement($3, $5, $7);\n        ",
      "FOR ( VAR Identifier IN CommaExpression ) Statement": "\n            this.$$ = new ForInStatement($4, $6, $8);\n        ",
      "FOR ( VAR VariableDeclarationNoIn IN CommaExpression ) Statement": "\n            this.$$ = new ForInStatement($4, $6, $8);\n        ",
      "FOR ( ExpressionNoInOpt ; ExpressionOpt ; ExpressionOpt ) Statement": "\n            this.$$ = new ForStatement($3, $5, $7, $9);\n        ",
      "FOR ( VAR VariableDeclarationListNoIn ; ExpressionOpt ; ExpressionOpt ) Statement": "\n            this.$$ = new ForStatement($4, $6, $8, $10);\n        "
    },
    "ContinueStatement": {
      "CONTINUE ;": "\n            this.$$ = new ContinueStatement(undefined);\n        "
    },
    "BreakStatement": {
      "BREAK ;": "\n            this.$$ = new BreakStatement(undefined);\n        "
    },
    "ReturnStatement": {
      "RETURN ;": "\n            this.$$ = new ReturnStatement(undefined);\n        ",
      "RETURN CommaExpression ;": "\n            this.$$ = new ReturnStatement($2);\n        "
    },
    "WithStatement": {
      "WITH ( CommaExpression ) Statement": "\n            this.$$ = new WithStatement($3, $5);\n        "
    },
    "LabelledStatement": {
      "IDENT : Statement": "\n            this.$$ = new LabelledStatement($1, $3);\n        "
    },
    "SwitchStatement": {
      "SWITCH ( CommaExpression ) CaseBlock": "\n            this.$$ = new SwitchStatement($3, $5);\n        "
    },
    "ThrowStatement": {
      "THROW CommaExpression ;": "\n            this.$$ = new ThrowStatement($2);\n        "
    },
    "TryStatement": {
      "TRY Block Catch": "\n            this.$$ = new TryStatement($2, $3, 0);\n        ",
      "TRY Block Finally": "\n            this.$$ = new TryStatement($2, 0, $3);\n        ",
      "TRY Block Catch Finally": "\n            this.$$ = new TryStatement($2, $3, $4);\n        "
    },
    "Catch": {
      "CATCH ( IDENT ) Block": "\n            this.$$ = new Catch($3, $5);\n        "
    },
    "Finally": {
      "FINALLY Block": "\n            this.$$ = new Finally($2);\n        "
    },
    "CaseBlock": {
      "{ CaseClausesOpt }": "\n            this.$$ = new CaseBlock($2, 0, 0);\n        ",
      "{ CaseClausesOpt DefaultClause CaseClausesOpt }": "\n            this.$$ = new CaseBlock($2, $3, $4);\n        "
    },
    "CaseClausesOpt": {
      "": "\n            this.$$ = 0;\n        ",
      "CaseClauses": ""
    },
    "CaseClauses": {
      "CASE CommaExpression : StatementListOpt": "\n            this.$$ = new CaseClause($2, $4);\n        "
    },
    "DefaultClause": {
      "DEFAULT : StatementListOpt": "\n            this.$$ = new CaseClause(0, $3);\n        "
    },
    "StatementListOpt": {
      "": "\n            this.$$ = 0;\n        ",
      "StatementList": ""
    },
    "ExpressionOpt": {
      "": "\n            this.$$ = 0;\n        ",
      "CommaExpression": ""
    },
    "ExpressionNoInOpt": {
      "": "\n            this.$$ = 0;\n        ",
      "ExpressionNoIn": "\n            this.$$ = $1;\n        "
    },
    "ExpressionNoIn": {
      "AssignmentExpressionNoIn": "\n            this.$$ = [$1];\n        ",
      "ExpressionNoIn , AssignmentExpressionNoIn": "\n            this.$$ = $1;\n            this.$$.push($3);\n        "
    },
    "EmptyStatement": {
      ";": ""
    },
    "ExpressionStatement": {
      "CommaExpression ;": "\n            this.$$ = new ExpressionStatement($1);\n        "
    },
    "VariableDeclarationList": {
      "VariableDeclarationList , VariableDeclaration": "\n            this.$$ = $1;\n            this.$$.push($3);\n        ",
      "VariableDeclaration": "\n            this.$$ = [$1];\n        "
    },
    "VariableDeclarationListNoIn": {
      "VariableDeclarationListNoIn , VariableDeclarationNoIn": "\n            this.$$ = $1;\n            this.$$.push($3);\n        ",
      "VariableDeclarationNoIn": "\n            this.$$ = [$1];\n        "
    },
    "VariableDeclaration": {
      "Identifier": "\n            this.$$ = new VariableDeclaration($1, 0);\n        ",
      "Identifier Initializer": "\n            this.$$ = new VariableDeclaration($1, $2);\n        "
    },
    "VariableDeclarationNoIn": {
      "Identifier": "\n            this.$$ = new VariableDeclaration($1, 0);\n        ",
      "Identifier InitializerNoIn": "\n            this.$$ = new VariableDeclaration($1, $2);\n        "
    },
    "Initializer": {
      "= AssignmentExpression": "\n            this.$$ = $2;\n        "
    },
    "InitializerNoIn": {
      "= AssignmentExpressionNoIn": "\n            this.$$ = $2;\n        "
    },
    "CommaExpression": {
      "AssignmentExpression": "\n            this.$$ = [$1];\n        ",
      "CommaExpression , AssignmentExpression": "\n            this.$$ = $1;\n            this.$$.push($3);\n        "
    },
    "AssignmentExpression": {
      "ConditionalExpression": "",
      "LeftHandSideExpression AssignmentOperator AssignmentExpression": "\n            this.$$ = new AssignmentExpression($1, $2, $3);\n        "
    },
    "AssignmentExpressionNoIn": {
      "ConditionalExpressionNoIn": "",
      "LeftHandSideExpression AssignmentOperator AssignmentExpressionNoIn": "\n            this.$$ = new AssignmentExpression($1, $2, $3);\n        "
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
      "LogicalORExpression ? AssignmentExpression : AssignmentExpression": "\n            this.$$ = new ConditionalExpression($1, $3, $5);\n        ",
      "LogicalORExpression": ""
    },
    "ConditionalExpressionNoIn": {
      "LogicalORExpressionNoIn ? AssignmentExpression : AssignmentExpressionNoIn": "\n            this.$$ = new ConditionalExpression($1, $3, $5);\n        ",
      "LogicalORExpressionNoIn": ""
    },
    "LogicalORExpression": {
      "LogicalANDExpression": "",
      "LogicalORExpression || LogicalANDExpression": "\n            this.$$ = new BinaryExpression($1, $2, $3);\n        "
    },
    "LogicalORExpressionNoIn": {
      "LogicalANDExpressionNoIn": "",
      "LogicalORExpressionNoIn || LogicalANDExpressionNoIn": "\n            this.$$ = new BinaryExpression($1, $2, $3);\n        "
    },
    "LogicalANDExpression": {
      "BitwiseORExpression": "",
      "LogicalANDExpression && BitwiseORExpression": "\n            this.$$ = new BinaryExpression($1, $2, $3);\n        "
    },
    "LogicalANDExpressionNoIn": {
      "BitwiseORExpressionNoIn": "",
      "LogicalANDExpressionNoIn && BitwiseORExpressionNoIn": "\n            this.$$ = new BinaryExpression($1, $2, $3);\n        "
    },
    "BitwiseORExpression": {
      "BitwiseXORExpression": "",
      "BitwiseORExpression | BitwiseXORExpression": "\n            this.$$ = new BinaryExpression($1, $2, $3);\n        "
    },
    "BitwiseORExpressionNoIn": {
      "BitwiseXORExpressionNoIn": "",
      "BitwiseORExpressionNoIn | BitwiseXORExpressionNoIn": "\n            this.$$ = new BinaryExpression($1, $2, $3);\n        "
    },
    "BitwiseXORExpression": {
      "BitwiseANDExpression": "",
      "BitwiseXORExpression ^ BitwiseANDExpression": "\n            this.$$ = new BinaryExpression($1, $2, $3);\n        "
    },
    "BitwiseXORExpressionNoIn": {
      "BitwiseANDExpressionNoIn": "",
      "BitwiseXORExpressionNoIn ^ BitwiseANDExpressionNoIn": "\n            this.$$ = new BinaryExpression($1, $2, $3);\n        "
    },
    "BitwiseANDExpression": {
      "EqualityExpression": "",
      "BitwiseANDExpression & EqualityExpression": "\n            this.$$ = new BinaryExpression($1, $2, $3);\n        "
    },
    "BitwiseANDExpressionNoIn": {
      "EqualityExpressionNoIn": "",
      "BitwiseANDExpressionNoIn & EqualityExpressionNoIn": "\n            this.$$ = new BinaryExpression($1, $2, $3);\n        "
    },
    "EqualityExpression": {
      "RelationalExpression": "",
      "EqualityExpression == RelationalExpression": "\n            this.$$ = new BinaryExpression($1, $2, $3);\n        ",
      "EqualityExpression != RelationalExpression": "\n            this.$$ = new BinaryExpression($1, $2, $3);\n        ",
      "EqualityExpression === RelationalExpression": "\n            this.$$ = new BinaryExpression($1, $2, $3);\n        ",
      "EqualityExpression !== RelationalExpression": "\n            this.$$ = new BinaryExpression($1, $2, $3);\n        "
    },
    "EqualityExpressionNoIn": {
      "RelationalExpressionNoIn": "",
      "EqualityExpressionNoIn == RelationalExpressionNoIn": "\n            this.$$ = new BinaryExpression($1, $2, $3);\n        ",
      "EqualityExpressionNoIn != RelationalExpressionNoIn": "\n            this.$$ = new BinaryExpression($1, $2, $3);\n        ",
      "EqualityExpressionNoIn === RelationalExpressionNoIn": "\n            this.$$ = new BinaryExpression($1, $2, $3);\n        ",
      "EqualityExpressionNoIn !== RelationalExpressionNoIn": "\n            this.$$ = new BinaryExpression($1, $2, $3);\n        "
    },
    "RelationalExpression": {
      "RelationalExpression < ShiftExpression": "\n            this.$$ = new BinaryExpression($1, $2, $3);\n        ",
      "RelationalExpression > ShiftExpression": "\n            this.$$ = new BinaryExpression($1, $2, $3);\n        ",
      "RelationalExpression <= ShiftExpression": "\n            this.$$ = new BinaryExpression($1, $2, $3);\n        ",
      "RelationalExpression >= ShiftExpression": "\n            this.$$ = new BinaryExpression($1, $2, $3);\n        ",
      "RelationalExpression instanceof ShiftExpression": "\n            this.$$ = new BinaryExpression($1, $2, $3);\n        ",
      "RelationalExpression in ShiftExpression": "\n            this.$$ = new BinaryExpression($1, $2, $3);\n        ",
      "ShiftExpression": ""
    },
    "RelationalExpressionNoIn": {
      "RelationalExpressionNoIn < ShiftExpression": "\n            this.$$ = new BinaryExpression($1, $2, $3);\n        ",
      "RelationalExpressionNoIn > ShiftExpression": "\n            this.$$ = new BinaryExpression($1, $2, $3);\n        ",
      "RelationalExpressionNoIn <= ShiftExpression": "\n            this.$$ = new BinaryExpression($1, $2, $3);\n        ",
      "RelationalExpressionNoIn >= ShiftExpression": "\n            this.$$ = new BinaryExpression($1, $2, $3);\n        ",
      "RelationalExpressionNoIn instanceof ShiftExpression": "\n            this.$$ = new BinaryExpression($1, $2, $3);\n        ",
      "ShiftExpression": ""
    },
    "ShiftExpression": {
      "AdditiveExpression": "",
      "ShiftExpression << AdditiveExpression": "\n            this.$$ = new BinaryExpression($1, $2, $3);\n        ",
      "ShiftExpression >> AdditiveExpression": "\n            this.$$ = new BinaryExpression($1, $2, $3);\n        ",
      "ShiftExpression >>> AdditiveExpression": "\n            this.$$ = new BinaryExpression($1, $2, $3);\n        "
    },
    "AdditiveExpression": {
      "MultiplicativeExpression": "",
      "AdditiveExpression + MultiplicativeExpression": "\n            this.$$ = new BinaryExpression($1, $2, $3);\n        ",
      "AdditiveExpression - MultiplicativeExpression": "\n            this.$$ = new BinaryExpression($1, $2, $3);\n        "
    },
    "MultiplicativeExpression": {
      "UnaryExpression": "",
      "MultiplicativeExpression * UnaryExpression": "\n            this.$$ = new BinaryExpression($1, $2, $3);\n        ",
      "MultiplicativeExpression / UnaryExpression": "\n            this.$$ = new BinaryExpression($1, $2, $3);\n        ",
      "MultiplicativeExpression % UnaryExpression": "\n            this.$$ = new BinaryExpression($1, $2, $3);\n        "
    },
    "UnaryExpression": {
      "PostfixExpression": "",
      "DELETE UnaryExpression": "\n            this.$$ = new UnaryExpression($1, $2);\n        ",
      "VOID UnaryExpression": "\n            this.$$ = new UnaryExpression($1, $2);\n        ",
      "TYPEOF UnaryExpression": "\n            this.$$ = new UnaryExpression($1, $2);\n        ",
      "++ UnaryExpression": "\n            this.$$ = new UpdateExpression($1, $2, true);\n        ",
      "-- UnaryExpression": "\n            this.$$ = new UpdateExpression($1, $2, true);\n        ",
      "+ UnaryExpression": "\n            this.$$ = new UnaryExpression($1, $2);\n        ",
      "- UnaryExpression": "\n            this.$$ = new UnaryExpression($1, $2);\n        ",
      "~ UnaryExpression": "\n            this.$$ = new UnaryExpression($1, $2);\n        ",
      "! UnaryExpression": "\n            this.$$ = new UnaryExpression($1, $2);\n        "
    },
    "PostfixExpression": {
      "LeftHandSideExpression": "",
      "LeftHandSideExpression ++": "\n            this.$$ = new UpdateExpression($2, $1, false);\n        ",
      "LeftHandSideExpression --": "\n            this.$$ = new UpdateExpression($2, $1, false);\n        "
    },
    "LeftHandSideExpression": {
      "NewExpression": "",
      "CallExpression": ""
    },
    "CallExpression": {
      "MemberExpression Arguments": "\n            this.$$ = new CallExpression($1, $2);\n        ",
      "CallExpression Arguments": "\n            this.$$ = new CallExpression($1, $2);\n        ",
      "CallExpression [ CommaExpression ]": "\n            this.$$ = new MemberExpression($1, $3);\n        ",
      "CallExpression . Identifier": "\n            this.$$ = new MemberExpression($1, $3);\n        "
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
      "AssignmentExpression": "\n            this.$$ = [$1];\n        ",
      "ArgumentList , AssignmentExpression": "\n            this.$$ = $1;\n            this.$$.push($3);\n        "
    },
    "MemberExpression": {
      "PrimaryExpression": "",
      "FunctionExpression": "",
      "MemberExpression [ CommaExpression ]": "\n            this.$$ = new MemberExpression($1, $3);\n        ",
      "MemberExpression . IdentifierName": "\n            this.$$ = new MemberExpression($1, $3);\n        "
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
      "FUNCTION Identifier ( ) FunctionBody": "\n            this.$$ = new FunctionExpression(0, $5, $2);\n        ",
      "FUNCTION Identifier ( FormalParameterList ) FunctionBody": "\n            this.$$ = new FunctionExpression($4, $6, $2);\n        "
    },
    "Identifier": {
      "IDENT": "\n            this.$$ = new Identifier($1);\n        "
    },
    "PrimaryExpression": {
      "Literal": ""
    },
    "Literal": {
      "Identifier": "\n            this.$$ = $1;\n        ",
      "NULL": "",
      "TRUE": "",
      "FALSE": "",
      "NUMBER": "\n            this.$$ = new Literal($1, 'NUMBER');\n        ",
      "STRING": "\n            this.$$ = new Literal($1, 'STRING');\n        "
    }
  },
  "code": "\n\nfunction Program(body){\n    this.body = body;\n    this.childrens = [body];\n}\nfunction SourceElements(sourceElement){\n    this.childrens = [sourceElement];\n}\nfunction Block(sourceElements){\n    this.childrens = [!!sourceElements ? sourceElements : 0];\n}\nfunction StatementList(statement){\n    this.childrens = [statement];\n}\nfunction VarStatement(name){\n    this.childrens = [name];\n}\nfunction IfStatement(expression, ifStatement, elseStatement){\n    this.childrens = [expression, ifStatement, elseStatement];\n}\nfunction DoWhileStatement(statement, expr){\n    this.statement = statement;\n    this.expr = expr;\n    this.childrens = [statement, expr];\n}\nfunction WhileStatement(expr, statement){\n    this.expr = expr;\n    this.statement = statement;\n    this.childrens = [expr, statement];\n}\nfunction ForInStatement(left, right, statement){\n    this.left = left;\n    this.right = right;\n    this.statement = statement;\n    this.childrens = [left, right, statement];\n}\nfunction ForStatement(expr1, expr2, expr3, statement){\n    this.expr1 = expr1;\n    this.expr2 = expr2;\n    this.expr3 = expr3;\n    this.statement = statement;\n    this.childrens = [expr1, expr2, expr3, statement];\n}\nfunction ExpressionStatement(expression){\n    this.childrens = [expression];\n}\nfunction ContinueStatement(ident){\n    this.ident = ident;\n    this.childrens = [ident];\n}\nfunction BreakStatement(ident){\n    this.ident = ident;\n    this.childrens = [ident];\n}\nfunction ReturnStatement(expr){\n    this.expr = expr;\n    this.childrens = [expr];\n}\nfunction WithStatement(object, statement){\n    this.object = object;\n    this.statement = statement;\n    this.childrens = [object, statement];\n}\nfunction LabelledStatement(ident, statement){\n    this.ident = ident;\n    this.statement = statement;\n    this.childrens = [ident, statement];\n}\nfunction SwitchStatement(expr, caseblock){\n    this.expr = expr;\n    this.caseblock = caseblock;\n    this.childrens = [expr, caseblock];\n}\nfunction ThrowStatement(expr){\n    this.expr = expr;\n    this.childrens = [expr];\n}\nfunction TryStatement(block, catchBlock, finallyBlock){\n    this.block = block;\n    this.catchBlock = catchBlock;\n    this.finallyBlock = finallyBlock;\n    this.childrens = [block, catchBlock, finallyBlock];\n}\nfunction Catch(block){\n    this.block = block;\n    this.childrens = [block];\n}\nfunction Finally(block){\n    this.block = block;\n    this.childrens = [block];\n}\nfunction CaseBlock(opts1, defs, opts2){\n    this.opts1 = opts1;\n    this.defs = defs;\n    this.opts2 = opts2;\n    this.childrens = [opts1, defs, opts2];\n}\nfunction CaseClause(expr, statementlist){\n    this.expr = expr;\n    this.statementlist = statementlist;\n    this.childrens = [expr, statementlist];\n}\nfunction VariableDeclarationList(varDeclaration){\n    this.childrens = [varDeclaration];\n}\nfunction VariableDeclaration(id, init){\n    this.id = id;\n    this.init = init;\n    this.childrens = [id, init];\n}\nfunction CommaExpression(assignExpression){\n    this.childrens = [assignExpression];\n}\nfunction AssignmentExpression(left, op, right){\n    this.childrens = [left, op, right];\n}\nfunction ConditionalExpression(test, consequent, alternate){\n    this.test = test;\n    this.consequent = consequent;\n    this.alternate = alternate;\n    this.childrens = [test, consequent, alternate]; \n}\nfunction BinaryExpression(left, operator, right){\n    this.left = left;\n    this.operator = operator;\n    this.right = right;\n    this.childrens = [left, operator, right];\n}\nfunction UnaryExpression(operator, augument){\n    this.operator = operator;\n    this.augument = augument;\n    this.childrens = [operator, augument];\n}\nfunction UpdateExpression(operator, augument, prefix){\n    this.operator = operator;\n    this.augument = augument;\n    this.prefix = prefix;\n    this.childrens = [operator, augument, prefix];\n}\nfunction Arguments(argumentList){\n    this.childrens = [argumentList];\n}\nfunction ArgumentList(assignmentExpression){\n    this.childrens = [assignmentExpression];\n}\nfunction MemberExpression(object, property){\n    this.object = object;\n    this.property = property;\n    this.childrens = [object, property];\n}\nfunction FunctionDeclaration(id, args, body){\n    this.id = id;\n    this.args = args;\n    this.body = body;\n    this.childrens = [id, args, body];\n}\n\nfunction FunctionExpression(params, block, name){\n    this.childrens = [params, block, name];\n}\n\nfunction NewExpression(func, args){\n    this.func = func;\n    this.args = args;\n    this.childrens = [func, args];\n}\nfunction CallExpression(func, args){\n    this.func = func;\n    this.args = args;\n    this.childrens = [func, args];\n}\n\nfunction Parameter(param){\n    this.childrens = [param];\n}\nfunction FunctionBody(sourceElements){\n    this.sourceElements = sourceElements;\n    this.childrens = [sourceElements];\n}\nfunction Identifier(name){\n    this.name = name;\n    this.childrens = [name];\n}\nfunction Literal(raw, type){\n    this.raw = raw;\n    switch(type){\n        case 'NUMBER':\n            this.value = Number(raw);\n            break;\n        case 'STRING':\n            this.value = eval(raw);\n            break;\n    }\n    this.childrens = [raw];\n}\n\n/**\n * set type is function.constructor\n * set type is node first property\n */\nfunction setType(node){\n    var childrens;\n    if(node){\n        if(node.constructor !== Object && node.constructor !== Array && node instanceof Object){\n            if(node.type === undefined){\n                node.type = node.constructor.name;\n            }\n            Object.keys(node).forEach(function(prop){\n                var val = node[prop];\n                if(prop !== 'type'){\n                    delete node[prop];\n                    node[prop] = val;\n                }\n            });\n        }\n        if(node.constructor === Array){\n            for(var i=0; i<node.length; i++){\n                setType(node[i]);\n            }\n        }else{\n            if(node.childrens && node.childrens.length){\n                for(var i=0; i<node.childrens.length; i++){\n                    setType(node.childrens[i]);\n                }\n            }\n        }\n    }\n}\n\n\nglobal.jsparser = parser;\n",
  "lex": {
    "rules": [
      {
        "regex": "/\\/\\/[^\\n]*/",
        "action": "                  /* skip singleline comment */"
      },
      {
        "regex": "/\\/\\*(.|\\n|\\r)*?\\*\\//",
        "action": "         /* skip multiline comment */ "
      },
      {
        "regex": "/\"(\\\\\"|[^\"])*\"/",
        "action": "               return \"STRING\";"
      },
      {
        "regex": "/'(\\\\'|[^'])*'/",
        "action": "               return \"STRING\";"
      },
      {
        "regex": "/((0|[1-9][0-9]*)(\\.[0-9]*)?|\\.[0-9]+)([eE][+-]?[0-9]+)?|[0][xX][0-9a-fA-F]+/",
        "action": "   return \"NUMBER\""
      },
      {
        "regex": "/>>>=/",
        "action": "                        return \">>>=\";  //URSHIFT EQUAL"
      },
      {
        "regex": "/!==/",
        "action": "                         return \"!==\";   //STRNEX"
      },
      {
        "regex": "/===/",
        "action": "                         return \"===\";   //STREQ"
      },
      {
        "regex": "/>>>/",
        "action": "                         return \">>>\";   //URSHIFT"
      },
      {
        "regex": "/\\<<=/",
        "action": "                        return \"<<=\";   //LSHIFT EQUAL"
      },
      {
        "regex": "/>>=/",
        "action": "                         return \">>=\";   //RSHIFT EQUAL"
      },
      {
        "regex": "/%=/",
        "action": "                          return \"%=\";    //MOD EQUAL"
      },
      {
        "regex": "/&&/",
        "action": "                          return \"&&\";    //AND"
      },
      {
        "regex": "/&=/",
        "action": "                          return \"&=\";    //AND EQUAL"
      },
      {
        "regex": "/\\*=/",
        "action": "                         return \"*=\";    //MULT EQUAL"
      },
      {
        "regex": "/\\+\\+/",
        "action": "                        return \"++\";    //PLUS PLUS"
      },
      {
        "regex": "/\\+=/",
        "action": "                         return \"+=\";    //PLUS EQUAL"
      },
      {
        "regex": "/--/",
        "action": "                          return \"--\";    //MINUS MINUS"
      },
      {
        "regex": "/-=/",
        "action": "                          return \"-=\";    //MINUS EQUAL"
      },
      {
        "regex": "/\\/=/",
        "action": "                         return \"/=\";    //DIV EQUAL"
      },
      {
        "regex": "/\\<</",
        "action": "                          return \"<<\";    //LSHIFT"
      },
      {
        "regex": "/\\<=/",
        "action": "                          return \"<=\";    //LE"
      },
      {
        "regex": "/>=/",
        "action": "                          return \">=\";    //GE"
      },
      {
        "regex": "/==/",
        "action": "                          return \"==\";    //EQEQ"
      },
      {
        "regex": "/>>/",
        "action": "                          return \">>\";    //RSHIFT"
      },
      {
        "regex": "/\\^=/",
        "action": "                         return \"^=\";    //XOR EQUAL"
      },
      {
        "regex": "/\\|=/",
        "action": "                         return \"|=\";    //OR EQUAL"
      },
      {
        "regex": "/\\|\\|/",
        "action": "                        return \"||\";    //OR"
      },
      {
        "regex": "/&/",
        "action": "                           return \"&\";     //LOGIC AND"
      },
      {
        "regex": "/%/",
        "action": "                           return \"%\";     //MOD"
      },
      {
        "regex": "/!=/",
        "action": "                          return \"!=\";    //NE"
      },
      {
        "regex": "/\\=/",
        "action": "                          return \"=\";"
      },
      {
        "regex": "/\\(/",
        "action": "                          return \"(\";"
      },
      {
        "regex": "/\\)/",
        "action": "                          return \")\";"
      },
      {
        "regex": "/\\+/",
        "action": "                          return \"+\";"
      },
      {
        "regex": "/\\*/",
        "action": "                          return \"*\";"
      },
      {
        "regex": "/\\,/",
        "action": "                          return \",\";"
      },
      {
        "regex": "/\\-/",
        "action": "                          return \"-\";"
      },
      {
        "regex": "/\\!/",
        "action": "                          return \"!\";"
      },
      {
        "regex": "/\\./",
        "action": "                          return \".\";"
      },
      {
        "regex": "/\\//",
        "action": "                          return \"/\";"
      },
      {
        "regex": "/:/",
        "action": "                           return \":\";"
      },
      {
        "regex": "/\\;/",
        "action": "                          return \";\";"
      },
      {
        "regex": "/\\</",
        "action": "                          return \"<\";"
      },
      {
        "regex": "/>/",
        "action": "                           return \">\";"
      },
      {
        "regex": "/\\?/",
        "action": "                          return \"?\";"
      },
      {
        "regex": "/\\[/",
        "action": "                          return \"[\";"
      },
      {
        "regex": "/\\]/",
        "action": "                          return \"]\";"
      },
      {
        "regex": "/\\^/",
        "action": "                          return \"^\";"
      },
      {
        "regex": "/\\{/",
        "action": "                          return \"{\";"
      },
      {
        "regex": "/\\}/",
        "action": "                          return \"}\";"
      },
      {
        "regex": "/\\|/",
        "action": "                          return \"|\";"
      },
      {
        "regex": "/\\~/",
        "action": "                          return \"~\";"
      },
      {
        "regex": "/\\&/",
        "action": "                          return \"&\";"
      },
      {
        "regex": "/break/",
        "action": "                       return \"BREAK\";"
      },
      {
        "regex": "/case/",
        "action": "                        return \"CASE\";"
      },
      {
        "regex": "/catch/",
        "action": "                       return \"CATCH\";"
      },
      {
        "regex": "/continue/",
        "action": "                    return \"CONTINUE\";"
      },
      {
        "regex": "/default/",
        "action": "                     return \"DEFAULT\";"
      },
      {
        "regex": "/delete/",
        "action": "                      return \"DELETE\";"
      },
      {
        "regex": "/do/",
        "action": "                          return \"DO\";"
      },
      {
        "regex": "/else/",
        "action": "                        return \"ELSE\";"
      },
      {
        "regex": "/false/",
        "action": "                       return \"FALSE\";"
      },
      {
        "regex": "/finally/",
        "action": "                     return \"FINALLY\";"
      },
      {
        "regex": "/for/",
        "action": "                         return \"FOR\";"
      },
      {
        "regex": "/function/",
        "action": "                    return \"FUNCTION\";"
      },
      {
        "regex": "/get/",
        "action": "                         return \"GET\";"
      },
      {
        "regex": "/if/",
        "action": "                          return \"IF\";"
      },
      {
        "regex": "/in/",
        "action": "                          return \"IN\";"
      },
      {
        "regex": "/instanceof/",
        "action": "                  return \"INSTANCEOF\";"
      },
      {
        "regex": "/new/",
        "action": "                         return \"NEW\";"
      },
      {
        "regex": "/return/",
        "action": "                      return \"RETURN\";"
      },
      {
        "regex": "/set/",
        "action": "                         return \"SET\";"
      },
      {
        "regex": "/switch/",
        "action": "                      return \"SWITCH\";"
      },
      {
        "regex": "/this/",
        "action": "                        return \"THIS\";"
      },
      {
        "regex": "/throw/",
        "action": "                       return \"THROW\";"
      },
      {
        "regex": "/true/",
        "action": "                        return \"TRUE\";"
      },
      {
        "regex": "/try/",
        "action": "                         return \"TRY\";"
      },
      {
        "regex": "/typeof/",
        "action": "                      return \"TYPEOF\";"
      },
      {
        "regex": "/var/",
        "action": "                         return \"VAR\";"
      },
      {
        "regex": "/const/",
        "action": "                       return \"CONST\";"
      },
      {
        "regex": "/void/",
        "action": "                        return \"VOID\";"
      },
      {
        "regex": "/while/",
        "action": "                       return \"WHILE\";"
      },
      {
        "regex": "/with/",
        "action": "                       return \"WITH\";"
      },
      {
        "regex": "/[A-Za-z$_]\\w*/",
        "action": "               return \"IDENT\";"
      },
      {
        "regex": "/\\s+/",
        "action": "                         /* skip whitespace */"
      },
      {
        "regex": "/\\n/",
        "action": "                          /* skip lineterminal */"
      },
      {
        "regex": "/./",
        "action": "                           return \"INVALID\";"
      }
    ],
    "states": {}
  },
  "type": "LR(1)"
}
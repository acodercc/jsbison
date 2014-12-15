%start Program

%%

Program
    : SourceElements $end
        {
            this.$$ = new Program($1);
            setType(this.$$);
        }
    | $end
        {
            this.$$ = new Program(0);
        }
;

SourceElements
    : SourceElements SourceElement
        {
            this.$$ = $1;
            this.$$.push($2);
        }
    | SourceElement
        {
            this.$$ = [$1];
        }
;

SourceElement
    : Statement
    | FunctionDeclaration
;

Statement
    : Block
    | VariableStatement
    | EmptyStatement
    | ExpressionStatement
    | IfStatement
    | IterationStatement
    | ContinueStatement
    | BreakStatement
    | ReturnStatement
    | WithStatement
    | LabelledStatement
    | SwitchStatement
    | ThrowStatement
    | TryStatement
;

FunctionDeclaration
    : FUNCTION Identifier '(' ')' FunctionBody
        {
            this.$$ = new FunctionDeclaration($2, 0, $5);
        }
    | FUNCTION Identifier '(' FormalParameterList ')' FunctionBody
        {
            this.$$ = new FunctionDeclaration($2, $4, $6);
        }
;

FunctionBody
    : '{' '}'
        {
            this.$$ = new FunctionBody(0);
        }
    | '{' SourceElements '}'
        {
            this.$$ = new FunctionBody($2);
        }
;

FormalParameterList
    : Identifier
        {
            this.$$ = [$1];
        }
    | FormalParameterList ',' Identifier
        {
            this.$$ = $1;
            this.$$.push($3);
        }
;

Block 
    : '{' '}'
        {
            this.$$ = new Block(0);
        }
    | '{' StatementList '}'
        {
            this.$$ = new Block($2);
        }
;

StatementList
    : StatementList Statement
        {
            $1.push($2);
            this.$$ = $1;
        }
    | Statement
        {
            this.$$ = new StatementList($1);
        }
;

VariableStatement
    : VAR VariableDeclarationList ';'
        {
            this.$$ = $2;
        }
;


IfStatement
    : IF '(' CommaExpression ')' Statement
        {
            this.$$ = new IfStatement($3, $5, 0);
        }
    | IF '(' CommaExpression ')' Statement ELSE Statement
        {
            this.$$ = new IfStatement($3, $5, $7);
        }
;
IterationStatement
    : DO Statement WHILE '(' CommaExpression ')' ';'
        {
            this.$$ = new DoWhileStatement($2, $5);
        }
    | WHILE '(' CommaExpression ')' Statement
        {
            this.$$ = new WhileStatement($3, $5);
        }
    | FOR '(' Identifier IN CommaExpression ')' Statement
        {
            this.$$ = new ForInStatement($3, $5, $7);
        }
    | FOR '(' LeftHandSideExpression IN CommaExpression ')' Statement
        {
            this.$$ = new ForInStatement($3, $5, $7);
        }
    | FOR '(' VAR Identifier IN CommaExpression ')' Statement
        {
            this.$$ = new ForInStatement($4, $6, $8);
        }
    | FOR '(' VAR VariableDeclarationNoIn IN CommaExpression ')' Statement
        {
            this.$$ = new ForInStatement($4, $6, $8);
        }
    | FOR '(' ExpressionNoInOpt ';' ExpressionOpt ';' ExpressionOpt ')' Statement
        {
            this.$$ = new ForStatement($3, $5, $7, $9);
        }
    | FOR '(' VAR VariableDeclarationListNoIn ';' ExpressionOpt ';' ExpressionOpt ')' Statement
        {
            this.$$ = new ForStatement($4, $6, $8, $10);
        }
;

ContinueStatement
    : CONTINUE ';'
        {
            this.$$ = new ContinueStatement(undefined);
        }
;

BreakStatement
    : BREAK ';'
        {
            this.$$ = new BreakStatement(undefined);
        }
;

ReturnStatement
    : RETURN ';'
        {
            this.$$ = new ReturnStatement(undefined);
        }
    | RETURN CommaExpression ';'
        {
            this.$$ = new ReturnStatement($2);
        }
;
WithStatement
    : WITH '(' CommaExpression ')' Statement
        {
            this.$$ = new WithStatement($3, $5);
        }
;
LabelledStatement
    : IDENT ':' Statement
        {
            this.$$ = new LabelledStatement($1, $3);
        }
;
SwitchStatement
    : SWITCH '(' CommaExpression ')' CaseBlock
        {
            this.$$ = new SwitchStatement($3, $5);
        }
;
ThrowStatement
    : THROW CommaExpression ';'
        {
            this.$$ = new ThrowStatement($2);
        }
;

TryStatement
    : TRY Block Catch
        {
            this.$$ = new TryStatement($2, $3, 0);
        }
    | TRY Block Finally
        {
            this.$$ = new TryStatement($2, 0, $3);
        }
    | TRY Block Catch Finally
        {
            this.$$ = new TryStatement($2, $3, $4);
        }
;

Catch
    : CATCH '(' IDENT ')' Block
        {
            this.$$ = new Catch($3, $5);
        }
;

Finally
    : FINALLY Block
        {
            this.$$ = new Finally($2);
        }
;

CaseBlock
    : '{' CaseClausesOpt '}' 
        {
            this.$$ = new CaseBlock($2, 0, 0);
        }
    | '{' CaseClausesOpt DefaultClause CaseClausesOpt '}'
        {
            this.$$ = new CaseBlock($2, $3, $4);
        }
;

CaseClausesOpt
    :   /* epsilon */
        {
            this.$$ = 0;
        }
    | CaseClauses
;

CaseClauses
    : CASE CommaExpression ':' StatementListOpt
        {
            this.$$ = new CaseClause($2, $4);
        }
;

DefaultClause
    : DEFAULT ':' StatementListOpt
        {
            this.$$ = new CaseClause(0, $3);
        }
;

StatementListOpt
    : /* epsilon */
        {
            this.$$ = 0;
        }
    | StatementList
;



ExpressionOpt
    : /* epsilon */
        {
            this.$$ = 0;
        }
    | CommaExpression
;

ExpressionNoInOpt
    :
        {
            this.$$ = 0;
        }
    | ExpressionNoIn
        {
            this.$$ = $1;
        }
;

ExpressionNoIn
    : AssignmentExpressionNoIn
        {
            this.$$ = [$1];
        }
    | ExpressionNoIn ',' AssignmentExpressionNoIn
        {
            this.$$ = $1;
            this.$$.push($3);
        }
;

EmptyStatement
    : ';'
;


ExpressionStatement
    : CommaExpression ';'
        {
            this.$$ = new ExpressionStatement($1);
        }
;




VariableDeclarationList
    : VariableDeclarationList ',' VariableDeclaration
        {
            this.$$ = $1;
            this.$$.push($3);
        }
    | VariableDeclaration
        {
            this.$$ = [$1];
        }
;
VariableDeclarationListNoIn
    : VariableDeclarationListNoIn ',' VariableDeclarationNoIn
        {
            this.$$ = $1;
            this.$$.push($3);
        }
    | VariableDeclarationNoIn
        {
            this.$$ = [$1];
        }
;



VariableDeclaration
    : Identifier
        {
            this.$$ = new VariableDeclaration($1, 0);
        }
    | Identifier Initializer
        {
            this.$$ = new VariableDeclaration($1, $2);
        }
;

VariableDeclarationNoIn
    : Identifier
        {
            this.$$ = new VariableDeclaration($1, 0);
        }
    | Identifier InitializerNoIn
        {
            this.$$ = new VariableDeclaration($1, $2);
        }
;
Initializer
    : '=' AssignmentExpression
        {
            this.$$ = $2;
        }
;
InitializerNoIn
    : '=' AssignmentExpressionNoIn
        {
            this.$$ = $2;
        }
;

CommaExpression
    : AssignmentExpression
        {
            this.$$ = [$1];
        }
    | CommaExpression ',' AssignmentExpression
        {
            this.$$ = $1;
            this.$$.push($3);
        }
;


AssignmentExpression
    : ConditionalExpression
    | LeftHandSideExpression AssignmentOperator AssignmentExpression
        {
            this.$$ = new AssignmentExpression($1, $2, $3);
        }
;
AssignmentExpressionNoIn
    : ConditionalExpressionNoIn
    | LeftHandSideExpression AssignmentOperator AssignmentExpressionNoIn
        {
            this.$$ = new AssignmentExpression($1, $2, $3);
        }
;


AssignmentOperator
    : '='
    | '+='
    | '-='
    | '/='
    | '*='
    | '<<='
    | '>>='
    | '>>>='
    | '&='
    | '^='
    | '|='
    | '%='
;

ConditionalExpression
    : LogicalORExpression '?' AssignmentExpression ':' AssignmentExpression
        {
            this.$$ = new ConditionalExpression($1, $3, $5);
        }
    | LogicalORExpression
;
ConditionalExpressionNoIn
    : LogicalORExpressionNoIn '?' AssignmentExpression ':' AssignmentExpressionNoIn
        {
            this.$$ = new ConditionalExpression($1, $3, $5);
        }
    | LogicalORExpressionNoIn
;
LogicalORExpression
    : LogicalANDExpression
    | LogicalORExpression '||' LogicalANDExpression
        {
            this.$$ = new BinaryExpression($1, $2, $3);
        }
;
LogicalORExpressionNoIn
    : LogicalANDExpressionNoIn
    | LogicalORExpressionNoIn '||' LogicalANDExpressionNoIn
        {
            this.$$ = new BinaryExpression($1, $2, $3);
        }
;

LogicalANDExpression
    : BitwiseORExpression
    | LogicalANDExpression '&&' BitwiseORExpression
        {
            this.$$ = new BinaryExpression($1, $2, $3);
        }
;
LogicalANDExpressionNoIn
    : BitwiseORExpressionNoIn
    | LogicalANDExpressionNoIn '&&' BitwiseORExpressionNoIn
        {
            this.$$ = new BinaryExpression($1, $2, $3);
        }
;

BitwiseORExpression
    : BitwiseXORExpression
    | BitwiseORExpression  '|' BitwiseXORExpression
        {
            this.$$ = new BinaryExpression($1, $2, $3);
        }
;
BitwiseORExpressionNoIn
    : BitwiseXORExpressionNoIn
    | BitwiseORExpressionNoIn  '|' BitwiseXORExpressionNoIn
        {
            this.$$ = new BinaryExpression($1, $2, $3);
        }
;

BitwiseXORExpression
    : BitwiseANDExpression
    | BitwiseXORExpression '^' BitwiseANDExpression
        {
            this.$$ = new BinaryExpression($1, $2, $3);
        }
;
BitwiseXORExpressionNoIn
    : BitwiseANDExpressionNoIn
    | BitwiseXORExpressionNoIn '^' BitwiseANDExpressionNoIn
        {
            this.$$ = new BinaryExpression($1, $2, $3);
        }
;

BitwiseANDExpression
    : EqualityExpression
    | BitwiseANDExpression '&' EqualityExpression
        {
            this.$$ = new BinaryExpression($1, $2, $3);
        }
;
BitwiseANDExpressionNoIn
    : EqualityExpressionNoIn
    | BitwiseANDExpressionNoIn '&' EqualityExpressionNoIn
        {
            this.$$ = new BinaryExpression($1, $2, $3);
        }
;

EqualityExpression
    : RelationalExpression
    | EqualityExpression '==' RelationalExpression
        {
            this.$$ = new BinaryExpression($1, $2, $3);
        }
    | EqualityExpression '!=' RelationalExpression
        {
            this.$$ = new BinaryExpression($1, $2, $3);
        }
    | EqualityExpression '===' RelationalExpression
        {
            this.$$ = new BinaryExpression($1, $2, $3);
        }
    | EqualityExpression '!==' RelationalExpression
        {
            this.$$ = new BinaryExpression($1, $2, $3);
        }
;

EqualityExpressionNoIn
    : RelationalExpressionNoIn
    | EqualityExpressionNoIn '==' RelationalExpressionNoIn
        {
            this.$$ = new BinaryExpression($1, $2, $3);
        }
    | EqualityExpressionNoIn '!=' RelationalExpressionNoIn
        {
            this.$$ = new BinaryExpression($1, $2, $3);
        }
    | EqualityExpressionNoIn '===' RelationalExpressionNoIn
        {
            this.$$ = new BinaryExpression($1, $2, $3);
        }
    | EqualityExpressionNoIn '!==' RelationalExpressionNoIn
        {
            this.$$ = new BinaryExpression($1, $2, $3);
        }
;


RelationalExpression
    : RelationalExpression '<' ShiftExpression
        {
            this.$$ = new BinaryExpression($1, $2, $3);
        }
    | RelationalExpression '>' ShiftExpression
        {
            this.$$ = new BinaryExpression($1, $2, $3);
        }
    | RelationalExpression '<=' ShiftExpression
        {
            this.$$ = new BinaryExpression($1, $2, $3);
        }
    | RelationalExpression '>=' ShiftExpression
        {
            this.$$ = new BinaryExpression($1, $2, $3);
        }
    | RelationalExpression 'instanceof' ShiftExpression
        {
            this.$$ = new BinaryExpression($1, $2, $3);
        }
    | RelationalExpression 'in' ShiftExpression
        {
            this.$$ = new BinaryExpression($1, $2, $3);
        }
    | ShiftExpression
;
RelationalExpressionNoIn
    : RelationalExpressionNoIn '<' ShiftExpression
        {
            this.$$ = new BinaryExpression($1, $2, $3);
        }
    | RelationalExpressionNoIn '>' ShiftExpression
        {
            this.$$ = new BinaryExpression($1, $2, $3);
        }
    | RelationalExpressionNoIn '<=' ShiftExpression
        {
            this.$$ = new BinaryExpression($1, $2, $3);
        }
    | RelationalExpressionNoIn '>=' ShiftExpression
        {
            this.$$ = new BinaryExpression($1, $2, $3);
        }
    | RelationalExpressionNoIn 'instanceof' ShiftExpression
        {
            this.$$ = new BinaryExpression($1, $2, $3);
        }
    | ShiftExpression
;


ShiftExpression
    : AdditiveExpression
    | ShiftExpression '<<' AdditiveExpression 
        {
            this.$$ = new BinaryExpression($1, $2, $3);
        }
    | ShiftExpression '>>' AdditiveExpression 
        {
            this.$$ = new BinaryExpression($1, $2, $3);
        }
    | ShiftExpression '>>>' AdditiveExpression 
        {
            this.$$ = new BinaryExpression($1, $2, $3);
        }
;
AdditiveExpression
    : MultiplicativeExpression
    | AdditiveExpression '+' MultiplicativeExpression
        {
            this.$$ = new BinaryExpression($1, $2, $3);
        }
    | AdditiveExpression '-' MultiplicativeExpression
        {
            this.$$ = new BinaryExpression($1, $2, $3);
        }
;

MultiplicativeExpression
    : UnaryExpression
    | MultiplicativeExpression '*' UnaryExpression
        {
            this.$$ = new BinaryExpression($1, $2, $3);
        }
    | MultiplicativeExpression '/' UnaryExpression
        {
            this.$$ = new BinaryExpression($1, $2, $3);
        }
    | MultiplicativeExpression '%' UnaryExpression
        {
            this.$$ = new BinaryExpression($1, $2, $3);
        }
;
UnaryExpression
    : PostfixExpression
    | DELETE UnaryExpression
        {
            this.$$ = new UnaryExpression($1, $2);
        }
    | VOID UnaryExpression
        {
            this.$$ = new UnaryExpression($1, $2);
        }
    | TYPEOF UnaryExpression
        {
            this.$$ = new UnaryExpression($1, $2);
        }
    | '++' UnaryExpression
        {
            this.$$ = new UpdateExpression($1, $2, true);
        }
    | '--' UnaryExpression
        {
            this.$$ = new UpdateExpression($1, $2, true);
        }
    | '+' UnaryExpression
        {
            this.$$ = new UnaryExpression($1, $2);
        }
    | '-' UnaryExpression
        {
            this.$$ = new UnaryExpression($1, $2);
        }
    | '~' UnaryExpression
        {
            this.$$ = new UnaryExpression($1, $2);
        }
    | '!' UnaryExpression
        {
            this.$$ = new UnaryExpression($1, $2);
        }
;
PostfixExpression
    : LeftHandSideExpression
    | LeftHandSideExpression '++'
        {
            this.$$ = new UpdateExpression($2, $1, false);
        }
    | LeftHandSideExpression '--'
        {
            this.$$ = new UpdateExpression($2, $1, false);
        }
;
LeftHandSideExpression
    : NewExpression
    | CallExpression
;

CallExpression
    : MemberExpression Arguments
        {
            this.$$ = new CallExpression($1, $2);
        }
    | CallExpression Arguments
        {
            this.$$ = new CallExpression($1, $2);
        }
    | CallExpression '[' CommaExpression ']'
        {
            this.$$ = new MemberExpression($1, $3);
        }
    | CallExpression '.' Identifier
        {
            this.$$ = new MemberExpression($1, $3);
        }
;

NewExpression
    : MemberExpression
    | NEW NewExpression
        {
            this.$$ = new NewExpression($2);
        }
    | NEW MemberExpression Arguments
        {
            this.$$ = new NewExpression($2, $3);
        }
;
Arguments
    : '(' ')'
        {
            this.$$ = new Arguments(0);
        }
    | '(' ArgumentList ')'
        {
            this.$$ = new Arguments($2);
        }
;
ArgumentList
    : AssignmentExpression
        {
            this.$$ = [$1];
        }
    | ArgumentList ',' AssignmentExpression
        {
            this.$$ = $1;
            this.$$.push($3);
        }
;
MemberExpression
    : PrimaryExpression
    | FunctionExpression
    | MemberExpression '[' CommaExpression ']'
        {
            this.$$ = new MemberExpression($1, $3);
        }
    | MemberExpression '.' IdentifierName
        {
            this.$$ = new MemberExpression($1, $3);
        }
;
IdentifierName
    : IDENT
    | BREAK
    | CASE
    | CATCH
    | CONTINUE
    | DEFAULT
    | DELETE
    | DO
    | ELSE
    | FALSE
    | FINALLY
    | FOR
    | FUNCTION
    | GET
    | IF
    | IN
    | INSTANCEOF
    | NEW
    | NULL
    | RETURN
    | SET
    | SWITCH
    | THIS
    | THROW
    | TRUE
    | TRY
    | TYPEOF
    | VAR
    | CONST
    | VOID
    | WHILE
    | WITH
; 
FunctionExpression
    : FUNCTION '(' ')' FunctionBody
        {
            this.$$ = new FunctionExpression(0, $4);
        }
    | FUNCTION '(' FormalParameterList ')' FunctionBody
        {
            this.$$ = new FunctionExpression($3, $5);
        }
    | FUNCTION Identifier '(' ')' FunctionBody
        {
            this.$$ = new FunctionExpression(0, $5, $2);
        }
    | FUNCTION Identifier '(' FormalParameterList ')' FunctionBody
        {
            this.$$ = new FunctionExpression($4, $6, $2);
        }
;

Identifier
    : IDENT
        {
            this.$$ = new Identifier($1);
        }
;

PrimaryExpression
    : Literal
;

Literal
    : Identifier
        {
            this.$$ = $1;
        }
    | NULL
    | TRUE
    | FALSE
    | NUMBER
        {
            this.$$ = new Literal($1, 'NUMBER');
        }
    | STRING
        {
            this.$$ = new Literal($1, 'STRING');
        }
;

%%

function Program(body){
    this.body = body;
    this.childrens = [body];
}
function SourceElements(sourceElement){
    this.childrens = [sourceElement];
}
function Block(sourceElements){
    this.childrens = [!!sourceElements ? sourceElements : 0];
}
function StatementList(statement){
    this.childrens = [statement];
}
function VarStatement(name){
    this.childrens = [name];
}
function IfStatement(expression, ifStatement, elseStatement){
    this.childrens = [expression, ifStatement, elseStatement];
}
function DoWhileStatement(statement, expr){
    this.statement = statement;
    this.expr = expr;
    this.childrens = [statement, expr];
}
function WhileStatement(expr, statement){
    this.expr = expr;
    this.statement = statement;
    this.childrens = [expr, statement];
}
function ForInStatement(left, right, statement){
    this.left = left;
    this.right = right;
    this.statement = statement;
    this.childrens = [left, right, statement];
}
function ForStatement(expr1, expr2, expr3, statement){
    this.expr1 = expr1;
    this.expr2 = expr2;
    this.expr3 = expr3;
    this.statement = statement;
    this.childrens = [expr1, expr2, expr3, statement];
}
function ExpressionStatement(expression){
    this.childrens = [expression];
}
function ContinueStatement(ident){
    this.ident = ident;
    this.childrens = [ident];
}
function BreakStatement(ident){
    this.ident = ident;
    this.childrens = [ident];
}
function ReturnStatement(expr){
    this.expr = expr;
    this.childrens = [expr];
}
function WithStatement(object, statement){
    this.object = object;
    this.statement = statement;
    this.childrens = [object, statement];
}
function LabelledStatement(ident, statement){
    this.ident = ident;
    this.statement = statement;
    this.childrens = [ident, statement];
}
function SwitchStatement(expr, caseblock){
    this.expr = expr;
    this.caseblock = caseblock;
    this.childrens = [expr, caseblock];
}
function ThrowStatement(expr){
    this.expr = expr;
    this.childrens = [expr];
}
function TryStatement(block, catchBlock, finallyBlock){
    this.block = block;
    this.catchBlock = catchBlock;
    this.finallyBlock = finallyBlock;
    this.childrens = [block, catchBlock, finallyBlock];
}
function Catch(block){
    this.block = block;
    this.childrens = [block];
}
function Finally(block){
    this.block = block;
    this.childrens = [block];
}
function CaseBlock(opts1, defs, opts2){
    this.opts1 = opts1;
    this.defs = defs;
    this.opts2 = opts2;
    this.childrens = [opts1, defs, opts2];
}
function CaseClause(expr, statementlist){
    this.expr = expr;
    this.statementlist = statementlist;
    this.childrens = [expr, statementlist];
}
function VariableDeclarationList(varDeclaration){
    this.childrens = [varDeclaration];
}
function VariableDeclaration(id, init){
    this.id = id;
    this.init = init;
    this.childrens = [id, init];
}
function CommaExpression(assignExpression){
    this.childrens = [assignExpression];
}
function AssignmentExpression(left, op, right){
    this.childrens = [left, op, right];
}
function ConditionalExpression(test, consequent, alternate){
    this.test = test;
    this.consequent = consequent;
    this.alternate = alternate;
    this.childrens = [test, consequent, alternate]; 
}
function BinaryExpression(left, operator, right){
    this.left = left;
    this.operator = operator;
    this.right = right;
    this.childrens = [left, operator, right];
}
function UnaryExpression(operator, augument){
    this.operator = operator;
    this.augument = augument;
    this.childrens = [operator, augument];
}
function UpdateExpression(operator, augument, prefix){
    this.operator = operator;
    this.augument = augument;
    this.prefix = prefix;
    this.childrens = [operator, augument, prefix];
}
function Arguments(argumentList){
    this.childrens = [argumentList];
}
function ArgumentList(assignmentExpression){
    this.childrens = [assignmentExpression];
}
function MemberExpression(object, property){
    this.object = object;
    this.property = property;
    this.childrens = [object, property];
}
function FunctionDeclaration(id, args, body){
    this.id = id;
    this.args = args;
    this.body = body;
    this.childrens = [id, args, body];
}

function FunctionExpression(params, block, name){
    this.childrens = [params, block, name];
}

function NewExpression(func, args){
    this.func = func;
    this.args = args;
    this.childrens = [func, args];
}
function CallExpression(func, args){
    this.func = func;
    this.args = args;
    this.childrens = [func, args];
}

function Parameter(param){
    this.childrens = [param];
}
function FunctionBody(sourceElements){
    this.sourceElements = sourceElements;
    this.childrens = [sourceElements];
}
function Identifier(name){
    this.name = name;
    this.childrens = [name];
}
function Literal(raw, type){
    this.raw = raw;
    switch(type){
        case 'NUMBER':
            this.value = Number(raw);
            break;
        case 'STRING':
            this.value = eval(raw);
            break;
    }
    this.childrens = [raw];
}

/**
 * set type is function.constructor
 * set type is node first property
 */
function setType(node){
    var childrens;
    if(node){
        if(node.constructor !== Object && node.constructor !== Array && node instanceof Object){
            if(node.type === undefined){
                node.type = node.constructor.name;
            }
            Object.keys(node).forEach(function(prop){
                var val = node[prop];
                if(prop !== 'type'){
                    delete node[prop];
                    node[prop] = val;
                }
            });
        }
        if(node.constructor === Array){
            for(var i=0; i<node.length; i++){
                setType(node[i]);
            }
        }else{
            if(node.childrens && node.childrens.length){
                for(var i=0; i<node.childrens.length; i++){
                    setType(node.childrens[i]);
                }
            }
        }
    }
}


global.jsparser = parser;

%start Program

%%

Program
    : SourceElements $end
        {
            this.$$ = new Program($1);
            setNodeName(this.$$);
        }
    | $end
        {
            this.$$ = new Program(0);
        }
;

SourceElements
    : SourceElements SourceElement
        {
            $1.childrens.push($2);
            this.$$ = $1;
        }
    | SourceElement
        {
            this.$$ = new SourceElements($1);
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
    : FUNCTION IDENT '(' ')' FunctionBody
        {
            this.$$ = new FunctionDecl($2, 0, $5);
        }
    | FUNCTION IDENT '(' FormalParameterList ')' FunctionBody
        {
            this.$$ = new FunctionDecl($2, $4, $6);
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
    : Ident
        {
            this.$$ = new Parameter($1);
        }
    | FormalParameterList ',' Ident
        {
            this.$$ = $1;
            this.$$.push($2);
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


EmptyStatement
    : ';'
;


ExpressionStatement
    : AssignmentExpression ';'
        {
            this.$$ = $1;
        }
;

VariableStatement
    : VAR VariableDeclarationList ';'
        {
            this.$$ = new VarStatement($2)
        }
;


VariableDeclarationList
    : VariableDeclarationList ',' VariableDeclaration
        {
            this.$$ = $1;
            this.$$.childrens.push($3);
        }
    | VariableDeclaration
        {
            this.$$ = new VarDeclList($1);
        }
;
VariableDeclaration
    : Ident
        {
            this.$$ = new VarDecl($1, 0);
        }
    | Ident Initializer
        {
            this.$$ = new VarDecl($1, $2);
        }
;
Ident
    : IDENT
        {
            this.$$ = $1;
        }
;
Initializer
    : '=' AssignmentExpression
        {
            this.$$ = new AssignExpression($2);
        }
;

CommaExpression
    : AssignmentExpression
        {
            this.$$ = new CommaExpression($1);
        }
    | CommaExpression ',' AssignmentExpression
        {
            this.$$ = $1;
            this.$$.push($3);
        }
;


AssignmentExpression
    : ConditionalExpression
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
            this.$$ = new Conditional($1, $3, $5);
        }
    | LogicalORExpression
;
LogicalORExpression
    : LogicalANDExpression
    | LogicalORExpression OR LogicalANDExpression
        {
            this.$$ = new BinaryLogical($1, $2, $3, true);
        }
;

LogicalANDExpression
    : BitwiseORExpression
;

BitwiseORExpression
    : BitwiseXORExpression
;

BitwiseXORExpression
    : BitwiseANDExpression
;

BitwiseANDExpression
    : EqualityExpression
;

EqualityExpression
    : RelationalExpression
    | EqualityExpression '==' RelationalExpression
        {
            this.$$ = new EqualityExpression($1, $2, $3);
        }
    | EqualityExpression '!=' RelationalExpression
        {
            this.$$ = new EqualityExpression($1, $2, $3);
        }
    | EqualityExpression '===' RelationalExpression
        {
            this.$$ = new EqualityExpression($1, $2, $3);
        }
    | EqualityExpression '!==' RelationalExpression
        {
            this.$$ = new EqualityExpression($1, $2, $3);
        }
;

RelationalExpression
    : ShiftExpression
;

ShiftExpression
    : AdditiveExpression
;
AdditiveExpression
    : MultiplicativeExpression
;

MultiplicativeExpression
    : UnaryExpression
;
UnaryExpression
    : PostfixExpression
;
PostfixExpression
    : LeftHandSideExpression
;
LeftHandSideExpression
    : NewExpression
    | CallExpression
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
            this.$$ = new ArgumentList($1);
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
            this.$$ = new BracketAccessor($1, $3);
        }
    | MemberExpression '.' IdentifierName
        {
            this.$$ = new DotAccessor($1, $3);
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
    | FUNCTION IDENT '(' ')' FunctionBody
        {
            this.$$ = new FunctionExpression(0, $5, $2);
        }
    | FUNCTION IDENT '(' FormalParameterList ')' FunctionBody
        {
            this.$$ = new FunctionExpression($4, $6, $2);
        }
;

PrimaryExpression
    : Literal
;

Literal
    : IDENT
    | NULL
    | TRUE
    | FALSE
    | NUMBER
    | STRING
;

%%

function Program(x){
    this.childrens = [x];
}
function SourceElements(x){
    this.childrens = [x];
}
function Block(x){
    this.childrens = [!!x ? x : 0];
}
function StatementList(x){
    this.childrens = [x];
}
function VarStatement(x){
    this.childrens = [x];
}
function IfStatement(x, y, z){
    this.childrens = [x, y, z];
}
function VarDeclList(x){
    this.childrens = [x];
}
function VarDecl(x, y){
    this.childrens = [x, y];
}
function CommaExpression(x){
    this.childrens = [x];
}
function AssignExpression(x){
    this.childrens = [x];
}
function EqualityExpression(x, y, z){
    this.childrens = [x, y, z];
}
function Arguments(argumentList){
    this.childrens = [argumentList];
}
function ArgumentList(assignmentExpression){
    this.childrens = [assignmentExpression];
}

function BracketAccessor(memberExpression, commaExpression){
    this.childrens = [memberExpression, commaExpression];
}
function DotAccessor(memberExpression, identifierName){
    this.childrens = [memberExpression, identifierName];
}


function FuncitonDecl(x, y, z){
    this.childrens = [x, y, z];
}

function FunctionExpression(params, block, name){
    this.childrens = [params, block, name];
}

function Parameter(x){
    this.childrens = [x];
}
function FunctionBody(x){
    this.childrens = [x];
}

function setNodeName(node){
    var childrens;
    if(node){
        if(node.constructor !== Object){
            node.nodeName = node.constructor.name;
            childrens = node.childrens;
            delete node.childrens;
            node.childrens = childrens;
        }
        if(node.childrens){
            for(var i=0; i<node.childrens.length; i++){
                setNodeName(node.childrens[i]);
            }
        }
    }
}


global.jsparser = parser;

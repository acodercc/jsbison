
%%

\/\/[^\n]*                  /* skip singleline comment */
\/\*(.|\n|\r)*?\*\/         /* skip multiline comment */ 

"(\\"|[^"])*"               return "STRING";
'(\\'|[^'])*'               return "STRING";

((0|[1-9][0-9]*)(\.[0-9]*)?|\.[0-9]+)([eE][+-]?[0-9]+)?|[0][xX][0-9a-fA-F]+   return "NUMBER"

>>>=                        return ">>>=";  //URSHIFT EQUAL
!==                         return "!==";   //STRNEX
===                         return "===";   //STREQ
>>>                         return ">>>";   //URSHIFT
\<<=                        return "<<=";   //LSHIFT EQUAL
>>=                         return ">>=";   //RSHIFT EQUAL
%=                          return "%=";    //MOD EQUAL
&&                          return "&&";    //AND
&=                          return "&=";    //AND EQUAL
\*=                         return "*=";    //MULT EQUAL
\+\+                        return "++";    //PLUS PLUS
\+=                         return "+=";    //PLUS EQUAL
--                          return "--";    //MINUS MINUS
-=                          return "-=";    //MINUS EQUAL
\/=                         return "/=";    //DIV EQUAL
\<<                          return "<<";    //LSHIFT
\<=                          return "<=";    //LE
>=                          return ">=";    //GE
==                          return "==";    //EQEQ
>>                          return ">>";    //RSHIFT
\^=                         return "^=";    //XOR EQUAL
\|=                         return "|=";    //OR EQUAL
\|\|                        return "||";    //OR
&                           return "&";     //LOGIC AND
%                           return "%";     //MOD
!=                          return "!=";    //NE
\=                          return "=";
\(                          return "(";
\)                          return ")";
\+                          return "+";
\*                          return "*";
\,                          return ",";
\-                          return "-";
\!                          return "!";
\.                          return ".";
\/                          return "/";
:                           return ":";
\;                          return ";";
\<                          return "<";
>                           return ">";
\?                          return "?";
\[                          return "[";
\]                          return "]";
\^                          return "^";
\{                          return "{";
\}                          return "}";
\|                          return "|";
\~                          return "~";
\&                          return "&";
break                       return "BREAK";
case                        return "CASE";
catch                       return "CATCH";
continue                    return "CONTINUE";
default                     return "DEFAULT";
delete                      return "DELETE";
do                          return "DO";
else                        return "ELSE";
false                       return "FALSE";
finally                     return "FINALLY";
for                         return "FOR";
function                    return "FUNCTION";
get                         return "GET";
if                          return "IF";
in                          return "IN";
instanceof                  return "INSTANCEOF";
new                         return "NEW";
return                      return "RETURN";
set                         return "SET";
switch                      return "SWITCH";
this                        return "THIS";
throw                       return "THROW";
true                        return "TRUE";
try                         return "TRY";
typeof                      return "TYPEOF";
var                         return "VAR";
const                       return "CONST";
void                        return "VOID";
while                       return "WHILE";
with                       return "WITH";
[A-Za-z$_]\w*               return "IDENT";
\s+                         /* skip whitespace */
\n                          /* skip lineterminal */
.                           return "INVALID";



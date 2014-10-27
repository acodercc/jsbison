%%

\*           return "*";
\d+    {
    if(parseInt(this.yytext,10).toString() !== "NaN"){
        this.yytext = parseInt(this.yytext, 10);
    }else{
        this.yytext = "0";
    }
    return "NUMBER";
}
\+           return "+";
\(           return "(";
\)           return ")";
\{           return "{";
\}           return "}";

\w  {}

%start expr

%%

expr
    : expr + term
        {
            this.$$ = $1 + $3;
        }
    | term
    ;

term
    : term * factoy
        {
            this.$$ = $1 * $3;
        }
    | factoy
    ;

factoy
    : NUMBER
    |   ( expr )
        {
            this.$$ = $2;
        }
    ;

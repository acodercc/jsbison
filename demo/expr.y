%start expr

%%

expr
    : expr + term
        {
            this.$$ = $1 + $2;
        }
    | term
        {
            this.$$ = $1;
        }
    ;

term
    : term * factoy
        {
            this.$$ = $1 * $2;
        }
    | factoy
        {
            this.$$ = $1;
        }
    ;

factoy
    : NUMBER
        {
            this.$$ = parseInt($1, 10);
        }
    |   ( expr )
        {
            this.$$ = $2;
        }
    ;

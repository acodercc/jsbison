%start term
%defaultAction {
    this.$$ = $1+2;
    console.log($0);
}

%%


term
    : term '*' factoy
        {
            this.$$ = $1 * $3;
        }
    | factoy
;

factoy
    : 'NUMBER'
        {
            this.$$ = parseInt($1, 10);
        }
;

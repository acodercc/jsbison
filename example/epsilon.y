%start A

%%

A
    : 'a'
        {
            this.$$ = $1;
        }
    | A B C
        {
            this.$$ = $1 + $2 + $3;
        }
;

B
    :       /*epsilon*/
        {
            this.$$ = "";
        }
    | 'b'
        {
            this.$$ = $1;
        }
;

C : { this.$$ = '' }
  | 'c' { this.$$ = $1 }
;


    var fs = require('fs');
    var Generator = require('../src/generator.js');
    var lexParser = require('../src/lex2cfg.js');

    if(lexParser.parse(fs.readFileSync('./expr.l').toString())){
        var lexcfg = lexParser.$$;
    }

    var ExprParserGenerator = new Generator({
        lex: lexcfg,

        tokens: '+ * ( ) NUMBER',
        start: 'expr',
        type: 'LR(1)',
        bnf: {
            'expr': {
                'expr + term': 'this.$$ = parseInt($1) + parseInt($3)',
                'term': 'this.$$ = $1'
            },
            'term': {
                'term * factor': 'this.$$ = $1 * $3',
                'factor': 'this.$$ = $1'
            },
            'factor': {
                '( expr )': 'this.$$ = $2',
                'NUMBER': 'this.$$ = $1'
            }
        }

    });

    var exprParserCode = ExprParserGenerator.generate();
    console.log(exprParserCode);
    var exprParser = eval(exprParserCode);

    exprParser.parse("1+2*3");


    var fs = require('fs');
    var Generator = require('../src/generator.js');
    var lexParser = require('../src/lex-parser.js');
    var bnfParser = require('../src/bnf-parser.js');

    var lexcontent = fs.readFileSync('./expr.l').toString();
    var bnfcontent = fs.readFileSync('./expr.y').toString();


    if(lexParser.parse(lexcontent)){
        var lexcfg = lexParser.$$;
    }

    if(bnfParser.parse(bnfcontent)){
        var bnfcfg = bnfParser.$$;
    }

    bnfcfg.lex = lexcfg;
    bnfcfg.type = 'LR(1)';


    var ExprParserGenerator = new Generator(bnfcfg);

    var exprParserCode = ExprParserGenerator.generate();
    fs.writeFileSync('./expr.js', exprParserCode);

    var exprParser = eval(exprParserCode);

    exprParser.parse("1+2*3", true)
    console.log(exprParser.lexer.input , 'parse result:', exprParser.$$);

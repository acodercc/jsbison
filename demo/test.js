
    var fs = require('fs');
    var Generator = require('../src/generator.js');
    var lexParser = require('../src/lex-parser.js');
    var bnfParser = require('../src/bnf-parser.js');

    var lexcontent = fs.readFileSync('./expr.l').toString();
    if(lexParser.parse(lexcontent)){
        var lexcfg = lexParser.$$;
    }

    if(bnfParser.parse(fs.readFileSync('./expr.y').toString())){
        var bnfcfg = bnfParser.$$;
    }

    bnfcfg.lex = lexcfg;
    bnfcfg.type = 'LR(1)';

    console.log(JSON.stringify(bnfcfg, null, ' '));

    var ExprParserGenerator = new Generator(bnfcfg);

    var exprParserCode = ExprParserGenerator.generate();
    var exprParser = eval(exprParserCode);

    console.log('parse result:', exprParser.parse("1+2*3"));
    console.log(exprParser);

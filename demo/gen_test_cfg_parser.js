(function(){
    var fs = require('fs');
    var Generator = require('../src/generator.js');
    var lexParser = require('../src/lex-parser.js');
    var bnfParser = require('../src/bnf-parser.js');

    var lexcontent = fs.readFileSync('./test.l').toString();
    var bnfcontent = fs.readFileSync('./test.y').toString();


    if(lexParser.parse(lexcontent)){
        var lexcfg = lexParser.$$;
    }

    if(bnfParser.parse(bnfcontent,true)){
        var bnfcfg = bnfParser.$$;
    }

    bnfcfg.lex = lexcfg;
    bnfcfg.type = 'LR(1)';


    var start = +new Date;
    var ExprParserGenerator = new Generator(bnfcfg);
    console.log(+new Date - start);

    fs.writeFileSync('./generator.txt', ExprParserGenerator.toString());

    var exprParserCode = ExprParserGenerator.generate();
    fs.writeFileSync('./testparser.js', exprParserCode);

    var exprParser = eval(exprParserCode);

    exprParser.parse("var a=1;", true)
    console.log(exprParser.lexer.input , 'parse result:', exprParser.$$);



    var rule, i=0;
    while(rule = lexcfg.rules[i++]){
        rule.regex = rule.regex.toString();
    }
    fs.writeFileSync('testcfg.js', 'var testcfg = '+JSON.stringify(bnfcfg, null, '  '));


})();

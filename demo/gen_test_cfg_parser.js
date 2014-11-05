(function(){

    var lexfile = './js.l';
    var bnffile = './js.y';
    var inputs = 'var a = 1;';


    var fs = require('fs');
    var Generator = require('../src/generator.js');
    var lexParser = require('../src/lex-parser.js');
    var bnfParser = require('../src/bnf-parser.js');

    var lexcontent = fs.readFileSync(lexfile).toString();
    var bnfcontent = fs.readFileSync(bnffile).toString();


    if(lexParser.parse(lexcontent)){
        var lexcfg = lexParser.$$;
    }

    if(bnfParser.parse(bnfcontent,true)){
        var bnfcfg = bnfParser.$$;
    }

    bnfcfg.lex = lexcfg;
    bnfcfg.type = 'LR(1)';

    var rule, i=0;
    while(rule = lexcfg.rules[i++]){
        rule.regex = rule.regex.toString();
    }
    fs.writeFileSync('testcfg.js', 'var testcfg = '+JSON.stringify(bnfcfg, null, '  '));

    var start = +new Date;
    var ExprParserGenerator = new Generator(bnfcfg);
    console.log(+new Date - start + 'ms');
    console.log('closure call time:' + ExprParserGenerator.closureCount);
    console.log('repeat calc goto time:' + ExprParserGenerator.gotoItemSetRepeatCount);

    fs.writeFileSync('./generator.txt', ExprParserGenerator.toString());

    var exprParserCode = ExprParserGenerator.generate();
    fs.writeFileSync('./testparser.js', exprParserCode);

    var exprParser = eval(exprParserCode);

    exprParser.parse(inputs, true)
    console.log(exprParser.lexer.input , 'parse result:', exprParser.$$);





})();

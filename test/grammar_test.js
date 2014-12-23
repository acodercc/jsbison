/**
 *
 * bnf / lex 文法测试用例
 *
 */

module.exports = (function(){

    var Generator = require('../src/generator.js');
    var jscode;

    return {
        vardecl: function(test){
            var parseCode = new Generator({
                lex: {
                    rules: [
                        {
                            regex: /\d+/,
                            action: 'return "NUMBER";'
                        },
                        {
                            regex: /;/,
                            action: 'return ";";'
                        },
                        {
                            regex: /[\r\n]/,
                            action: 'return "NEWLINE";'
                        },
                        {
                            regex: /\+\+/,
                            action: 'return "++";'
                        }
                    ]
                },

                start: 'line',
                token: 'NUMBER ;',
                type: 'LR(1)',
                bnf: {
                    'line' : {
                        'NUMBER [noLineTerminator] ++ ;' : 'this.$$ = parseInt($1, 10) + 1;',   //产生式1
                        'NUMBER ;' : 'this.$$ = $1'         //产生式2
                    }
                },
                code: 'global.parser = parser;'
            }).generate();

            var parser = eval(parseCode);

            console.log(JSON.stringify(parser, null, '  '));


            /*
            var text = '1++;';      //应用产生式1
            parser.parse(text, true);
            test.equal(parser.$$, '2', text + ' PASSED');

            var text = '1;';        //应用产生式2
            parser.parse(text, true);
            test.equal(parser.$$, '1', text + ' PASSED');
            */


            /*
            var text = '1';         //自动补全semicolon后应用产生式2
            parser.parse(text);
            test.equal(parser.$$, '1', text + ' PASSED');
            */

            test.done();
        }
    };

}());

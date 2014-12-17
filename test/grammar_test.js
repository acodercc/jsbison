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
                        'NUMBER [noLineTerminator] ++ ;' : 'this.$$ = parseInt($1, 10) + 1;',
                        'NUMBER ;' : 'this.$$ = $1;'
                    }
                },
                code: 'global.parser = parser;'
            }).generate();

            var parser = eval(parseCode);


            var text = '1++;';
            parser.parse(text);
            test.equal(parser.$$, '2', text + ' PASSED');

            var text = '1;';
            parser.parse(text);
            test.equal(parser.$$, '1', text + ' PASSED');

            test.done();
        }
    };

}());

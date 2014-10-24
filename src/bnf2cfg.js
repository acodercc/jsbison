/**
 * canonical bnffile to jsbison-cfg(jsbison使用的json格式的context free grammar)
 */
(function(global){

    if(typeof require){
        var Generator = require('./generator.js');
    }

    var bnfParser = eval( new Generator({
        lex: {
            states:{
                exclusive: ''
            },
            rules: [{
                    regex: /\s+/,
                    action: ''      //skip whitespace
                }, {
                    regex: /\/\/.*/,
                    action: ''      //skip singleline comment
                }, {
                    regex: /\/\*(.|\n|\r)*?\*\//,
                    action: ''      //skip multiline comment
                }, {
                }
            ]
        },

        type: 'LR(1)',
        start: 'bnf',
        tokens: '',
        bnf: {
            'bnf' : {
            }
        }

    }).generate() );


    if(typeof module == 'object'){
        module.exports = bnfParser;
    }

    global.bnfParser = bnfParser;

})(this);


var fs = require('fs');
var Generator = require('../src/generator');

    var lex = new Generator({
        start: 'rulelist',

        lex: {
            states:{
                exclusive: 'INITIAL state actioncode multi_actioncode'
            },
            rules: [
                {
                    state: 'INITIAL',
                    regex: /\s+/,
                    action: ''      //skip whitespace
                },
                {
                    state: 'INITIAL',
                    regex: /\/\/.*/,
                    action: ''      //skip singleline comment
                },
                {
                    state: 'INITIAL',
                    regex: /\/\*(.|\n|\r)*?\*\//,
                    action: ''      //skip multiline comment
                },
                {
                    state: 'INITIAL',
                    regex: /</,
                    action: 'this.pushState("state"); return "<";'
                },
                {
                    state: 'state',
                    regex: />/,
                    action: 'this.popState(); return ">";'
                },
                {
                    state: 'state',
                    regex: /\w+/,
                    action: 'return "STATE";'
                },
                {
                    //匹配正则表达式
                    state: 'INITIAL',
                    regex: /[^\s]+/,
                    action: 'this.pushState("actioncode");return "REGEX";'
                },
                {
                    //在actioncode状态，一旦匹配到{，如果actionDepth为0，则转为multi_actioncode状态，并返回'{'
                    //否则不返回任何TOKEN，只是actionDepth增加
                    //转换为multi_actioncode状态后就不会在匹配到这个{了
                    state: 'actioncode',
                    regex: /\s*\{/,
                    action: 'this.pushState("multi_actioncode"); this.depth=1;  return "{";'
                },
                {
                    state: 'multi_actioncode',
                    regex: /\}/,
                    action: 'this.popState();this.popState(); return "}"'
                },
                {
                    state: 'multi_actioncode',
                    regex: /(.|\r|\n)*?[}{]/,
                    action: 'if(this.yytext[this.yyleng-1] === "{"){this.depth++;}else{this.depth--;}if(!this.depth){this.unToken(1);this.yytext = this.yytext.substr(0,this.yyleng-1);return "ACTIONBODY";}else{this.yymore()}'
                },
                {
                    state: 'actioncode',
                    regex: /[^\r\n]*/,
                    action: 'this.popState();return "ACTIONBODY";'
                }

            ]
        },

        tokens: '< > { } REGEX ACTIONBODY',
        type: 'LR(1)',
        bnf: {
            'rulelist': {
                'rulelist rule': '$1.push($2); this.$$ = $1;',
                'rule': 'this.$$ = [$1]'
            },
            'rule': {
                'state REGEX action': 'this.$$ = {regex: (new RegExp($2)), action:$3}; if($1){this.$$.state=$1} ',
                'REGEX action': 'this.$$ = {regex: (new RegExp($1)), action:$2}; '
            },
            'state':{
                '< STATE >': 'this.$$ = $2'
            },
            'action': {
                'ACTIONBODY': 'this.$$ = $1',
                '{ ACTIONBODY }': 'this.$$ = $2',
                '{ }': 'this.$$ = ""'
            }
        }

    });

    var lexparsercode = lex.generate();
    fs.writeFileSync('./lexparser.js',lexparsercode);



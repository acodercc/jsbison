/**
 * canonical lexfile to jsbison-lexer-cfg(jsbison中的lexer使用的json格式的context free grammar)
 */
var Generator = require('./generator.js');

var lexParserCode = new Generator({
    lex: {
        states:{
            exclusive: 'rules start_conditions condition_names actioncode multi_actioncode'
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
                conditions: ['rules'],
                regex: /\s+/,
                action: ''
            }, {
                conditions: ['rules'],
                regex: /</,
                action: 'this.pushState("start_conditions"); return "<";'
            }, {
                conditions: ['start_conditions'],
                regex: /\w+/,
                action: 'return "START_CONDITION";'
            }, {
                conditions: ['start_conditions'],
                regex: /,/,
                action: 'return ",";'
            }, {
                conditions: ['start_conditions'],
                regex: />/,
                action: 'this.popState(); return ">";'
            }, {
                conditions: ['INITIAL'],
                regex: /%s/,
                action: 'this.pushState("condition_names"); return "INCLUSIVE_CONDITION";'
            }, {
                conditions: ['INITIAL'],
                regex: /%x/,
                action: 'this.pushState("condition_names"); return "EXCLUSIVE_CONDITION";'
            }, {
                conditions: ['INITIAL'],
                regex: /%%/,
                action: 'this.pushState("rules");return "%%";'
            }, {
                conditions: ['condition_names'],
                regex: /[\r\n]/,
                action: 'this.popState();'
            }, {
                conditions: ['condition_names'],
                regex: /\s+/,
                action: '/* skip */'
            }, {
                conditions: ['condition_names'],
                regex: /[a-zA-Z]\w+/,
                action: 'return "CONDITION";'
            }, {
                //匹配正则表达式
                conditions: ['rules'],
                regex: /[^\s]+/,
                action: 'this.pushState("actioncode");return "REGEX";'
            }, {
                //在actioncode状态，一旦匹配到{，如果actionDepth为0，则转为multi_actioncode状态，并返回'{'
                //否则不返回任何TOKEN，只是actionDepth增加
                //转换为multi_actioncode状态后就不会在匹配到这个{了
                conditions: ['actioncode'],
                regex: /\s*\{/,
                action: 'this.pushState("multi_actioncode"); this.depth=1;  return "{";'
            }, {
                conditions: ['multi_actioncode'],
                regex: /\}/,
                action: 'this.popState();this.popState(); return "}"'
            }, {
                conditions: ['multi_actioncode'],
                regex: /(.|\r|\n)*?[}{]/,
                action: 'if(this.yytext[this.yyleng-1] === "{"){this.depth++;}else{this.depth--;}if(!this.depth){this.unToken(1);this.yytext = this.yytext.substr(0,this.yyleng-1);return "ACTIONBODY";}else{this.yymore()}'
            }, {
                conditions: ['actioncode'],
                regex: /[^\r\n]*/,
                action: 'this.popState();return "ACTIONBODY";'
            }
        ]
    },

    start: 'lex',
    tokens: '< > { } REGEX ACTIONBODY EXCLUSIVE_CONDITION INCLUSIVE_CONDITION %% START_CONDITION ,',
    type: 'LR(1)',
    bnf: {
        'lex' : {
            'definitionlist %% rulelist': 'this.$$ = {rules: $3}; this.$$.states = {}; if($1.inclusive){this.$$.states.inclusive = $1.inclusive;} if($1.exclusive){this.$$.states.exclusive = $1.exclusive;}'
        },
        'definitionlist': {
            'INCLUSIVE_CONDITION condition_names': 'this.$$ = {"inclusive":$2};',
            'EXCLUSIVE_CONDITION condition_names': 'this.$$ = {"exclusive":$2};'
        },
        'condition_names': {
            'condition_names CONDITION' : '$1.push($1);this.$$=$1;',
            'CONDITION' : 'this.$$ = [$1];'
        },
        'rulelist': {
            'rulelist rule': '$1.push($2); this.$$ = $1;',
            'rule': 'this.$$ = [$1]'
        },
        'rule': {
            '< start_conditions > REGEX action': 'this.$$ = {regex: (new RegExp($4)), action:$5}; if($1){this.$$.conditions=$2} ',
            'REGEX action': 'this.$$ = {regex: (new RegExp($1)), action:$2}; '
        },
        'start_conditions':{
            'start_conditions , START_CONDITION': '$1.push($3); this.$$ = $1;',
            'START_CONDITION': 'this.$$ = [$1];'
        },
        'action': {
            'ACTIONBODY': 'this.$$ = $1',
            '{ ACTIONBODY }': 'this.$$ = $2.replace(/[\\r\\n]/g,"")',
            '{ }': 'this.$$ = ""'
        }
    },
    code: 'global.lexParser = parser;'

}).generate();

var fs = require('fs');

fs.writeFileSync('./lex-parser.js', lexParserCode);

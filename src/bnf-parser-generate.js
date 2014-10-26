/**
 * canonical bnffile to jsbison-cfg(jsbison使用的json格式的context free grammar)
 */
var Generator = require('./generator.js');

var bnfParserCode = new Generator({
    lex: {
        states:{
            exclusive: 'parse_token parse_tokens productions parse_colon parse_symbols parse_code'
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
                regex: /%start/,
                action: 'this.pushState("parse_token"); return "DEC_START";'
            }, {
                regex: /%token/,
                action: 'this.pushState("parse_tokens"); return "DEC_TOKEN";'
            }, {
                regex: /%(left|rigth|assoc)/,
                action: 'this.pushState("parse_tokens"); return "DEC_ASSOC";'
            }, {
                conditions: ['parse_token'],
                regex: /[^\s]+/,
                action: 'this.popState(); return "TOKEN";'
            }, {
                conditions: ['parse_tokens'],
                regex: /[^\r\n]+/,
                action: 'this.popState(); return "TOKENS";'
            }, {
                regex: /%%/,
                action: 'this.pushState("productions"); return "%%";'
            }, {
                conditions: ['productions'],
                regex: /{/,
                action: 'this.pushState("parse_code"); this.depth=1; return "{"; '
            }, {
                conditions: ['productions'],
                regex: /\|/,
                action: 'this.pushState("parse_tokens");return "|";'
            }, {
                conditions: ['productions'],
                regex: /;/,
                action: 'return ";";'
            }, {
                conditions: ['productions'],
                regex: /\w+/,
                action: 'this.pushState("parse_colon");return "TOKEN"'
            }, {
                conditions: ['parse_colon'],
                regex: /:/,
                action: 'this.popState();this.pushState("parse_tokens"); return ":";'
            }, {
                conditions: ['parse_code'],
                regex: /(.|\r|\n)*?[}{]/,
                action: 'if(this.yytext[this.yyleng-1]=="{"){this.depth++;}else{this.depth--;}if(this.depth){this.yymore();}else{this.unToken(1);this.yytext=this.yytext.substr(0,this.yytext.length-1);this.popState();return "CODE"}'
            }, {
                conditions: ['productions'],
                regex: /}/,
                action: 'return "}";'
            }, {
                conditions: ['parse_token', 'parse_tokens', 'productions', 'parse_colon', 'parse_code'],
                regex: /[\s]+/,
                action: ''
            }
        ]
    },

    type: 'LR(1)',
    start: 'bnf',
    tokens: '%% CODE TOKEN TOKENS { } DEC_TOKEN DEC_START PRIORITY DEC_ASSOC',
    bnf: {
        'bnf' : {
            'declarations %% productions $end': ' this.$$ = $1; this.$$.bnf = $3; ',
            'declarations %% productions %% $end': ' this.$$ = $1; this.$$.bnf = $3; ',
            'declarations %% productions %% CODE $end' : 'this.$$ = $1; this.$$.bnf = $3; this.$$.code = $5;'
        },
        'declarations' : {
            'declarations declaration' : '_.merge($1, $2); this.$$ = $1;',
            'declaration': 'this.$$ = $1;'
        },
        'declaration' : {
            'DEC_TOKEN TOKENS' : 'this.$$ = {tokens: $2}; ',
            'DEC_START TOKEN': 'this.$$ = {start: $2};',
            'operator PRIORITY' : 'this.$$ = $1; this.$$.priority = $2; ',
            'operator' : 'this.$$ = $1; this.$$.priority = 0; '
        },
        'operator': {
            'DEC_ASSOC TOKENS' : 'this.$$ = {}; this.$$[$1] = $2;'
        },
        'productions': {
            'productions production': '_.merge($1, $2); this.$$ = $1;',
            'production': 'this.$$ = $1;'
        },
        'production': {
            'TOKEN : rhslist ;' : 'this.$$ = {}; this.$$[$1] = $3;'
        },
        'rhslist': {
            'rhslist | rhs': 'this.$$ = $1; _.merge(this.$$, $3);',
            'rhs' : 'this.$$ = $1'
        },
        'rhs': {
            'TOKENS { CODE }': 'this.$$ = {}; this.$$[$1] = $3;'
        }
    },
    code: 'global.bnfParser = parser;'


}).generate();


var fs = require('fs');

fs.writeFileSync('./bnf-parser.js', bnfParserCode);





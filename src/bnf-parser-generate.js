/**
 * canonical bnffile to jsbison-cfg(jsbison使用的json格式的context free grammar)
 */
var Generator = require('./generator.js');

var bnfParserCode = new Generator({
    lex: {
        states:{
            exclusive: 'parse_token parse_tokens productions parse_colon parse_symbols default_action parse_code parse_all_code'
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
                regex: /%defaultAction/,
                action: 'this.pushState("default_action"); return "DEC_DEFACTION";'
            }, {
                conditions: ['default_action'],
                regex: /\s*\{/,
                action: 'this.depth = 1; this.pushState("parse_code"); return "{";'
            }, {
                conditions: ['default_action'],
                regex: /\}/,
                action: 'this.popState(); return "}";'
            }, {
                conditions: ['parse_token'],
                regex: /[^\s]+/,
                action: 'this.popState(); return "TOKEN";'
            }, {
                regex: /%token/,
                action: 'this.pushState("parse_tokens"); return "DEC_TOKEN";'
            }, {
                regex: /%(left|rigth|assoc)/,
                action: 'this.pushState("parse_tokens"); return "DEC_ASSOC";'
            }, {
                conditions: ['parse_tokens'],
                regex: /[^\r\n]+/,
                action: 'this.popState(); return "TOKENS";'
            }, {
                regex: /%%/,
                action: 'this.pushState("productions"); return "%%";'
            }, {
                conditions: ['productions'],
                regex: /%%/,
                action: 'this.pushState("parse_all_code");return "%%";'
            }, {
                conditions: ['productions'],
                regex: /\|/,
                action: 'this.pushState("parse_rhs");return "|";'
            }, {
                conditions: ['productions'],
                regex: /;/,
                action: 'return ";";'
            }, {
                conditions: ['productions'],
                regex: /[\w_]+/,
                action: 'this.pushState("parse_colon");return "TOKEN";'
            }, {
                conditions: ['parse_colon'],
                regex: /:/,
                action: 'this.popState();this.pushState("parse_rhs"); return ":";'
            }, {
                conditions: ['parse_rhs'],
                regex: /[a-zA-Z_$][\w$]*/,
                action: 'return "SYMBOL";'
            }, {
                conditions: ['parse_rhs'],
                regex: /(['"])(?:\\\1|[^\1])*?\1/,
                action: 'this.yytext = this.yytext.slice(1, -1).trim();return "TOKEN";'
            }, {
                conditions: ['parse_rhs'],
                regex: /\[[a-zA-Z_$][\w$]*?\]/,
                action: 'return "PROP";'
            }, {
                conditions: ['parse_rhs'],
                regex: /{/,
                action: 'this.pushState("parse_code"); this.depth=1; return "{"; '
            }, {
                conditions: ['parse_rhs'],
                regex: /\|/,
                action: 'return "|";'
            }, {
                conditions: ['parse_rhs'],
                regex: /;/,
                action: 'this.popState();return ";";'
            }, {
                conditions: ['parse_rhs'],
                regex: /}/,
                action: 'return "}";'
            }, {
                conditions: ['parse_code'],
                regex: /(.|\r|\n)*?[}{]/,
                action: 'if(this.yytext[this.yyleng-1]=="{"){this.depth++;}else{this.depth--;}if(this.depth){this.yymore();}else{this.unToken(1);this.yytext=this.yytext.substr(0,this.yytext.length-1);this.popState();return "CODE"}'
            }, {
                conditions: ['parse_all_code'],
                regex: /[\s\S]*/,
                action: 'this.popState();return "CODE";'
            }, {
                conditions: ['parse_token', 'parse_tokens', 'productions', 'parse_colon', 'parse_code'],
                regex: /[\s]+/,
                action: ''
            }
        ]
    },

    type: 'LR(1)',
    start: 'bnf',
    tokens: '%% CODE TOKEN SYMBOL PROP TOKENS { } DEC_TOKEN DEC_DEFACTION DEC_START PRIORITY DEC_ASSOC',
    bnf: {
        'bnf' : {
            'declarations %% productions opt_ends $end': ' this.$$ = $1; this.$$.bnf = $3; ',
            'declarations %% productions %% CODE $end' : 'this.$$ = $1; this.$$.bnf = $3; this.$$.code = $5;'
        },
        'opt_ends' : {
            '%%' : '',
            '' : ''
        },
        'declarations' : {
            'declarations declaration' : '_.merge($1, $2); this.$$ = $1;',
            'declaration': 'this.$$ = $1;',
            '': 'this.$$ = {};'
        },
        'declaration' : {
            'DEC_TOKEN TOKENS' : 'this.$$ = {tokens: $2}; ',
            'DEC_DEFACTION { CODE }' : 'this.$$ = {defaultAction: $3};',
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
            'rhslist | rhscode': 'this.$$ = $1; _.merge(this.$$, $3);',
            'rhscode' : 'this.$$ = $1'
        },
        'rhscode': {
            'rhs { CODE }': 'this.$$ = {}; this.$$[$1] = $3;',
            'rhs': 'this.$$ = {}; this.$$[$1] = ""',
            '{ CODE }': 'this.$$ = {}; this.$$[""] = $2;'
        },
        'rhs' : {
            'SYMBOL' : 'this.$$ = $1',
            'TOKEN' : 'this.$$ = $1',
            'PROP' : 'this.$$ = $1',
            'rhs rhs' : 'this.$$ = $1 + " " +$2'
        }
    },
    code: 'global.bnfParser = parser;'


}).generate();


var fs = require('fs');

fs.writeFileSync('./bnf-parser.js', bnfParserCode);





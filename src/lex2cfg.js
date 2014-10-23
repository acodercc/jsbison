/**
 * canonical lexfile to jsbison-cfg(jsbison使用的json格式的context free grammar)
 */
(function(global){

    if(typeof require){
        var Generator = require('./generator.js');
    }
    debugger

    var lexParser = eval( new Generator({
        lex: {
            states:{
                exclusive: 'condition actioncode multi_actioncode condition_names rules'
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
                    state: 'rules',
                    regex: /\s+/,
                    action: ''
                }, {
                    state: 'rules',
                    regex: /</,
                    action: 'this.pushState("condition"); return "<";'
                }, {
                    state: 'condition',
                    regex: />/,
                    action: 'this.popState(); return ">";'
                }, {
                    state: 'INITIAL',
                    regex: /%s/,
                    action: 'this.pushState("condition_names"); return "INCLUSIVE_CONDITION";'
                }, {
                    state: 'INITIAL',
                    regex: /%x/,
                    action: 'this.pushState("condition_names"); return "EXCLUSIVE_CONDITION";'
                }, {
                    state: 'INITIAL',
                    regex: /%%/,
                    action: 'this.pushState("rules");return "%%";'
                }, {
                    state: 'condition_names',
                    regex: /[\r\n]/,
                    action: 'this.popState();'
                }, {
                    state: 'condition_names',
                    regex: /\s+/,
                    action: '/* skip */'
                }, {
                    state: 'condition_names',
                    regex: /[a-zA-Z]\w+/,
                    action: 'return "CONDITION";'
                }, {
                    state: 'condition',
                    regex: /\w+/,
                    action: 'return "START_CONDITION";'
                }, {
                    //匹配正则表达式
                    state: 'rules',
                    regex: /[^\s]+/,
                    action: 'this.pushState("actioncode");return "REGEX";'
                }, {
                    //在actioncode状态，一旦匹配到{，如果actionDepth为0，则转为multi_actioncode状态，并返回'{'
                    //否则不返回任何TOKEN，只是actionDepth增加
                    //转换为multi_actioncode状态后就不会在匹配到这个{了
                    state: 'actioncode',
                    regex: /\s*\{/,
                    action: 'this.pushState("multi_actioncode"); this.depth=1;  return "{";'
                }, {
                    state: 'multi_actioncode',
                    regex: /\}/,
                    action: 'this.popState();this.popState(); return "}"'
                }, {
                    state: 'multi_actioncode',
                    regex: /(.|\r|\n)*?[}{]/,
                    action: 'if(this.yytext[this.yyleng-1] === "{"){this.depth++;}else{this.depth--;}if(!this.depth){this.unToken(1);this.yytext = this.yytext.substr(0,this.yyleng-1);return "ACTIONBODY";}else{this.yymore()}'
                }, {
                    state: 'actioncode',
                    regex: /[^\r\n]*/,
                    action: 'this.popState();return "ACTIONBODY";'
                }
            ]
        },

        start: 'lex',
        tokens: '< > { } REGEX ACTIONBODY EXCLUSIVE_CONDITION INCLUSIVE_CONDITION %% START_CONDITION',
        type: 'LR(1)',
        bnf: {
            'lex' : {
                'definitionlist %% rulelist': 'this.$$ = {rules: $3}; this.$$.states = {inclusive:$1.inclusive, exclusive:$1.exclusive};'
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
                'start_condition REGEX action': 'this.$$ = {regex: (new RegExp($2)), action:$3}; if($1){this.$$.state=$1} ',
                'REGEX action': 'this.$$ = {regex: (new RegExp($1)), action:$2}; '
            },
            'start_condition':{
                '< START_CONDITION >': 'this.$$ = $2'
            },
            'action': {
                'ACTIONBODY': 'this.$$ = $1',
                '{ ACTIONBODY }': 'this.$$ = $2.replace(/[\\r\\n]/g,"")',
                '{ }': 'this.$$ = ""'
            }
        }

    }).generate() );


    if(typeof module == 'object'){
        module.exports = lexParser;
    }

    global.lexParser = lexParser;

})(this);

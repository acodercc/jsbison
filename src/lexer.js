/**
 * Yet another JavaScript Lexer
 */

(function(global){

    if(typeof require === 'function'){
        _ = require('lodash');
    }

    function Lexer(lex){

        /**
         * example:
         * [{
         *      state: 'INITIAL',
         *      regex: /\d+/,
         *      action: 'return "NUMBER"'
         * }]
         *
         */
        this.lex = lex;
        this.stateStack = [Lexer.CONST.INITIAL];

        this._setRegExRowBeginTag();
    }
    Lexer.CONST = {
        INITIAL: 'INITIAL',
        EOF:'$end'
    };

    Lexer.prototype = {
        /**
         * regex /\d/  transfer  /^\d/
         */
        _setRegExRowBeginTag: function(){
            _.each(this.lex, function(rule){
                rule.regex = eval(rule.regex.toString().replace(/^\//,'/^'));
            });
        },
        pushState: function(state){
            this.stateStack.push(state);
        },
        popState: function(){
            return this.stateStack.pop();
        },
        setInput: function(input){
            _.merge(this, {
                input: input,
                position: 0,
                matched: '',
                text: '',
                yytext: '',
                lineno: 1,
                firstline: 1,
                lastline: 1,
                firstcolumn: 1,
                lastcolumn: 1,
                _more: false
            });
        },
        //环形缓冲器
        getToken: function getTokenRing(){
            var self = this,
            token = self.getToken_();

            if(!token){
                token = self.getToken();
            }

            return token;
        },
        unToken: function(charsNum){
            this.position -= charsNum;
        },
        getCurrentRules: function(){
            var self = this,
            lex = self.lex,
            curState = self.stateStack[self.stateStack.length-1],
            rules = [];

            for(var i=0, len=lex.length; i<len; i++){
                if((!lex[i].state) || lex[i].state === curState){
                    rules.push(lex[i]);
                }
            }

            return rules;
        },
        getToken_: function(){
            var self = this,
            lex = self.lex,
            input = self.input.slice(self.position),
            regex,
            rules = self.getCurrentRules(),
            matches;

            if(!input){
                return self.CONST.EOF;
            }

            for(var i=0,len=rules.length; i<len; i++){
                regex = rules[i].regex;

                if(matches = input.match(rules[i].regex)){
                    if(self._more){
                        self.yytext += matches[0];
                    }else{
                        self.yytext = matches[0];
                    }
                    self.position += matches[0].length;
                    self.yyleng = self.yytext.length;
                    self._more = false;
                    return (new Function(rules[i].action)).call(self);
                }
            }
        },
        yymore: function(){
            this._more = true;
        },
        generate: function(){
            var self = this,
            lex = _.map(self.lex, function(rule){
                return '{regex:'+rule.regex.toString()+',action:\''+rule.action+'\'' + (rule.state ? ', state:"'+rule.state+'"' : '') + '}';
            }),
            code = [
                '(function(){',
                    'return {',
                        'CONST:' + JSON.stringify(Lexer.CONST) + ',',
                        'lex: [' + lex.join(',')  + '],',
                        'yymore:' + Lexer.prototype.yymore.toString() + ',',
                        'stateStack:' + JSON.stringify(self.stateStack) + ',',
                        'pushState:' + Lexer.prototype.pushState.toString() + ',',
                        'popState:' + Lexer.prototype.popState.toString() + ',',
                        'getCurrentRules:' + Lexer.prototype.getCurrentRules.toString() + ',',
                        'setInput:' + Lexer.prototype.setInput.toString() + ',',
                        'getToken:' + Lexer.prototype.getToken.toString() + ',',
                        'unToken:' + Lexer.prototype.unToken.toString() + ',',
                        'getToken_:' + Lexer.prototype.getToken_.toString() + '',
                    '};',
                '})()'
            ].join('\n');
            return code;
        }
    };

    if(typeof module == 'object' && module.exports){
        module.exports = Lexer;
    }else{
        global.Lexer = Lexer;
    }


})(this);

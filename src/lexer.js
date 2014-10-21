/**
 * Yet another JavaScript Lexer
 */

(function(global){

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
                lastcolumn: 1
            });
        },
        //环形缓冲器
        getToken: function getTokenRing(){
            var self = this,
                token;
            if(token = self.aheadToken){
                self.aheadToken = null;
            }else{
                token = self.getToken_();
                if(!token){
                    token = self.getToken();
                }
            }
            return token;
        },
        unToken: function(token){
            var self = this;
            self.aheadToken = token;
        },
        getCurrentRules: function(){
            var self = this,
            lex = self.lex,
            curState = self.stateStack[self.stateStack.length-1],
            rules = [];

            for(var i=0, len=lex.length; i<len; i++){
                if((!lex[i].state && curState === Lexer.CONST.INITIAL) || lex[i].state === curState){
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
                return Lexer.CONST.EOF;
            }

            for(var i=0,len=lex.length; i<len; i++){
                regex = lex[i].regex;

                if(matches = input.match(lex[i].regex)){
                    self.yytext = matches[0];
                    self.position += self.yytext.length;
                    return (new Function(lex[i].action)).call(self);
                }
            }
        },
        generate: function(){
            var self = this,
            lex = _.map(self.lex, function(rule){
                return '{regex:'+rule.regex.toString()+',action:\''+rule.action+'\'}';
            }),
            code = [
                '(function(){',
                    'return {',
                        'lex: [' + lex.join(',')  + '],',
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

    global.Lexer = Lexer;
})(this);

/**
 * Yet another JavaScript Lexer Generator
 */

(function(global){

    if(typeof require === 'function'){
        _ = require('lodash');
    }

    function Lexer(lex){

        /**
         * example:
         * [{
         *      state: 'INITIAL', //该规则在哪个状态下激活
         *      regex: /\d+/,    //该规则的正则，匹配成功的话，已匹配文本在this.yytext，在语义动作代码中可修改
         *      action: 'return "NUMBER"'  //该规则的语义动作，return的是TOKEN-name
         * }]
         *
         */
        this.states = lex.states || {};
        this.states.exclusive = this.states.exclusive || {};

        if(typeof this.states.exclusive === 'string'){
            var exclusive = {};
            _.each(this.states.exclusive.trim().split(' '), function(exclusiveState){
                exclusive[exclusiveState] = true;
            });
            this.states.exclusive = exclusive;
        }

        this.rules = lex.rules;
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
            _.each(this.rules, function(rule){
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
            rules = self.rules,
            curState = self.stateStack[self.stateStack.length-1],
            activeRules = [],
            isInclusiveState = true;           //是否为包容状态

            if(self.states.exclusive[curState]){
                isInclusiveState = false;
            }


            for(var i=0, len=rules.length; i<len; i++){

                //处于包容状态时，没有声明状态的规则被激活
                //否则，只有开始条件中包含当前状态的规则被激活
                if((isInclusiveState && (!rules[i].conditions)) || (rules[i].conditions && rules[i].conditions.indexOf(curState) > -1)){
                    activeRules.push(rules[i]);
                }
            }

            return activeRules;
        },
        getToken_: function(){
            var self = this,
            input = self.input.slice(self.position),
            regex,
            activeRules = self.getCurrentRules(),
            matches;

            if(!input){
                return self.CONST.EOF;
            }

            if(!activeRules.length){
                debugger
                //这个断点的原因是，这是编写lex文法时常见的错误，就是自动机陷入一个没有任何规则激活的状态中了
            }

            for(var i=0,len=activeRules.length; i<len; i++){
                regex = activeRules[i].regex;

                if(matches = input.match(activeRules[i].regex)){
                    if(self._more){
                        self.yytext += matches[0];
                    }else{
                        self.yytext = matches[0];
                    }
                    self.position += matches[0].length;
                    self.yyleng = self.yytext.length;
                    self._more = false;
                    return (new Function(activeRules[i].action)).call(self);
                }
            }
            debugger
            //这个断点的原因是，没有在循环体中return 说明当前输入已经无法命中任何规则，自动机将陷入死循环
        },
        yymore: function(){
            this._more = true;
        },
        generate: function(){
            var self = this,
            rules = _.map(self.rules, function(rule){
                return '{regex:'+rule.regex.toString()+',action:\''+rule.action+'\'' + (rule.conditions ? ', conditions:'+JSON.stringify(rule.conditions) : '') + '}';
            }),
            code = [
                '(function(){',
                    'return {',
                        'CONST:' + JSON.stringify(Lexer.CONST) + ',',
                        'states:' + JSON.stringify(self.states) + ',',
                        'rules: [' + rules.join(',')  + '],',
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

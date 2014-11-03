(function(global, undef){
if(typeof require === "function"){ _ = require("lodash");}
var parser = {
EOF:"$end",
reset:function (){
            var self = this;
            self.lexer.reset();
        },
lexer: (function(){
return {
CONST:{"INITIAL":"INITIAL","EOF":"$end"},
states:{"exclusive":{}},
rules: [{regex:/^a/,action:'   return "a";'},{regex:/^b/,action:'   return "b";'},{regex:/^c/,action:'   return "c";'}],
yymore:function (){
            this._more = true;
        },
stateStack:["INITIAL"],
pushState:function (state){
            this.stateStack.push(state);
        },
popState:function (){
            return this.stateStack.pop();
        },
getCurrentRules:function (){
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
setInput:function (input){
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
getToken:function (isDebug){
            var self = this,
            token = self.getToken_(isDebug);

            if(!token){
                token = self.getToken(isDebug);
            }

            return token;
        },
unToken:function (charsNum){
            this.position -= charsNum;
        },
getToken_:function (isDebug){
            var self = this,
            input = self.input.slice(self.position),
            regex,
            activeRules = self.getCurrentRules(),
            matches;

            if(!input){
                return self.CONST.EOF;
            }

            if(!activeRules.length && isDebug){
                debugger
                //这个断点的原因是，这是编写lex文法时常见的错误，就是自动机陷入一个没有任何规则激活的状态中了
            }

            var possibleInputs = [],
            maxLength = 0;

            for(var i=0,len=activeRules.length; i<len; i++){
                regex = activeRules[i].regex;

                if(matches = input.match(activeRules[i].regex)){
                    possibleInputs.push({rule:activeRules[i], match: matches[0]});
                    maxLength = maxLength > matches[0].length ? maxLength : matches[0].length;
                }
            }

            if(possibleInputs.length){
                possibleInputs = _.filter(possibleInputs, function(possible){
                    return possible.match.length === maxLength;
                });

                if(self._more){
                    self.yytext += possibleInputs[0].match;
                }else{
                    self.yytext = possibleInputs[0].match;
                }
                self.position += possibleInputs[0].match.length;
                self.yyleng = self.yytext.length;
                self._more = false;
                return (new Function(possibleInputs[0].rule.action)).call(self);
            }

            if(isDebug){
                debugger
                //这个断点的原因是，没有在循环体中return 说明当前输入已经无法命中任何规则，自动机将陷入死循环
            }
            throw('invalid input: ' + input);
        },
reset:function (){
            this.setInput(this.input);
        }
};
})(),
lrtable: {"actions":{"0":{"a":["shift",2]},"1":{"$end":["shift",3],"c":["reduce",3],"b":["shift",5]},"2":{"$end":["reduce",1],"b":["reduce",1],"c":["reduce",1]},"3":{"$end":["accept",0]},"4":{"c":["shift",7]},"5":{"c":["reduce",4]},"6":{"$end":["reduce",2],"b":["reduce",2],"c":["reduce",2]},"7":{"$end":["reduce",5],"b":["reduce",5],"c":["reduce",5]}},"gotos":{"0":{"A":1,"a":2},"1":{"$end":3,"B":4,"b":5},"2":{},"3":{},"4":{"C":6,"c":7},"5":{},"6":{},"7":{}}},
productions: [{"symbol":"$accept","nullable":false,"firsts":["a"],"rhs":["A","$end"],"srhs":"A $end","id":0,"actionCode":"this.$$ = $1;"},{"symbol":"A","nullable":false,"firsts":["a"],"rhs":["a"],"srhs":"a","id":1,"actionCode":"\n            this.$$ = $1;\n        "},{"symbol":"A","nullable":false,"firsts":["a"],"rhs":["A","B","C"],"srhs":"A B C","id":2,"actionCode":"\n            this.$$ = $1 + $2 + $3;\n        "},{"symbol":"B","nullable":true,"firsts":[],"rhs":[],"srhs":"","id":3,"actionCode":"\n            this.$$ = \"\";\n        "},{"symbol":"B","nullable":false,"firsts":["b"],"rhs":["b"],"srhs":"b","id":4,"actionCode":"\n            this.$$ = $1;\n        "},{"symbol":"C","nullable":false,"firsts":["c"],"rhs":["c"],"srhs":"c","id":5,"actionCode":" this.$$ = $1 "}],
parse:function (input, isDebug){
            var self = this,

            stateStack = [0],       //状态栈  初始状态0
            symbolStack = [],       //符号栈
            valueStack = [],        //值栈

            lexer = self.lexer,
            token,
            state;

            lexer.setInput(input);
            token = self.lexer.getToken(isDebug);

            while(true){
                debugger

                state = stateStack[stateStack.length - 1];

                var action = self.lrtable.actions[state] && self.lrtable.actions[state][token];

                if(!action && isDebug){
                    //这是编写bnf时容易出错的，通过当前输入和当前状态(状态隐含了当前入栈的符号)
                    //无法找到右端句柄，也无法通过当前输入决定应进行移进动作
                    debugger
                }

                if(isDebug){
                    console.log('当前状态:'+state, '输入符号:'+token, '动作:'+action);
                }
                if(action){
                    if(action[0] === 'shift'){
                        stateStack.push(action[1]);
                        symbolStack.push(token);
                        valueStack.push(lexer.yytext);
                        token = lexer.getToken(isDebug);
                    }else if(action[0] === 'reduce'){
                        var production = self.productions[action[1]];

                        var reduceCode = ('/*' + production.symbol + ' -> ' + production.srhs + ';*/ this.$$ = $1;'+production.actionCode)
                            .replace(/\$(\d+)/g, function(_, n){
                                return 'valueStack[' + (valueStack.length - production.rhs.length + parseInt(n, 10) - 1) + ']'
                            });

                        eval(reduceCode);


                        if(isDebug){
                            console.log(' 当前右端句柄为:' + production.rhs);
                            console.log(' 右端句柄对应值栈内容为:' + JSON.stringify(valueStack.slice(-production.rhs.length)));
                            console.log(' 归约后的值为:' + JSON.stringify(this.$$));
                        }

                        //如果是当前归约用的产生式不是epsilon:
                        //  符号栈才需要对右端句柄包含的各个symbol出栈，归约为产生式的非终结符(lhs)再入栈
                        //  值栈才需要对右端句柄对应的各个值出栈，进行归约计算为某个lhs值，再把lhs值入栈
                        //  状态栈也才需要对代表右端句柄的各个状态进行出栈，查goto表找到代表lhs符号的新状态入栈
                        //否则，应用epsilon，各栈保持原地不动
                        if(production.rhs.length){ 
                            symbolStack = symbolStack.slice(0, -production.rhs.length); 
                            valueStack = valueStack.slice(0, -production.rhs.length);
                            stateStack = stateStack.slice(0, -production.rhs.length); 
                        }

                        var curstate = stateStack[stateStack.length-1];

                        //查goto表，找到代表归约后的lhs符号的新状态
                        var newstate = self.lrtable.gotos[curstate] && self.lrtable.gotos[curstate][production.symbol];


                        if(isDebug){
                            console.log(' 右端句柄归约后的符号:'+production.symbol+',应转移到:'+newstate);
                        }
                        symbolStack.push(production.symbol);  //归约后的lhs符号，压入符号栈
                        valueStack.push(this.$$);  //语义动作中归约后的值(rhs各项计算出的lhs值)，压入值栈
                        stateStack.push(newstate); //goto表查到的新状态，压入状态栈


                    }else if(action[0] === 'accept'){
                        if(isDebug){
                            console.log('accept');
                        }
                        return true;
                    }else{
                        return false;
                    }
                }else{
                    return false;
                }
            }
        }
};
if(typeof module == "object"){module.exports = parser}

return parser;
})(this);
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
states:{"exclusive":{"parse_token":true,"parse_tokens":true,"productions":true,"parse_colon":true,"parse_symbols":true,"parse_code":true,"parse_all_code":true}},
rules: [{regex:/^\s+/,action:''},{regex:/^\/\/.*/,action:''},{regex:/^\/\*(.|\n|\r)*?\*\//,action:''},{regex:/^%start/,action:'this.pushState("parse_token"); return "DEC_START";'},{regex:/^[^\s]+/,action:'this.popState(); return "TOKEN";', conditions:["parse_token"]},{regex:/^%token/,action:'this.pushState("parse_tokens"); return "DEC_TOKEN";'},{regex:/^%(left|rigth|assoc)/,action:'this.pushState("parse_tokens"); return "DEC_ASSOC";'},{regex:/^[^\r\n]+/,action:'this.popState(); return "TOKENS";', conditions:["parse_tokens"]},{regex:/^%%/,action:'this.pushState("productions"); return "%%";'},{regex:/^%%/,action:'this.pushState("parse_all_code");return "%%";', conditions:["productions"]},{regex:/^\|/,action:'this.pushState("parse_rhs");return "|";', conditions:["productions"]},{regex:/^;/,action:'return ";";', conditions:["productions"]},{regex:/^[\w_]+/,action:'this.pushState("parse_colon");return "TOKEN";', conditions:["productions"]},{regex:/^:/,action:'this.popState();this.pushState("parse_rhs"); return ":";', conditions:["parse_colon"]},{regex:/^\w+/,action:'return "SYMBOL";', conditions:["parse_rhs"]},{regex:/^(['"])(?:\\\1|[^\1])*?\1/,action:'this.yytext = this.yytext.slice(1, -1).trim();return "TOKEN";', conditions:["parse_rhs"]},{regex:/^{/,action:'this.pushState("parse_code"); this.depth=1; return "{"; ', conditions:["parse_rhs"]},{regex:/^\|/,action:'return "|";', conditions:["parse_rhs"]},{regex:/^;/,action:'this.popState();return ";";', conditions:["parse_rhs"]},{regex:/^}/,action:'return "}";', conditions:["parse_rhs"]},{regex:/^(.|\r|\n)*?[}{]/,action:'if(this.yytext[this.yyleng-1]=="{"){this.depth++;}else{this.depth--;}if(this.depth){this.yymore();}else{this.unToken(1);this.yytext=this.yytext.substr(0,this.yytext.length-1);this.popState();return "CODE"}', conditions:["parse_code"]},{regex:/^[\s\S]*/,action:'this.popState();return "CODE";', conditions:["parse_all_code"]},{regex:/^[\s]+/,action:'', conditions:["parse_token","parse_tokens","productions","parse_colon","parse_code"]}],
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
            if(isDebug){
                debugger
                //这个断点的原因是，没有在循环体中return 说明当前输入已经无法命中任何规则，自动机将陷入死循环
            }
        },
reset:function (){
            this.setInput(this.input);
        }
};
})(),
lrtable: {"actions":{"0":{"%%":["reduce",7],"DEC_TOKEN":["shift",4],"DEC_START":["shift",5],"DEC_ASSOC":["shift",7]},"1":{"$end":["shift",8]},"2":{"%%":["shift",9],"DEC_TOKEN":["shift",4],"DEC_START":["shift",5],"DEC_ASSOC":["shift",7]},"3":{"%%":["reduce",6],"DEC_ASSOC":["reduce",6],"DEC_START":["reduce",6],"DEC_TOKEN":["reduce",6]},"4":{"TOKENS":["shift",11]},"5":{"TOKEN":["shift",12]},"6":{"PRIORITY":["shift",13],"%%":["reduce",11],"DEC_ASSOC":["reduce",11],"DEC_START":["reduce",11],"DEC_TOKEN":["reduce",11]},"7":{"TOKENS":["shift",14]},"8":{"$end":["accept",0]},"9":{"TOKEN":["shift",17]},"10":{"%%":["reduce",5],"DEC_ASSOC":["reduce",5],"DEC_START":["reduce",5],"DEC_TOKEN":["reduce",5]},"11":{"%%":["reduce",8],"DEC_ASSOC":["reduce",8],"DEC_START":["reduce",8],"DEC_TOKEN":["reduce",8]},"12":{"%%":["reduce",9],"DEC_ASSOC":["reduce",9],"DEC_START":["reduce",9],"DEC_TOKEN":["reduce",9]},"13":{"%%":["reduce",10],"DEC_ASSOC":["reduce",10],"DEC_START":["reduce",10],"DEC_TOKEN":["reduce",10]},"14":{"%%":["reduce",12],"DEC_ASSOC":["reduce",12],"DEC_START":["reduce",12],"DEC_TOKEN":["reduce",12],"PRIORITY":["reduce",12]},"15":{"%%":["shift",19],"$end":["reduce",4],"TOKEN":["shift",17]},"16":{"$end":["reduce",14],"%%":["reduce",14],"TOKEN":["reduce",14]},"17":{":":["shift",21]},"18":{"$end":["shift",22]},"19":{"CODE":["shift",23],"$end":["reduce",3]},"20":{"$end":["reduce",13],"%%":["reduce",13],"TOKEN":["reduce",13]},"21":{"SYMBOL":["shift",27],"TOKEN":["shift",28]},"22":{"$end":["reduce",1]},"23":{"$end":["shift",29]},"24":{";":["shift",30],"|":["shift",31]},"25":{";":["reduce",17],"|":["reduce",17]},"26":{"{":["shift",32],";":["reduce",19],"|":["reduce",19],"SYMBOL":["shift",27],"TOKEN":["shift",28]},"27":{";":["reduce",20],"SYMBOL":["reduce",20],"TOKEN":["reduce",20],"{":["reduce",20],"|":["reduce",20]},"28":{";":["reduce",21],"SYMBOL":["reduce",21],"TOKEN":["reduce",21],"{":["reduce",21],"|":["reduce",21]},"29":{"$end":["reduce",2]},"30":{"$end":["reduce",15],"%%":["reduce",15],"TOKEN":["reduce",15]},"31":{"SYMBOL":["shift",27],"TOKEN":["shift",28]},"32":{"CODE":["shift",35]},"33":{";":["reduce",22],"SYMBOL":["shift",27],"TOKEN":["shift",28],"{":["reduce",22],"|":["reduce",22]},"34":{";":["reduce",16],"|":["reduce",16]},"35":{"}":["shift",36]},"36":{";":["reduce",18],"|":["reduce",18]}},"gotos":{"0":{"bnf":1,"declarations":2,"declaration":3,"DEC_TOKEN":4,"DEC_START":5,"operator":6,"DEC_ASSOC":7},"1":{"$end":8},"2":{"%%":9,"declaration":10,"DEC_TOKEN":4,"DEC_START":5,"operator":6,"DEC_ASSOC":7},"4":{"TOKENS":11},"5":{"TOKEN":12},"6":{"PRIORITY":13},"7":{"TOKENS":14},"9":{"productions":15,"production":16,"TOKEN":17},"15":{"opt_ends":18,"%%":19,"production":20,"TOKEN":17},"17":{":":21},"18":{"$end":22},"19":{"CODE":23},"21":{"rhslist":24,"rhscode":25,"rhs":26,"SYMBOL":27,"TOKEN":28},"23":{"$end":29},"24":{";":30,"|":31},"26":{"{":32,"rhs":33,"SYMBOL":27,"TOKEN":28},"31":{"rhscode":34,"rhs":26,"SYMBOL":27,"TOKEN":28},"32":{"CODE":35},"33":{"rhs":33,"SYMBOL":27,"TOKEN":28},"35":{"}":36}}},
productions: [{"symbol":"$accept","nullable":false,"firsts":["DEC_TOKEN","DEC_START","DEC_ASSOC","%%"],"rhs":["bnf","$end"],"srhs":"bnf $end","id":0,"actionCode":"this.$$ = $1;"},{"symbol":"bnf","nullable":false,"firsts":["DEC_TOKEN","DEC_START","DEC_ASSOC","%%"],"rhs":["declarations","%%","productions","opt_ends","$end"],"srhs":"declarations %% productions opt_ends $end","id":1,"actionCode":" this.$$ = $1; this.$$.bnf = $3; "},{"symbol":"bnf","nullable":false,"firsts":["DEC_TOKEN","DEC_START","DEC_ASSOC","%%"],"rhs":["declarations","%%","productions","%%","CODE","$end"],"srhs":"declarations %% productions %% CODE $end","id":2,"actionCode":"this.$$ = $1; this.$$.bnf = $3; this.$$.code = $5;"},{"symbol":"opt_ends","nullable":false,"firsts":["%%"],"rhs":["%%"],"srhs":"%%","id":3,"actionCode":"this.$$ = $1;"},{"symbol":"opt_ends","nullable":true,"firsts":[],"rhs":[],"srhs":"","id":4,"actionCode":"this.$$ = $1;"},{"symbol":"declarations","nullable":false,"firsts":["DEC_TOKEN","DEC_START","DEC_ASSOC"],"rhs":["declarations","declaration"],"srhs":"declarations declaration","id":5,"actionCode":"_.merge($1, $2); this.$$ = $1;"},{"symbol":"declarations","nullable":false,"firsts":["DEC_TOKEN","DEC_START","DEC_ASSOC"],"rhs":["declaration"],"srhs":"declaration","id":6,"actionCode":"this.$$ = $1;"},{"symbol":"declarations","nullable":true,"firsts":[],"rhs":[],"srhs":"","id":7,"actionCode":"this.$$ = {};"},{"symbol":"declaration","nullable":false,"firsts":["DEC_TOKEN"],"rhs":["DEC_TOKEN","TOKENS"],"srhs":"DEC_TOKEN TOKENS","id":8,"actionCode":"this.$$ = {tokens: $2}; "},{"symbol":"declaration","nullable":false,"firsts":["DEC_START"],"rhs":["DEC_START","TOKEN"],"srhs":"DEC_START TOKEN","id":9,"actionCode":"this.$$ = {start: $2};"},{"symbol":"declaration","nullable":false,"firsts":["DEC_ASSOC"],"rhs":["operator","PRIORITY"],"srhs":"operator PRIORITY","id":10,"actionCode":"this.$$ = $1; this.$$.priority = $2; "},{"symbol":"declaration","nullable":false,"firsts":["DEC_ASSOC"],"rhs":["operator"],"srhs":"operator","id":11,"actionCode":"this.$$ = $1; this.$$.priority = 0; "},{"symbol":"operator","nullable":false,"firsts":["DEC_ASSOC"],"rhs":["DEC_ASSOC","TOKENS"],"srhs":"DEC_ASSOC TOKENS","id":12,"actionCode":"this.$$ = {}; this.$$[$1] = $2;"},{"symbol":"productions","nullable":false,"firsts":["TOKEN"],"rhs":["productions","production"],"srhs":"productions production","id":13,"actionCode":"_.merge($1, $2); this.$$ = $1;"},{"symbol":"productions","nullable":false,"firsts":["TOKEN"],"rhs":["production"],"srhs":"production","id":14,"actionCode":"this.$$ = $1;"},{"symbol":"production","nullable":false,"firsts":["TOKEN"],"rhs":["TOKEN",":","rhslist",";"],"srhs":"TOKEN : rhslist ;","id":15,"actionCode":"this.$$ = {}; this.$$[$1] = $3;"},{"symbol":"rhslist","nullable":false,"firsts":["SYMBOL","TOKEN"],"rhs":["rhslist","|","rhscode"],"srhs":"rhslist | rhscode","id":16,"actionCode":"this.$$ = $1; _.merge(this.$$, $3);"},{"symbol":"rhslist","nullable":false,"firsts":["SYMBOL","TOKEN"],"rhs":["rhscode"],"srhs":"rhscode","id":17,"actionCode":"this.$$ = $1"},{"symbol":"rhscode","nullable":false,"firsts":["SYMBOL","TOKEN"],"rhs":["rhs","{","CODE","}"],"srhs":"rhs { CODE }","id":18,"actionCode":"this.$$ = {}; this.$$[$1] = $3;"},{"symbol":"rhscode","nullable":false,"firsts":["SYMBOL","TOKEN"],"rhs":["rhs"],"srhs":"rhs","id":19,"actionCode":"this.$$ = {}; this.$$[$1] = \"\""},{"symbol":"rhs","nullable":false,"firsts":["SYMBOL"],"rhs":["SYMBOL"],"srhs":"SYMBOL","id":20,"actionCode":"this.$$ = $1"},{"symbol":"rhs","nullable":false,"firsts":["TOKEN"],"rhs":["TOKEN"],"srhs":"TOKEN","id":21,"actionCode":"this.$$ = $1"},{"symbol":"rhs","nullable":false,"firsts":["SYMBOL","TOKEN"],"rhs":["rhs","rhs"],"srhs":"rhs rhs","id":22,"actionCode":"this.$$ = $1 + \" \" +$2"}],
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
global.bnfParser = parser;
return parser;
})(this);
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
states:{"exclusive":{"rules":true,"start_conditions":true,"condition_names":true,"actioncode":true,"multi_actioncode":true}},
rules: [{regex:/^\s+/,action:''},{regex:/^\/\/.*/,action:''},{regex:/^\/\*(.|\n|\r)*?\*\//,action:''},{regex:/^\s+/,action:'', conditions:["rules"]},{regex:/^</,action:'this.pushState("start_conditions"); return "<";', conditions:["rules"]},{regex:/^\w+/,action:'return "START_CONDITION";', conditions:["start_conditions"]},{regex:/^,/,action:'return ",";', conditions:["start_conditions"]},{regex:/^>/,action:'this.popState(); return ">";', conditions:["start_conditions"]},{regex:/^%s/,action:'this.pushState("condition_names"); return "INCLUSIVE_CONDITION";', conditions:["INITIAL"]},{regex:/^%x/,action:'this.pushState("condition_names"); return "EXCLUSIVE_CONDITION";', conditions:["INITIAL"]},{regex:/^%%/,action:'this.pushState("rules");return "%%";', conditions:["INITIAL"]},{regex:/^[\r\n]/,action:'this.popState();', conditions:["condition_names"]},{regex:/^\s+/,action:'/* skip */', conditions:["condition_names"]},{regex:/^[a-zA-Z]\w+/,action:'return "CONDITION";', conditions:["condition_names"]},{regex:/^[^\s]+/,action:'this.pushState("actioncode");return "REGEX";', conditions:["rules"]},{regex:/^\s*\{/,action:'this.pushState("multi_actioncode"); this.depth=1;  return "{";', conditions:["actioncode"]},{regex:/^\}/,action:'this.popState();this.popState(); return "}"', conditions:["multi_actioncode"]},{regex:/^(.|\r|\n)*?[}{]/,action:'if(this.yytext[this.yyleng-1] === "{"){this.depth++;}else{this.depth--;}if(!this.depth){this.unToken(1);this.yytext = this.yytext.substr(0,this.yyleng-1);return "ACTIONBODY";}else{this.yymore()}', conditions:["multi_actioncode"]},{regex:/^[^\r\n]*/,action:'this.popState();return "ACTIONBODY";', conditions:["actioncode"]}],
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
lrtable: {"actions":{"0":{"INCLUSIVE_CONDITION":["shift",3],"EXCLUSIVE_CONDITION":["shift",4],"%%":["reduce",4]},"1":{"$end":["shift",5]},"2":{"%%":["shift",6]},"3":{"CONDITION":["shift",8]},"4":{"CONDITION":["shift",8]},"5":{"$end":["accept",0]},"6":{"<":["shift",12],"REGEX":["shift",13]},"7":{"%%":["reduce",2],"CONDITION":["shift",14]},"8":{"%%":["reduce",6],"CONDITION":["reduce",6]},"9":{"%%":["reduce",3],"CONDITION":["shift",14]},"10":{"$end":["reduce",1],"<":["shift",12],"REGEX":["shift",13]},"11":{"$end":["reduce",8],"<":["reduce",8],"REGEX":["reduce",8]},"12":{"START_CONDITION":["shift",17]},"13":{"ACTIONBODY":["shift",19],"{":["shift",20]},"14":{"%%":["reduce",5],"CONDITION":["reduce",5]},"15":{"$end":["reduce",7],"<":["reduce",7],"REGEX":["reduce",7]},"16":{">":["shift",21],",":["shift",22]},"17":{",":["reduce",12],">":["reduce",12]},"18":{"$end":["reduce",10],"<":["reduce",10],"REGEX":["reduce",10]},"19":{"$end":["reduce",13],"<":["reduce",13],"REGEX":["reduce",13]},"20":{"ACTIONBODY":["shift",23],"}":["shift",24]},"21":{"REGEX":["shift",25]},"22":{"START_CONDITION":["shift",26]},"23":{"}":["shift",27]},"24":{"$end":["reduce",15],"<":["reduce",15],"REGEX":["reduce",15]},"25":{"ACTIONBODY":["shift",19],"{":["shift",20]},"26":{",":["reduce",11],">":["reduce",11]},"27":{"$end":["reduce",14],"<":["reduce",14],"REGEX":["reduce",14]},"28":{"$end":["reduce",9],"<":["reduce",9],"REGEX":["reduce",9]}},"gotos":{"0":{"lex":1,"definitionlist":2},"3":{"condition_names":7},"4":{"condition_names":9},"6":{"rulelist":10,"rule":11},"10":{"rule":15},"12":{"start_conditions":16},"13":{"action":18},"25":{"action":28}}},
productions: [{"symbol":"$accept","nullable":false,"firsts":["INCLUSIVE_CONDITION","EXCLUSIVE_CONDITION","%%"],"rhs":["lex","$end"],"srhs":"lex $end","id":0,"actionCode":"this.$$ = $1;"},{"symbol":"lex","nullable":false,"firsts":["INCLUSIVE_CONDITION","EXCLUSIVE_CONDITION","%%"],"rhs":["definitionlist","%%","rulelist"],"srhs":"definitionlist %% rulelist","id":1,"actionCode":"this.$$ = {rules: $3}; this.$$.states = {}; if($1.inclusive){this.$$.states.inclusive = $1.inclusive;} if($1.exclusive){this.$$.states.exclusive = $1.exclusive;}"},{"symbol":"definitionlist","nullable":false,"firsts":["INCLUSIVE_CONDITION"],"rhs":["INCLUSIVE_CONDITION","condition_names"],"srhs":"INCLUSIVE_CONDITION condition_names","id":2,"actionCode":"this.$$ = {\"inclusive\":$2};"},{"symbol":"definitionlist","nullable":false,"firsts":["EXCLUSIVE_CONDITION"],"rhs":["EXCLUSIVE_CONDITION","condition_names"],"srhs":"EXCLUSIVE_CONDITION condition_names","id":3,"actionCode":"this.$$ = {\"exclusive\":$2};"},{"symbol":"definitionlist","nullable":true,"firsts":[],"rhs":[],"srhs":"","id":4,"actionCode":"this.$$ = {}"},{"symbol":"condition_names","nullable":false,"firsts":["CONDITION"],"rhs":["condition_names","CONDITION"],"srhs":"condition_names CONDITION","id":5,"actionCode":"$1.push($1);this.$$=$1;"},{"symbol":"condition_names","nullable":false,"firsts":["CONDITION"],"rhs":["CONDITION"],"srhs":"CONDITION","id":6,"actionCode":"this.$$ = [$1];"},{"symbol":"rulelist","nullable":false,"firsts":["<","REGEX"],"rhs":["rulelist","rule"],"srhs":"rulelist rule","id":7,"actionCode":"$1.push($2); this.$$ = $1;"},{"symbol":"rulelist","nullable":false,"firsts":["<","REGEX"],"rhs":["rule"],"srhs":"rule","id":8,"actionCode":"this.$$ = [$1]"},{"symbol":"rule","nullable":false,"firsts":["<"],"rhs":["<","start_conditions",">","REGEX","action"],"srhs":"< start_conditions > REGEX action","id":9,"actionCode":"this.$$ = {regex: (new RegExp($4)), action:$5}; if($1){this.$$.conditions=$2} "},{"symbol":"rule","nullable":false,"firsts":["REGEX"],"rhs":["REGEX","action"],"srhs":"REGEX action","id":10,"actionCode":"this.$$ = {regex: (new RegExp($1)), action:$2}; "},{"symbol":"start_conditions","nullable":false,"firsts":["START_CONDITION"],"rhs":["start_conditions",",","START_CONDITION"],"srhs":"start_conditions , START_CONDITION","id":11,"actionCode":"$1.push($3); this.$$ = $1;"},{"symbol":"start_conditions","nullable":false,"firsts":["START_CONDITION"],"rhs":["START_CONDITION"],"srhs":"START_CONDITION","id":12,"actionCode":"this.$$ = [$1];"},{"symbol":"action","nullable":false,"firsts":["ACTIONBODY"],"rhs":["ACTIONBODY"],"srhs":"ACTIONBODY","id":13,"actionCode":"this.$$ = $1"},{"symbol":"action","nullable":false,"firsts":["{"],"rhs":["{","ACTIONBODY","}"],"srhs":"{ ACTIONBODY }","id":14,"actionCode":"this.$$ = $2.replace(/[\\r\\n]/g,\"\")"},{"symbol":"action","nullable":false,"firsts":["{"],"rhs":["{","}"],"srhs":"{ }","id":15,"actionCode":"this.$$ = \"\""}],
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
global.lexParser = parser;
return parser;
})(this);
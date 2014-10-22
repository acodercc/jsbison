(function(){
if(typeof require === "function"){ _ = require("lodash");}
var parser = {
EOF:"$end",
lexer: (function(){
return {
CONST:{"INITIAL":"INITIAL","EOF":"$end"},
lex: [{regex:/^\s+/,action:'', state:"INITIAL"},{regex:/^\/\/.*/,action:'', state:"INITIAL"},{regex:/^\/\*(.|\n|\r)*?\*\//,action:'', state:"INITIAL"},{regex:/^</,action:'this.pushState("state"); return "<";', state:"INITIAL"},{regex:/^>/,action:'this.popState(); return ">";', state:"state"},{regex:/^[^\s]+/,action:'this.pushState("actioncode");return "REGEX";', state:"INITIAL"},{regex:/^\w+/,action:'return "STATE";', state:"state"},{regex:/^\s*\{/,action:'this.pushState("multi_actioncode"); this.depth=1;  return "{";', state:"actioncode"},{regex:/^\}/,action:'this.popState();this.popState(); return "}"', state:"multi_actioncode"},{regex:/^(.|\r|\n)*?[}{]/,action:'if(this.yytext[this.yyleng-1] === "{"){this.depth++;}else{this.depth--;}if(!this.depth){this.unToken(1);this.yytext = this.yytext.substr(0,this.yyleng-1);return "ACTIONBODY";}else{this.yymore()}', state:"multi_actioncode"},{regex:/^[^\r\n]*/,action:'this.popState();return "ACTIONBODY";', state:"actioncode"}],
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
getToken:function getTokenRing(){
            var self = this,
            token = self.getToken_();

            if(!token){
                token = self.getToken();
            }

            return token;
        },
unToken:function (charsNum){
            this.position -= charsNum;
        },
getToken_:function (){
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
        }
};
})(),
lrtable: {"actions":{"0":{"REGEX":["shift",4],"<":["shift",5]},"1":{"$end":["shift",6],"REGEX":["shift",4],"<":["shift",5]},"2":{"$end":["reduce",2],"<":["reduce",2],"REGEX":["reduce",2]},"3":{"REGEX":["shift",8]},"4":{"ACTIONBODY":["shift",10],"{":["shift",11]},"5":{"STATE":["shift",12]},"6":{"$end":["accept",0]},"7":{"$end":["reduce",1],"<":["reduce",1],"REGEX":["reduce",1]},"8":{"ACTIONBODY":["shift",10],"{":["shift",11]},"9":{"$end":["reduce",4],"<":["reduce",4],"REGEX":["reduce",4]},"10":{"$end":["reduce",6],"<":["reduce",6],"REGEX":["reduce",6]},"11":{"ACTIONBODY":["shift",14],"}":["shift",15]},"12":{">":["shift",16]},"13":{"$end":["reduce",3],"<":["reduce",3],"REGEX":["reduce",3]},"14":{"}":["shift",17]},"15":{"$end":["reduce",8],"<":["reduce",8],"REGEX":["reduce",8]},"16":{"REGEX":["reduce",5]},"17":{"$end":["reduce",7],"<":["reduce",7],"REGEX":["reduce",7]}},"gotos":{"0":{"rulelist":1,"rule":2,"state":3},"1":{"rule":7,"state":3},"4":{"action":9},"8":{"action":13}}},
productions: [{"symbol":"$accept","nullable":false,"firsts":["REGEX","<"],"rhs":["rulelist","$end"],"srhs":"rulelist $end","id":0,"actionCode":"this.$$ = $1;"},{"symbol":"rulelist","nullable":false,"firsts":["REGEX","<"],"rhs":["rulelist","rule"],"srhs":"rulelist rule","id":1,"actionCode":"$1.push($2); this.$$ = $1;"},{"symbol":"rulelist","nullable":false,"firsts":["<","REGEX"],"rhs":["rule"],"srhs":"rule","id":2,"actionCode":"this.$$ = [$1]"},{"symbol":"rule","nullable":false,"firsts":["<"],"rhs":["state","REGEX","action"],"srhs":"state REGEX action","id":3,"actionCode":"this.$$ = {regex: (new RegExp($2)), action:$3}; if($1){this.$$.state=$1} "},{"symbol":"rule","nullable":false,"firsts":["REGEX"],"rhs":["REGEX","action"],"srhs":"REGEX action","id":4,"actionCode":"this.$$ = {regex: (new RegExp($1)), action:$2}; "},{"symbol":"state","nullable":false,"firsts":["<"],"rhs":["<","STATE",">"],"srhs":"< STATE >","id":5,"actionCode":"this.$$ = $2"},{"symbol":"action","nullable":false,"firsts":["ACTIONBODY"],"rhs":["ACTIONBODY"],"srhs":"ACTIONBODY","id":6,"actionCode":"this.$$ = $1"},{"symbol":"action","nullable":false,"firsts":["{"],"rhs":["{","ACTIONBODY","}"],"srhs":"{ ACTIONBODY }","id":7,"actionCode":"this.$$ = $2"},{"symbol":"action","nullable":false,"firsts":["{"],"rhs":["{","}"],"srhs":"{ }","id":8,"actionCode":"this.$$ = \"\""}],
parse:function (input){
            var self = this,

            stateStack = [0],       //状态栈  初始状态0
            symbolStack = [],       //符号栈
            valueStack = [],        //值栈

            lexer = self.lexer,
            token,
            state;

            lexer.setInput(input);
            token = self.lexer.getToken();

            while(true){

                state = stateStack[stateStack.length - 1];

                var action = self.lrtable.actions[state] && self.lrtable.actions[state][token];

                console.log('当前状态:'+state, '输入符号:'+token, '动作:'+action);
                if(action){
                    if(action[0] === 'shift'){
                        stateStack.push(action[1]);
                        symbolStack.push(token);
                        valueStack.push(lexer.yytext);
                        debugger
                        token = lexer.getToken();
                    }else if(action[0] === 'reduce'){
                        var production = self.productions[action[1]];

                        var runstr = 'var $0 = stateStack.length-1;' + production.actionCode
                            .replace(/\$(\d+)/g, function(_, n){
                                return 'valueStack[' + (valueStack.length - production.rhs.length + parseInt(n, 10) - 1) + ']'
                            });


                        eval(runstr);

                        stateStack = stateStack.slice(0, -production.rhs.length); 
                        symbolStack = symbolStack.slice(0, -production.rhs.length); 
                        valueStack = valueStack.slice(0, -production.rhs.length);
                        var curstate = stateStack[stateStack.length-1];

                        var newstate = self.lrtable.gotos[curstate] && self.lrtable.gotos[curstate][production.symbol];
                        console.log(' 右端句柄归约后的符号:'+production.symbol+',应转移到:'+newstate);
                        symbolStack.push(production.symbol);
                        valueStack.push(this.$$);
                        stateStack.push(newstate);


                    }else if(action[0] === 'accept'){
                        console.log('accept');
                        console.log(this.$$);
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
})();
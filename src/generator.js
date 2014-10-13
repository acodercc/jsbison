(function(global){


    function Generator(cfg){

        this.cfg = cfg;
        this.bnf = cfg.bnf;

        this.symbols = {};
        this._symbolId = 2;

        this.tokens = _.isString(cfg.tokens) ? cfg.tokens.split(' ') : cfg.tokens;

        this.productions = [];

        this.terminals = [];
        this.nonterminals = {};

        this.actions = [
            'switch(yystate) {'
        ];

        this._build();

        this.actions.push('}');

        this.actions = this.actions.join('\n');

        this.action = function(yytext, yyleng, yy, yystate, $$, $_){
        };


        this.augmentGrammar();

        this.lookaheads();



        if(cfg.type == 'LL(1)'){

            this.buildLLTable();

            this.parse = this.llparse;

        }else if(cfg.type == 'SLR(1)'){

            this.buildItemSets();
            this.buildLRTable();

            this.parse = this.lrparse;

        }else if(cfg.type == 'LR(1)'){

            this.buildItemSets();
            this.buildLRTable();

        }else if(cfg.type == 'LALR'){
            this.buildItemSets();
            this.buildLRTable();
        }


    }

    Generator.prototype = {
        toString: function(){
            var str = '';
            str += '\nsymbols: ' + JSON.stringify(this.symbols) + ' \n\n';
            str += 'productions: \n' + this.productions.join('\n') + ' \n\n';
            str += 'nonterminals: \n' + _.values(this.nonterminals).join('\n') + ' \n\n';
            if(this.cfg.type === 'LL(1)'){
                str += 'LL(1) Table: \n' + JSON.stringify(this.lltable) + ' \n\n';
                if(this.conflict){
                    str += '!!Conflict: \n' + JSON.stringify(this.conflict, null, ' ') + ' \n\n';
                }
            }
            if(this.cfg.type === 'SLR(1)'){

                str += 'LR ItemSets: \n' + JSON.stringify(this.itemSets_) + '\n\n';

                str += 'SLR(1) Action Table: \n' + JSON.stringify(this.states, null, '') + ' \n\n';
            }

            return str;
        },
        _addSymbol: function(symbol){
            if(!_.has(this.symbols, symbol)){
                this.symbols[symbol] = this._symbolId++;
            }
        },
        _build: function(){
            var self = this,
            p, n;


            for(var nonterminalSymbol in self.bnf){
                self._addSymbol(nonterminalSymbol);

                n = new DataTypes.NonTerminal(nonterminalSymbol);
                //self.nonterminals.push(n);
                self.nonterminals[n.symbol] = n;

                _.forIn(self.bnf[nonterminalSymbol], function(actionCode, production){
                    p = new DataTypes.Production(nonterminalSymbol, production, self.productions.length+1);
                    self.productions.push(p);
                    n.productions.push(p);
                    p.rhs.forEach(function(symbol){
                        self._addSymbol(symbol);
                    });
                });
            }

            _.forIn(self.symbols, function(symbolId, symbol){
                if(!_.has(self.nonterminals, symbol)){
                    self.terminals.push(symbol);
                }
            });

        },

        augmentGrammar: function(){
            var self = this,
                acceptSymbol = self.acceptSymbol = '$accept',
                EOF = self.EOF = '$end',
                acceptProduction = new DataTypes.Production(acceptSymbol, [self.cfg.start, EOF], 0),
                acceptNonterminal = new DataTypes.NonTerminal(acceptSymbol);



            acceptNonterminal.productions.push(acceptProduction);
            self.nonterminals[acceptSymbol] = acceptNonterminal;

            self.symbols[acceptSymbol] = 0;
            self.symbols[EOF] = 1;

            self.productions.unshift(acceptProduction);

            self.terminals.unshift(EOF);

        },

        lookaheads: function(){
            this.nullable();
            this.firsts();
            this.follows();
        },


        _nullable: function(p){
            var self = this;

            if(_.isString(p)){

                //is epsilon
                if(!p.length){
                    return true;
                }
                if(_.indexOf(self.terminals,p) !== -1){
                    return false;
                }
                if(self.nonterminals[p]){
                    return self.nonterminals[p].nullable;
                }
            }
            if(_.isArray(p)){       //rhs
                for(var i=0; i<p.length; i++){
                    if(!self._nullable(p[i])){
                        return false;
                    }
                }
                return true;
            }
        },

        nullable: function(){
            var self = this,
            cont = true;

            while(cont){
                cont = false;

                self.productions.forEach(function(production){
                    if(!production.nullbale){
                        cont = production.nullable = self._nullable(production.rhs);
                    }
                });

                _.forIn(self.nonterminals, function(nonterminal){
                    for(var i=0,p; p=nonterminal.productions[i]; i++){
                        if(p.nullable){
                            if(!nonterminal.nullable){
                                cont = nonterminal.nullable = true;
                            }
                        }
                    }
                });
            }

        },


        /**
         * 计算follows集合时也要用到，所以从Generator.prototype.firsts中提取出来
         */
        _first: function(symbol){

            var self = this,
            firsts = [];

            if(_.isString(symbol)){
                if(_.indexOf(self.terminals,symbol) !== -1){
                    firsts.push(symbol);
                    return firsts;
                }
                if(self.nonterminals[symbol]){
                    return self.nonterminals[symbol].firsts;
                }
            }else if(_.isArray(symbol)){
                var rhs = symbol;

                for(var i=0; symbol=rhs[i]; i++){
                    firsts = _.union(firsts, self._first(symbol));
                    if(self.nonterminals[symbol] && !self.nonterminals[symbol].nullable || _.indexOf(self.terminals,symbol) !== -1){
                        return firsts;
                    }
                }
            }
            return firsts;
        },

        firsts: function(){
            var self = this;

            var cont = true;
            while(cont){
                cont = false;

                _.each(this.productions, function(p){
                    var firsts = self._first(p.rhs);
                    if(p.firsts.length !== firsts.length){
                        p.firsts = firsts;
                        cont = true;
                    }
                });

                _.forIn(this.nonterminals, function(n){
                    var firsts = _.uniq(_.flatten(_.collect(n.productions, function(p){
                        return p.firsts;
                    })));

                    if(n.firsts.length !== firsts.length){
                        n.firsts = firsts;
                        cont = true;
                    }

                });


            }
        },

        follows: function(){
            var self = this,
            cont = true;

            while(cont){
                cont = false;
                _.each(self.productions, function(p){
                    _.each(p.rhs, function(symbol, index){
                        var n, afterRHS, follows;
                        if(n = self.nonterminals[symbol]){
                            afterRHS = p.rhs.slice(index+1);
                            if(!afterRHS.length){
                                follows = self.nonterminals[p.symbol].follows;
                            }else{
                                follows = self._first(afterRHS);

                                if(self._nullable(afterRHS)){
                                    follows = _.union(follows, self.nonterminals[p.symbol].follows);
                                }
                            }
                            follows = _.union(follows, n.follows);
                            if(follows.length !== n.follows.length){
                                n.follows = follows;
                                cont = true;
                            }
                        }
                    });
                });
            }

        },

        /**
         * 构造用于推导语法解析树的预测分析表  LL(1)
         *
         * 推导一个非终结符时，需要确定现在使用哪个RHS进行推导
         * 那么，需要知道现在推导哪个非终结符
         * 并且需要知道接下来输入的token是什么
         *
         * 构造方法是：
         *  1. 以每个非终结符来创建row
         *  2. 遍历该非终结符的产生式，以该产生式的firsts集合中的每个token为列，设置为该产生式
         *  3. 如该产生式是可以推导出epsilon的，则遍历该非终结符的follows集合，应用该产生式
         *
         * 注：
         *  1. 如果某非终结符的各个产生式的firsts集合有交集，那么该文法就不是LL(1)的，可能是LL(k)的
         *  2. 出现了上述情况，需要生成的预测分析表进行报错
         *
         */
        buildLLTable: function(){
            var self = this,
            lltable = this.lltable = {};

            var conflict = {}, isConflict;

            _.each(self.productions, function(p){
                var symbol = lltable[p.symbol] = lltable[p.symbol] || {};

                _.each(p.firsts, function(token){
                    symbol[token] = symbol[token] || [];
                    symbol[token].push(p.id);
                    if(symbol[token].length > 1){
                        conflict[p.symbol] = token;
                        isConflict = true;
                    }
                });

                if(p.nullable){
                    _.each(self.nonterminals[p.symbol].follows, function(token){
                        symbol[token] = symbol[token] || [];
                        symbol[token].push(p.id);
                        if(symbol[token].length > 1){
                            conflict[p.symbol] = token;
                            isConflict = true;
                        }
                    });
                }
            });

            if (isConflict) {
                var conflicts = [];
                _.forIn(conflict, function(token, symbol){
                    conflicts[conflicts.length] = {
                        symbol: symbol,
                        token: token,
                        productions: _.map(lltable[symbol][token],function(pid){return self.productions[pid].srhs})
                    };
                });
                this.conflict = conflicts;
            }

            return lltable;
        },

        /**
         * 构造项集族
         *
         *  1. 首先创建初始状态的项集： 基于增广文法符号S'的产生式的项集，并计算项集闭包
         *  2. 进入C0循环，C0循环的结束条件是，上次循环执行后，未使项集族生长
         *  3. 遍历项集族中每个项集I，遍历项集I上输入点不在最后的项x，拿到项x的输入点位置的dotSymbol
         *  4. 计算项集I的dotSymbol的goto项集G
         *  5. 设置项集I的goto表上dotSymbol的转换为项集G
         *  6. 将新项集加入项集族
         *
         */
        buildItemSets: function(){
            var self = this,
                item0 = new DataTypes.Item(self.productions[0], 0, [self.EOF]),  //S' -> S #dotPos=0
                itemSet0 = new DataTypes.ItemSet();

            itemSet0.push(item0);

            var firstItemSet = self._closureItemSet(itemSet0),
                itemSets = this.itemSets = [],
                itemSets_ = this.itemSets_ = {},
                curlength;

            itemSets_[firstItemSet] = 0;     //key is DataTypes.ItemSet.prototype.toString
            itemSets.push(firstItemSet);

            curlength=0;

            while(curlength !== itemSets.length){   //C0 
                curlength = itemSets.length;

                _.each(itemSets, function(itemSet){
                    _.each(itemSet.subItems, function(item){

                        if(item.dotSymbol){
                            var newItemSet = self._gotoItemSet(itemSet, item.dotSymbol);

                            //该状态未曾创建过
                            if(itemSets_[newItemSet] === undefined){

                                //原itemSet通过该dotSymbol，转换到的新itemSet的序号
                                itemSet.gotos[item.dotSymbol] = itemSets.length;

                                itemSets_[newItemSet] = itemSets.length;      //设置该状态
                                itemSets.push(newItemSet);
                            }else{
                                itemSet.gotos[item.dotSymbol] = itemSets_[newItemSet];
                            }
                        }

                    });
                });
            }
            return itemSets;
        },

        /**
         * 求某个项集状态上，通过某个symbol的输入，所能到达的项集
         *
         * 遍历该项集的每个项，
         * 如果指定的symbol是这个项的dotSymbol，
         * 基于该项的产生式，dotPos后移一位，创建新项，
         * 增加到goto项集中，计算goto项集的闭包项集，返回
         * 
         */
        _gotoItemSet: function(itemSet, symbol){
            var self = this,
                gotoItemSet = new DataTypes.ItemSet();

            _.each(itemSet.subItems, function(item){
                if(item.dotSymbol === symbol){
                    gotoItemSet.push(new DataTypes.Item(item.production, item.dotPosition+1));
                }
            });

            if (gotoItemSet.subItems.length){
                gotoItemSet = self._closureItemSet(gotoItemSet);
            }
            return gotoItemSet;
        },

        /**
         * 求一个项集的闭包项集:
         *
         *  在一个大的循环体C0中，遍历当前闭包项集中的每个项，查看每个项的dotSymbol是否为非终结符
         *  如dotSymbol是非终结符，就基于 推导该非终结符的产生式，创建dotPosition为0的闭包项(非内核项)
         *
         * 外层的大循环体C0的结束条件是：
         *   该次C0循环中遍历闭包项集时，并未找到未推导过的非终结符，所以未创建过闭包项
         *
         */
        _closureItemSet: function(itemSet){

            var self = this,
            closureItemSet = new DataTypes.ItemSet(),
            cont = true,
            closureSymbolHash = {};

            while(cont){         //C0
                cont = false;
                closureItemSet.union(itemSet);
                itemSet = new DataTypes.ItemSet();
                _.each(closureItemSet.subItems, function(item){        //each closureItems
                    if(item.dotSymbol && self.nonterminals[item.dotSymbol]){
                        if(!closureSymbolHash[item.dotSymbol]){         //exists un derivation nonterminal
                            _.each(self.nonterminals[item.dotSymbol].productions, function(p){
                                itemSet.push(new DataTypes.Item(p, 0)); //new clsoure-item
                                cont = true;                            //C0 continue
                            });
                            closureSymbolHash[item.dotSymbol] = true;   //cur nonterminal derivated
                        }
                    }
                });
            }
            return closureItemSet;
        },

        buildLRTable: function(){

            var self = this;

            self.buildLRActionTable();
            self.buildLRGotoTable();

        },
        buildLRActionTable: function(){
            var self = this,
            states = this.states = {};

            _.each(self.itemSets, function(itemSet, stateNum){
                var state = states[stateNum] = states[stateNum] || {};

                _.each(itemSet.subItems, function(item){

                    // A -> ab.c   and   itemSet.gotos[c]
                    if(item.dotSymbol && _.indexOf(self.terminals, item.dotSymbol)){
                        //移入
                        if(!!itemSet.gotos[item.dotSymbol]){
                            state[item.dotSymbol] = ['shift', itemSet.gotos[item.dotSymbol]];
                        }
                    }

                    // A -> abc.
                    if(!item.dotSymbol){

                        if(item.production.symbol === self.acceptSymbol){

                            //A === S' 接受
                            state[self.EOF] = ['accept', item.production.id];
                        }else{
                            //A !== S' 归约
                            _.each(self.nonterminals[item.production.symbol].follows, function(symbol){
                                state[symbol] = ['reduce', item.production.id];
                            });
                        }
                    }
                });
            });
        },

        buildLRGotoTable: function(){

            var self = this,
            states = self.states,
            gotos = self.gotos = {},
            lrtable = self.lrtable = {actions: states, gotos: gotos};

            _.each(self.itemSets, function(itemSet, itemNum){
                g = gotos[itemNum] = {};

                _.forIn(itemSet.gotos, function(goItemNum, symbol){
                    if(self.nonterminals[symbol]){
                        g[symbol] = goItemNum;
                    }
                });

            });

            return gotos;
        },

        lrparse: function(input){
            var self = this,
            lexer = this.lexer = new Lexer(this.cfg.lex, input),
            stateStack = [0],
            symbolStack = [],
            token = lexer.getToken(),
            state;

            while(token){

                state = stateStack[stateStack.length - 1];

                var action = self.lrtable.actions[state] && self.lrtable.actions[state][token];

                if(action){
                    if(action[0] === 'shift'){
                        stateStack.push(action[1]);
                        symbolStack.push(token);
                        console.log(token);
                        token = lexer.getToken();
                    }else if(action[0] === 'reduce'){
                        var production = self.productions[action[1]];
                        stateStack = stateStack.slice(0, -production.rhs.length); 
                        symbolStack = symbolStack.slice(0, -production.rhs.length); 
                        var curstate = stateStack[stateStack.length-1];

                        var newstate = self.lrtable.gotos[curstate] && self.lrtable.gotos[curstate][production.symbol];
                        symbolStack.push(production.symbol);
                        stateStack.push(newstate);
                    }else if(action[0] === 'accept'){
                        console.log('accept');
                        return true;
                    }
                }



            }
        }

    };


    global.Generator = Generator;
})(this);

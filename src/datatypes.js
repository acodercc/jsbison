(function(global){
    
    if(typeof require === 'function'){
        _ = require('lodash');
    }

    var DataTypes = function(){

        function Production(symbol, rhs, id, actionCode){
            this.symbol = symbol;
            this.nullable = false;
            this.firsts = [];
            if(_.isString(rhs)){
                rhs = rhs.trim();
                if(rhs === ''){
                    rhs = [];
                }else{
                    rhs = rhs.split(' ');
                }
            }
            
            this.rhs = rhs;
            this.srhs = rhs.join(' ');
            this.id = id;
            this.actionCode = actionCode || 'this.$$ = $1;'
        }

        Production.prototype = {
            toString: function(dotPos){
                var srhs = this.srhs, dotRhs;

                if(dotPos !== undefined){
                    dotRhs = this.rhs.concat();
                    dotRhs.splice(dotPos, 0, '▪');

                    srhs = dotRhs.join(' ');
                }
                return 'production:{ id:'+this.id + ', lhs:' + this.symbol + ', rhs:' + srhs + '\t\tfirsts:' + this.firsts.join(',') + ' }';
            },
            equals: function(b){
                return this.symbol === b.symbol && this.srhs === b.srhs;
            }
        };

        function NonTerminal(symbol){
            this.symbol = symbol;
            this.nullable = false;
            this.productions = [];
            this.firsts = [];
            this.follows = [];
        }
        NonTerminal.prototype = {
            toString: function(){
                return this.symbol + '\tproductions:' + this.productions.map(function(p){return p.id}).sort().join(',') + '\t\t\t\t\tfirsts:' + this.firsts.join(' ')  + '\t\t\t\t\tfollows:' + this.follows.join(' ');
            }
        };

        function Item(production, dotPosition, lookaheads){
            this.production = production;
            this.dotPosition = dotPosition || 0;
            this.lookaheads = lookaheads || [];

            this.dotSymbol = production.rhs[dotPosition];

            this.id = parseInt(production.id + 'a' + dotPosition, 36) + lookaheads.sort().join(',');
        }
        Item.prototype = {
            equals: function(b){
                return this.id === b.id;
            },
            toString: function(){
                return this.production.toString(this.dotPosition) + '\t\tdotPos:' + this.dotPosition + '\t\tlookaheads:' + this.lookaheads.sort().join(',');
            }
        };

        function ItemSet(){

            this.subItems = [];
            this._hash = {};

            this.gotos = {};
        }
        ItemSet.prototype = {
            key: function(){
                var _key = _.map(this.subItems, function(item){
                    return item.id;
                }).sort().join('|');
                this.key = function(){return _key};
                return _key;
            },
            push: function(item){
                this.subItems.push(item);
                this._hash[item.id] = true;
            },
            contains: function(item){
                return this._hash[item.id] !== undefined;
            },
            concat: function(itemSet){
                var items = itemSet.subItems;
                for(var i=0; i<items.length; i++){
                    this.push(items[i]);
                }
            },
            union: function(itemSet){
                var items = itemSet.subItems;
                for(var i=0; i<items.length; i++){
                    if(this._hash[items[i].id] === undefined){
                        this.push(items[i]);
                    }
                }
            },
            equals: function(b){
                return this.key() === b.key();
            },
            toString: function(){
                return this.subItems.map(function(item){return item.id;}).sort(function(a,b){return a-b}).join('|');
            }
        };


        return {
            Production: Production,
            NonTerminal: NonTerminal,
            Item: Item,
            ItemSet: ItemSet
        };

    }();


    if(typeof module == 'object' && module.exports){
        module.exports = DataTypes;
    }else{
        global.DataTypes = DataTypes;
    }

})(this);

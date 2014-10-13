(function(global){
    
    var DataTypes = function(){

        function Production(symbol, rhs, id){
            this.symbol = symbol;
            this.nullable = false;
            this.firsts = [];
            this.rhs = _.isString(rhs) ? rhs.split(' ') : rhs;
            this.srhs = _.isString(rhs) ? rhs : rhs.join(' ');
            this.id = id;
        }

        Production.prototype = {
            toString: function(){
                return this.id + '. ' + this.symbol + ' -> ' + this.srhs + '\t\t\t\t\tfirsts:' + this.firsts.join(',');
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

        function Item(production, dotPosition, follows){
            this.production = production;
            this.dotPosition = dotPosition || 0;
            this.follows = follows || [];

            this.dotSymbol = production.rhs[dotPosition];

            this.id = parseInt(production.id + 'a' + dotPosition, 36);
        }

        function ItemSet(){

            this.subItems = [];
            this._hash = {};

            this.gotos = {};
        }
        ItemSet.prototype = {
            push: function(item){
                this.subItems.push(item);
                this._hash[item.id] = true;
            },
            contains: function(item){
                return this._hash[item.id];
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
                    if(!this._hash[items[i].id]){
                        this.push(items[i]);
                    }
                }
            },
            toString: function(){
                return this.subItems.map(function(a){return a.id;}).sort(function(a,b){return a-b}).join('|');
            }
        };


        return {
            Production: Production,
            NonTerminal: NonTerminal,
            Item: Item,
            ItemSet: ItemSet
        };

    }();


    this.DataTypes = DataTypes;

})(this);

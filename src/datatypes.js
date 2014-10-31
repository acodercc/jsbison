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
            this.lookaheads = lookaheads || {};

            this.dotSymbol = production.rhs[dotPosition];

            this.id = parseInt(production.id + 'a' + dotPosition, 36);
            this.key = this.id + '_' + Object.keys(lookaheads).sort().join('|');
        }
        Item.prototype = {
            equals: function(b){
                /*
                if(this.coreEquals(b)){
                    return this.lookaheads.sort().join('||') === b.lookaheads.sort().join('||');
                }
                return false;
                */
                return this.key === b.key;
            },
            coreEquals: function(b){
                //return this.production.equals(b.production) && this.dotPosition === b.dotPosition;

                return this.id === b.id;
            },
            toString: function(){
                return this.production.toString(this.dotPosition) + '\t\tdotPos:' + this.dotPosition + '\t\tlookaheads:' + Object.keys(this.lookaheads).sort().join(',');
            }
        };

        function ItemSet(){

            this.subItems = [];
            this._hash = {};

            this.gotos = {};
        }
        ItemSet.prototype = {
            key: function(){
                if(this._key){
                    return this._key;
                }else{
                    return this._key = _.map(this.subItems, function(item){
                        return item.key;
                    }).sort().join('_');
                }
            },
            coreKey: function(){
                if(this._coreKey){
                    return this._coreKey;
                }else{
                    return this._coreKey = _.map(this.subItems, function(item){
                        return item.id;
                    }).sort().join('_');
                }
            },
            coreIndexOf: function(item){
                for(var i=0,len=this.subItems.length; i<len; i++){
                    if(this.subItems[i].coreEquals(item)){
                        return i;
                    }
                }
                return -1;
            },
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
            coreEquals: function(b){
                /*
                if(this.subItems.length !== b.subItems.length){
                    return false;
                }
                _.each(this.subItems, function(item, idx){
                    if(!item.coreEquals(b.subItems[idx])){
                        return false;
                    }
                });
                return true;
                */
                return this.coreKey() === b.coreKey();
            },
            equals: function(b){
                /*
                if(this.subItems.length !== b.subItems.length){
                    return false;
                }
                for(var i=0,len=this.subItems.length; i<len; i++){
                    if(!this.subItems[i].equals(b.subItems[i])){
                        return false;
                    }
                }
                return true;
                */
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

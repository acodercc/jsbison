/**
 * Yet another JavaScript Lexer
 */

(function(global){

    function Lexer(lex){

        /**
         * example:
         * [{
         * regex: /\d+/,
         * token: 'NUMBER'
         * }]
         *
         */
        this.lex = lex;


        this._setRegExRowBeginTag();
    }

    Lexer.prototype = {
        /**
         * regex /\d/  transfer  /^\d/
         */
        _setRegExRowBeginTag: function(){
            _.each(this.lex, function(rule){
                rule.regex = eval(rule.regex.toString().replace(/^\//,'/^'));
            });
        },
        setInput: function(input){
            _.merge(this, {
                input: input,
                position: 0,
                matched: '',
                text: '',
                match: '',
                lineno: 1,
                firstline: 1,
                lastline: 1,
                firstcolumn: 1,
                lastcolumn: 1
            });
        },
        //环形缓冲器
        getToken: function getTokenRing(EOF){
            var self = this,
                token;
            if(token = self.aheadToken){
                self.aheadToken = null;
            }else{
                token = self.getToken_();
            }
            if(token == undefined){
                token = EOF;
            }
            return token;
        },
        unToken: function(token){
            self.aheadToken = token;
        },
        getToken_: function(){
            var self = this,
            lex = self.lex,
            input = self.input.slice(self.position),
            regex,
            matches;

            for(var i=0,len=lex.length; i<len; i++){
                regex = lex[i].regex;

                if(matches = input.match(lex[i].regex)){
                    self.match = matches[0];
                    self.position += self.match.length;
                    return lex[i].token;
                }
            }
        },
        generate: function(){
            var self = this,
            lex = _.map(self.lex, function(rule){
                return '{regex:'+rule.regex.toString()+',token:"'+rule.token+'"}';
            }),
            code = [
                '(function(){',
                    'return {',
                        'lex: [' + lex.join(',')  + '],',
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

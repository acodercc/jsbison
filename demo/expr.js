(function(){

    var fs = require('fs');
    var lexparser = require('../src/lex2cfg.js');
    var exprbody = fs.readFileSync('expr.l');

    var jsonlex = lexparser.parse(exprbody.toString());



})();

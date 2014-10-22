
var fs = require('fs');
var lexparser = require('./lexparser.js');
var exprbody = fs.readFileSync('expr.l');


var jsonlex = lexparser.parse(exprbody.toString());




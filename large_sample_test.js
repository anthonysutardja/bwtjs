var HTS = require('./bwt.js');
var filesys = require('fs');
filesys.readFile('./sample', {encoding: 'utf-8'},function(err, data) {
    var numArr = HTS.convertUnicodeToNumberArray(data);
    var blah = HTS.dc3(numArr, 60);
    console.log(blah.length);
});

var HTS = require('./bwt.js');
var filesys = require('fs');
filesys.readFile('./sample', {encoding: 'utf-8'},function(err, data) {
    data = data.split("\n").slice(1).join("");
    
    var transformed = HTS.bwt(data);
    console.log(transformed.length);
    var formatted = [];
    for (var i = 0; i < transformed.length; i += 80) {
        HTS.extendArray(formatted, transformed.slice(i, i+80));
        formatted.push('\n');
    }
    filesys.writeFile('./sample.bwt', formatted.join(""), function(err){
        if (err) throw err;
        console.log('woohoo');
    });
});

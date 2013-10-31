var filesys = require('fs');
filesys.readFile('./sample', {encoding: 'utf-8'},function(err, data) {
    var numArr = FS.convertUnicodeToNumberArray(data);
    var blah = FS.dc3(numArr, 60);
    console.log(blah.length);
});

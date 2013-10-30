var assert = require("assert");
var FS = require("../bwt.js");

describe('FS', function() {
    describe('#_convertTextToCharPair(text)', function() {
        it('should return a list of charpairs', function() {
            var text = [1, 2, 2, 3, 2, 1];
            var numberText = FS._convertTextToCharPair(text);
            numberText.forEach(function(el, idx) {
                assert.equal(idx, el.idx);
                assert.equal(text[idx], el.ch);
            });

            assert.equal(text.length, numberText.length);
        });
    });
    
    describe('#_create_r_n(n, text)', function() {
        it('should return a list of triplets (tuples) when n = 0', function() {
            var text = [1, 2, 2, 3, 2, 1];
            var numberText = FS._convertTextToCharPair(text);
            var r0 = FS._create_r_n(0, numberText);
            assert.equal(Math.ceil(numberText.length / 3), r0.length);
        });
    });
});

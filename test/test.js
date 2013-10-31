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
        it('should return a list of triplets (tuples) when n = {0,1,2}', function() {
            var text = [1, 2, 2, 3, 2, 1];
            var numberText = FS._convertTextToCharPair(text);
            var r0 = FS._create_r_n(0, numberText);
            assert.equal(Math.ceil(numberText.length / 3), r0.length);
            var r1 = FS._create_r_n(1, numberText);
            assert.equal(Math.ceil(numberText.slice(1).length / 3), r1.length);
            assert.equal(0, r1[1].get(2).ch);
            var r2 = FS._create_r_n(2, numberText);
            assert.equal(Math.ceil(numberText.slice(2).length / 3), r2.length);
        });
    });

    describe('#radixSortTuples(lists, maxValue)', function() {
        it('should return a sorted list of triplets (tuples)', function() {
            var text = [1, 2, 2, 3, 2, 1, 1, 1, 1];
            var numberText = FS._convertTextToCharPair(text);
            var r0 = FS._create_r_n(0, numberText);
            var r0Sorted = FS.radixSortTuples(r0, 4);
            assert.equal(3, r0Sorted.length);
            
            var idx = "" + 0;
            var tupleCheck = "" + r0Sorted[idx].get(0).ch + r0Sorted[idx].get(1).ch + r0Sorted[idx].get(2).ch;
            assert.equal("111", tupleCheck);

            idx = "" + 1;
            tupleCheck = "" + r0Sorted[idx].get(0).ch + r0Sorted[idx].get(1).ch + r0Sorted[idx].get(2).ch;
            assert.equal("122", tupleCheck);

            idx = "" + 2;
            tupleCheck = "" + r0Sorted[idx].get(0).ch + r0Sorted[idx].get(1).ch + r0Sorted[idx].get(2).ch;
            assert.equal("321", tupleCheck);
        });
    });


    describe('#createNewLabels(sortedArray)', function() {
        it('should return an object with new labels for tuples', function() {
            var text = [1, 2, 2, 1, 1, 1, 1, 1, 1];
            var numberText = FS._convertTextToCharPair(text);
            var r0 = FS._create_r_n(0, numberText);
            var r0Sorted = FS.radixSortTuples(r0, 4);
            var labels = FS.createNewLabels(r0Sorted);
            assert.equal(2, labels.size);
            assert.equal(1, labels[r0Sorted[0].toString()]);
            assert.equal(2, labels[r0Sorted[2].toString()]);
        });
    });

    describe('#dc3(text)', function() {
        it('should return a suffix array of text', function() {
            var text = [6, 5, 4, 3, 2, 2, 2, 3, 1];
            var suffixArray = FS.dc3(text, 6);
            assert.equal(text.length, suffixArray.length);
            assert.equal(8, suffixArray[0]);
            assert.equal(4, suffixArray[1]);
            assert.equal(5, suffixArray[2]);
            assert.equal(6, suffixArray[3]);
            assert.equal(7, suffixArray[4]);
            assert.equal(3, suffixArray[5]);
            assert.equal(2, suffixArray[6]);
            assert.equal(1, suffixArray[7]);
            assert.equal(0, suffixArray[8]);
        });
        it('should return a suffix array of text', function() {
            var text = [2, 2, 3, 2, 3, 2, 3, 1];
            var suffixArray = FS.dc3(text, 3);
            assert.equal(text.length, suffixArray.length);
            assert.equal(7, suffixArray[0]);
            assert.equal(0, suffixArray[1]);
            assert.equal(5, suffixArray[2]);
            assert.equal(3, suffixArray[3]);
            assert.equal(1, suffixArray[4]);
            assert.equal(6, suffixArray[5]);
            assert.equal(4, suffixArray[6]);
            assert.equal(2, suffixArray[7]);
        });
    });
});

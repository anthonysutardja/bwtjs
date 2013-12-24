var assert = require("assert");
var HTS = require("../bwt.js");

describe('HTS', function() {
    describe('#_convertTextToCharPair(text)', function() {
        it('should return a list of charpairs', function() {
            var text = [1, 2, 2, 3, 2, 1];
            var numberText = HTS._convertTextToCharPair(text);
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
            var numberText = HTS._convertTextToCharPair(text);
            var r0 = HTS._create_r_n(0, numberText);
            assert.equal(Math.ceil(numberText.length / 3), r0.length);
            var r1 = HTS._create_r_n(1, numberText);
            assert.equal(Math.ceil(numberText.slice(1).length / 3), r1.length);
            assert.equal(0, r1[1].get(2).ch);
            var r2 = HTS._create_r_n(2, numberText);
            assert.equal(Math.ceil(numberText.slice(2).length / 3), r2.length);
        });
    });

    describe('#radixSortTuples(lists, maxValue)', function() {
        it('should return a sorted list of triplets (tuples)', function() {
            var text = [1, 2, 2, 3, 2, 1, 1, 1, 1];
            var numberText = HTS._convertTextToCharPair(text);
            var r0 = HTS._create_r_n(0, numberText);
            var r0Sorted = HTS.radixSortTuples(r0, 4);
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
            var numberText = HTS._convertTextToCharPair(text);
            var r0 = HTS._create_r_n(0, numberText);
            var r0Sorted = HTS.radixSortTuples(r0, 4);
            var labels = HTS.createNewLabels(r0Sorted);
            assert.equal(2, labels.size);
            assert.equal(1, labels[r0Sorted[0].toString()]);
            assert.equal(2, labels[r0Sorted[2].toString()]);
        });
    });

    describe('#dc3(text)', function() {
        it('should return a suffix array of text', function() {
            var text = [6, 5, 4, 3, 2, 2, 2, 3, 1];
            var suffixArray = HTS.dc3(text, 6);
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
            var suffixArray = HTS.dc3(text, 3);
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

    describe('#bwt(text)', function() {
        it('should return the bwt of text', function() {
            var result;

            result = HTS.bwt('barbara$');
            assert.equal('arbbr$aa', result);

            result = HTS.bwt('hellojellomellojello$');
            assert.equal('ojmhj$ooeeeellllollll', result);
        });
    });

    describe('#sortCharacters(text)', function() {
        it('should return the sorted version of the text', function() {
            assert.equal('ahnnoty', HTS.sortCharacters('anthony'));
            assert.equal('eiknv', HTS.sortCharacters('kevin'));
            assert.equal('AAaaaa', HTS.sortCharacters('aAaAaa'));
        });
    });

    describe('#firstOccurenceFactory(text)', function() {
        it('should return the first occurences given a first column of the bwt', function() {
            var m1 = HTS.firstOccurrenceFactory('$ahnnoty');
            var results = ['$', 'n', 'y'];
            assert.equal(0, m1[results[0]]);
            assert.equal(3, m1[results[1]]);
            assert.equal(7, m1[results[2]]);
        });
    });

    describe('#lastOccurenceFactory(text)', function() {
        it('should return the last occurence positions given a last column of the bwt', function() {
            var s = 'arbbr$aa';
            var n = HTS.lastOccurrenceFactory(s);
            //01234567
            //arbbr$aa

            assert.equal(3, n[s[0]].length);
            assert.equal(0, n[s[0]][0]);
            assert.equal(6, n[s[0]][1]);
            assert.equal(7, n[s[0]][2]);

            assert.equal(2, n[s[1]].length);
            assert.equal(1, n[s[1]][0]);
            assert.equal(4, n[s[1]][1]);

            assert.equal(2, n[s[2]].length);
            assert.equal(2, n[s[2]][0]);
            assert.equal(3, n[s[2]][1]);

            assert.equal(1, n[s[5]].length);
            assert.equal(5, n[s[5]][0]);
        });
    });

    describe('#Occurrences(text)', function() {
        it('should correctly compute the occurence values', function() {
            var occ = new HTS.Occurrences('arbbr$aa');
            assert.equal(1, occ.check('a', 0));
            assert.equal(1, occ.check('a', 1));
            assert.equal(1, occ.check('a', 2));
            assert.equal(1, occ.check('a', 3));
            assert.equal(1, occ.check('a', 4));
            assert.equal(1, occ.check('a', 5));
            assert.equal(2, occ.check('a', 6));
            assert.equal(3, occ.check('a', 7));

            assert.equal(0, occ.check('b', 0));
            assert.equal(0, occ.check('b', 1));
            assert.equal(1, occ.check('b', 2));
            assert.equal(2, occ.check('b', 3));
            assert.equal(2, occ.check('b', 7));

            assert.equal(0, occ.check('r', 0));
            assert.equal(1, occ.check('r', 1));
            assert.equal(1, occ.check('r', 2));
            assert.equal(2, occ.check('r', 7));

            // Out of bounds check
            assert.equal(-1, occ.check('r', 8));
            assert.equal(-1, occ.check('z', 0));
        });
    });
});

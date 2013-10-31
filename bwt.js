var FS = {};


/**
 * CharPair
 * @constructor
 *
 * Constructs a character and index pair used for DC3.
 * @param {number} ch is the character
 * @param {number} idx is the index corresponding to this character
 */
var CharPair = function(ch, idx){
    this.ch = ch;
    this.idx = idx;
};

/**
 * @return {string} The CharPair's hashcode
 */
CharPair.prototype.hashCode = function() {
    return this.ch + ':' + this.idx;
};

/**
 * Tuple
 * @constructor
 *
 * Constructs a tuple of CharPairs.
 * @param {{ch:number, idx:number}} a is a CharPair which has a hashCode
 * @param {{ch:number, idx:number}} b is a CharPair which has a hashCode
 * @param {{ch:number, idx:number}} c is a CharPair which has a hashCode
 */
var Tuple = function(a, b, c) {
    this._a = a;
    this._b = b;
    this._c = c;
};

/**
 * @return {string} The tuple's hashcode
 */
Tuple.prototype.hashCode = function() {
    return this._a.hashCode() + '::' + this._b.hashCode() + '::' + this._c.hashCode();
};

/**
 * @return {string} The tuple's unique val
 */
Tuple.prototype.toString = function() {
    return str(this._a.ch) + ':' + str(this._b.ch) + ':' + str(this._c.ch);
};

/**
 * @param {number} i is the index of the tuple we wish to access
 * @return {{ch:number, idx:number}} The CharPair of index i
 */
Tuple.prototype.get = function(i) {
    if ( i === 0 ) {
        return this._a;
    } else if ( i === 1) {
        return this._b;
    } else {
        return this._c;
    }
};

Tuple.prototype.equals = function(tuple) {
    if (tuple === null) {
        return false;
    }
    return this._a === tuple._a && this._b === tuple._b && this._c === tuple._c;
};

/**
 * Helper method for converting number to string
 */
var str = function(i) {
    return "" + i;
};

/**
 * FS.radixSortTuples
 * Radix sort for a list of tuples. Sort by each position in the tuple.
 * @param {Array<Tuple>} lists is a list of tuples
 * @param {number} maxValue is the maximum character
 * @return {Array<Tuple>}
 */
FS.radixSortTuples = function(lists, maxValue) {
    var BASE = 3;
    
    var finalSorted, sortedValues, listLength, tuple, key;
    var j, pos;

    for (pos = BASE - 1; pos >= 0; pos--) {
        finalSorted = [];
        sortedValues = {};

        listLength = lists.length;
        for (j = 0; j < listLength; j++) {
            tuple = lists[j];
            if (!(str(tuple.get(pos).ch) in sortedValues)) {
                sortedValues[str(tuple.get(pos).ch)] = [];
            }
            sortedValues[str(tuple.get(pos).ch)].push(tuple);
        }

        for (j = 0; j < maxValue; j++) {
            key = str(j);
            if (key in sortedValues) {
                finalSorted = finalSorted.concat(sortedValues[key]);
            }
        }
        lists = finalSorted;
    }
    return finalSorted;
};

FS.radixSortR0 = function(lists, maxValue, ranks) {
    var BASE = 2;
    
    var finalSorted, sortedValues, listLength, tuple, key;
    var j, pos;

    for (pos = BASE - 1; pos >= 0; pos--) {
        finalSorted = [];
        sortedValues = {};

        listLength = lists.length;
        for (j = 0; j < listLength; j++) {
            if (pos === 0) {
                if (!(str(tuple.get(pos).ch) in sortedValues)) {
                    sortedValues[str(tuple.get(pos).ch)] = [];
                }
                sortedValues[str(tuple.get(pos).ch)].push(tuple);
            } else {
                if (str(tuple.get(pos).ch) in ranks) {
                    if (!(ranks[tuple.get(pos).hashCode()] in sortedValues)) {
                        sortedValues[ranks[tuple.get(pos).hashCode()]] = [];
                    }
                    sortedValues[ranks[tuple.get(pos).hashCode()]].push(tuple);
                } else {
                    if (!('0' in sortedValues)) {
                        sortedValues['0'] = [];
                    }
                    sortedValues['0'].push(tuple);
                }
            }
        }

        for (j = 0; j < maxValue; j++) {
            key = str(j);
            if (key in sortedValues) {
                finalSorted = finalSorted.concat(sortedValues[key]);
            }
        }
        lists = finalSorted;
    }
    return finalSorted;
};

/**
 * FS.createNewLabels
 * Generates a dictionary of new labels for a sorted array of tuples.
 *
 * @param {Array<Tuple>} sortedArray is a sorted array of tuples
 * @return {Object<*,*>}
 */
FS.createNewLabels = function(sortedArray) {
    var tup;
    var currentValue = 0,
        labels = {};
        currentTuple = null;
    for (var i = 0; i < sortedArray.length; i++) {
        tuple = sortedArray[i].toString();
        if (tuple !== currentTuple) {
            currentTuple = tuple;
            currentValue += 1;
        }
        labels[tuple] = currentValue;
    }

    labels.size = currentValue;
    return labels;
};

FS.createRanks = function(sortedArray) {
    var ranks = {};

    for (var i = 0; i < sortedArray.length; i++) {
        ranks[sortedArray[i].get(0).hashCode()] = i;
    }
    return ranks;
};

/**
 * FS.dc3
 * An implementation of the the Karkkainen-Sanders algorithm also known as the
 * difference cover modulo 3.
 *
 * This will yield the suffix array.
 *
 * @param {Array<number>} text is string over the numbered alphabet
 * @param {number} characterSetLength is the size of the alphabet
 */
FS.dc3 = function(text, characterSetLength) {
    text = this._convertTextToCharPair(text);

    var r0 = this._create_r_n(0, text);
    var r1 = this._create_r_n(1, text);
    var r2 = this._create_r_n(2, text);

    var rPrime = r1.concat(r2);
    var rPrimeSorted = FS.radixSortTuples(rPrime, characterSetLength + 1); //we add 1 for 0 padding

    var labels = FS.createNewLabels(rPrimeSorted);
    var rPrimeRanks = FS.createRanks(rPrimeSorted);
    var rPrimeRelabeled = [];
    var i, triple, rank, ch;

    if (labels.size !== rPrimeSorted.length) {
        // Need to recurse to find true ordering for rPrimeSorted
        for (i = 0; i < rPrime.length; i++) {
            rPrimeRelabeled.push(labels[rPrime[i].toString()]);
        }

        var rPrimeSuffixArray = FS.dc3(rPrimeRelabeled, labels.size);
        rPrimeRanks = {};
        rPrimeSorted = [];

        for (rank = 0; rank < rPrimeSuffixArray.length; rank++) {
            triple = rPrime[rank];
            charPair = triple.get(0);
            rPrimeRanks[charPair.hashCode()] = rank;
            rPrimeSorted.push(triple);
        }
    }

    var r0Sorted = FS.radixSortR0(r0, Math.max(characterSetLength + 1, rPrime.length), rPrimeRanks);

    // At this poitn r0 and rPrimeSorted are perfectly sorted
    // Begin the merge...
};

/**
 * FS._create_rn will create the residual sets R0, R1, and R2 with different offsets.
 *
 * @param {number} n is either 0, 1, 2 -- the offset where we start
 * @param {text} text is an array of number characters
 */
FS._create_r_n = function(n, text) {
    var numExpand;
    var splicedText = text.slice(n);
    var rn = [],
        idx = 0;
    if (splicedText.length % 3 === 0) {
        numExpand = 0;
    } else {
        numExpand = 3 - (splicedText.length % 3);
    }

    // the arrays with 0's
    var padding = [],
        i;
    for (i = 0; i < numExpand; i++) {
        padding.push(new CharPair(0, splicedText.length + i));
    }
    var expandedText = splicedText.concat(padding);

    // Make triplets
    while (idx < expandedText.length) {
        rn.push(new Tuple(
            expandedText[idx],
            expandedText[idx + 1],
            expandedText[idx + 2]
        ));
        idx += 3;
    }
    return rn;
};

FS._convertTextToCharPair = function(text) {
    var numberText = text.map(function(ch, idx) {
        return new CharPair(ch, idx);
    });
    return numberText;
};


// Production steps of ECMA-262, Edition 5, 15.4.4.19
// Reference: http://es5.github.com/#x15.4.4.19
if (!Array.prototype.map) {
    Array.prototype.map = function(callback, thisArg) {

        var T, A, k;

        if (this === null) {
            throw new TypeError(" this is null or not defined");
        }

        // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
        var O = Object(this);

        // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
        // 3. Let len be ToUint32(lenValue).
        var len = O.length >>> 0;

        // 4. If IsCallable(callback) is false, throw a TypeError exception.
        // See: http://es5.github.com/#x9.11
        if (typeof callback !== "function") {
            throw new TypeError(callback + " is not a function");
        }

        // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if (thisArg) {
            T = thisArg;
        }

        // 6. Let A be a new array created as if by the expression new Array(len) where Array is
        // the standard built-in constructor with that name and len is the value of len.
        A = new Array(len);

        // 7. Let k be 0
        k = 0;

        // 8. Repeat, while k < len
        while(k < len) {

            var kValue, mappedValue;

            // a. Let Pk be ToString(k).
            //   This is implicit for LHS operands of the in operator
            // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
            //   This step can be combined with c
            // c. If kPresent is true, then
            if (k in O) {

                // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
                kValue = O[ k ];

                // ii. Let mappedValue be the result of calling the Call internal method of callback
                // with T as the this value and argument list containing kValue, k, and O.
                mappedValue = callback.call(T, kValue, k, O);

                // iii. Call the DefineOwnProperty internal method of A with arguments
                // Pk, Property Descriptor {Value: mappedValue, : true, Enumerable: true, Configurable: true},
                // and false.

                // In browsers that support Object.defineProperty, use the following:
                // Object.defineProperty(A, Pk, { value: mappedValue, writable: true, enumerable: true, configurable: true });

                // For best browser support, use the following:
                A[ k ] = mappedValue;
            }
            // d. Increase k by 1.
            k++;
        }

        // 9. return A
        return A;
    };      
}

module.exports = FS;

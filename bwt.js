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

FS.radixSort = function(lists, pos, maxValue, n, map) {
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

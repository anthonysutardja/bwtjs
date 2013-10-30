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
 * FS._create_rn will create the residual sets of 3 with different offsets.
 *
 * @param {number} n is either 0, 1, 2 -- the offset where we start
 * @param {text} text is an array of number characters
 */
FS._create_r_n = function(n, text) {
    var numExpand;
    var splicedText = text.splice(n);
    var rn = [];
    if (splicedText.length % 3 === 0) {
        numExpand = 0;
    } else {
        numExpand = 3 - (splicedText.length % 3);
    }
    // do some shit
    // TODO(anthonysutardja): need to finish this.
    return rn;
};


FS._convertTextToCharPair = function(text) {
    var i;
    var length = text.length,
        numberText = [];
    for (i = 0; i < length; i++) {
        numberText.push(new CharPair(text[i], i));
    }
    return numberText;
};

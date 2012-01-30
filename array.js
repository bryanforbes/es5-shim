// vim: ts=4 sts=4 sw=4 expandtab
(function(define){
    define([], function(){
        var toString = Object.prototype.toString;

        // ES5 9.4
        // http://es5.github.com/#x9.4
        // http://jsperf.com/to-integer
        var toInteger = function (n) {
            n = +n;
            if (n !== n) { // isNaN
                n = 0;
            } else if (n !== 0 && n !== (1/0) && n !== -(1/0)) {
                n = (n > 0 || -1) * Math.floor(Math.abs(n));
            }
            return n;
        };

        var prepareString = "a"[0] != "a";
            // ES5 9.9
            // http://es5.github.com/#x9.9
        var toObject = function (o) {
            if (o == null) { // this matches both null and undefined
                throw new TypeError(); // TODO message
            }
            // If the implementation doesn't support by-index access of
            // string characters (ex. IE < 9), split the string
            if (prepareString && typeof o == "string" && o) {
                return o.split("");
            }
            return Object(o);
        };

        // ES5 15.4.3.2
        // http://es5.github.com/#x15.4.3.2
        // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/isArray
        if (!Array.isArray) {
            Array.isArray = function isArray(obj) {
                return toString.call(obj) == "[object Array]";
            };
        }

        // The IsCallable() check in the Array functions
        // has been replaced with a strict check on the
        // internal class of the object to trap cases where
        // the provided function was actually a regular
        // expression literal, which in V8 and
        // JavaScriptCore is a typeof "function".  Only in
        // V8 are regular expression literals permitted as
        // reduce parameters, so it is desirable in the
        // general case for the shim to match the more
        // strict and common behavior of rejecting regular
        // expressions.

        // ES5 15.4.4.18
        // http://es5.github.com/#x15.4.4.18
        // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/array/forEach
        if (!Array.prototype.forEach) {
            Array.prototype.forEach = function forEach(fun /*, thisp*/) {
                var self = toObject(this),
                    thisp = arguments[1],
                    i = -1,
                    length = self.length >>> 0;

                // If no callback function or if callback is not a callable function
                if (toString.call(fun) != "[object Function]") {
                    throw new TypeError(); // TODO message
                }

                while (++i < length) {
                    if (i in self) {
                        // Invoke the callback function with call, passing arguments:
                        // context, property value, property key, thisArg object context
                        fun.call(thisp, self[i], i, self);
                    }
                }
            };
        }

        // ES5 15.4.4.19
        // http://es5.github.com/#x15.4.4.19
        // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/map
        if (!Array.prototype.map) {
            Array.prototype.map = function map(fun /*, thisp*/) {
                var self = toObject(this),
                    length = self.length >>> 0,
                    result = Array(length),
                    thisp = arguments[1];

                // If no callback function or if callback is not a callable function
                if (toString.call(fun) != "[object Function]") {
                    throw new TypeError(); // TODO message
                }

                for (var i = 0; i < length; i++) {
                    if (i in self)
                        result[i] = fun.call(thisp, self[i], i, self);
                }
                return result;
            };
        }

        // ES5 15.4.4.20
        // http://es5.github.com/#x15.4.4.20
        // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/filter
        if (!Array.prototype.filter) {
            Array.prototype.filter = function filter(fun /*, thisp */) {
                var self = toObject(this),
                    length = self.length >>> 0,
                    result = [],
                    value,
                    thisp = arguments[1];

                // If no callback function or if callback is not a callable function
                if (toString.call(fun) != "[object Function]") {
                    throw new TypeError(); // TODO message
                }

                for (var i = 0; i < length; i++) {
                    if (i in self) {
                        value = self[i];
                        if (fun.call(thisp, value, i, self)) {
                            result.push(value);
                        }
                    }
                }
                return result;
            };
        }

        // ES5 15.4.4.16
        // http://es5.github.com/#x15.4.4.16
        // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/every
        if (!Array.prototype.every) {
            Array.prototype.every = function every(fun /*, thisp */) {
                var self = toObject(this),
                    length = self.length >>> 0,
                    thisp = arguments[1];

                // If no callback function or if callback is not a callable function
                if (toString.call(fun) != "[object Function]") {
                    throw new TypeError(); // TODO message
                }

                for (var i = 0; i < length; i++) {
                    if (i in self && !fun.call(thisp, self[i], i, self)) {
                        return false;
                    }
                }
                return true;
            };
        }

        // ES5 15.4.4.17
        // http://es5.github.com/#x15.4.4.17
        // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/some
        if (!Array.prototype.some) {
            Array.prototype.some = function some(fun /*, thisp */) {
                var self = toObject(this),
                    length = self.length >>> 0,
                    thisp = arguments[1];

                // If no callback function or if callback is not a callable function
                if (toString.call(fun) != "[object Function]") {
                    throw new TypeError(); // TODO message
                }

                for (var i = 0; i < length; i++) {
                    if (i in self && fun.call(thisp, self[i], i, self)) {
                        return true;
                    }
                }
                return false;
            };
        }

        // ES5 15.4.4.21
        // http://es5.github.com/#x15.4.4.21
        // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduce
        if (!Array.prototype.reduce) {
            Array.prototype.reduce = function reduce(fun /*, initial*/) {
                var self = toObject(this),
                    length = self.length >>> 0;

                // If no callback function or if callback is not a callable function
                if (toString.call(fun) != "[object Function]") {
                    throw new TypeError(); // TODO message
                }

                // no value to return if no initial value and an empty array
                if (!length && arguments.length == 1) {
                    throw new TypeError(); // TODO message
                }

                var i = 0;
                var result;
                if (arguments.length >= 2) {
                    result = arguments[1];
                } else {
                    do {
                        if (i in self) {
                            result = self[i++];
                            break;
                        }

                        // if array contains no values, no initial value to return
                        if (++i >= length) {
                            throw new TypeError(); // TODO message
                        }
                    } while (true);
                }

                for (; i < length; i++) {
                    if (i in self) {
                        result = fun.call(void 0, result, self[i], i, self);
                    }
                }

                return result;
            };
        }

        // ES5 15.4.4.22
        // http://es5.github.com/#x15.4.4.22
        // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduceRight
        if (!Array.prototype.reduceRight) {
            Array.prototype.reduceRight = function reduceRight(fun /*, initial*/) {
                var self = toObject(this),
                    length = self.length >>> 0;

                // If no callback function or if callback is not a callable function
                if (toString.call(fun) != "[object Function]") {
                    throw new TypeError(); // TODO message
                }

                // no value to return if no initial value, empty array
                if (!length && arguments.length == 1) {
                    throw new TypeError(); // TODO message
                }

                var result, i = length - 1;
                if (arguments.length >= 2) {
                    result = arguments[1];
                } else {
                    do {
                        if (i in self) {
                            result = self[i--];
                            break;
                        }

                        // if array contains no values, no initial value to return
                        if (--i < 0) {
                            throw new TypeError(); // TODO message
                        }
                    } while (true);
                }

                do {
                    if (i in this) {
                        result = fun.call(void 0, result, self[i], i, self);
                    }
                } while (i--);

                return result;
            };
        }

        // ES5 15.4.4.14
        // http://es5.github.com/#x15.4.4.14
        // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
        if (!Array.prototype.indexOf) {
            Array.prototype.indexOf = function indexOf(sought /*, fromIndex */ ) {
                var self = toObject(this),
                    length = self.length >>> 0;

                if (!length) {
                    return -1;
                }

                var i = 0;
                if (arguments.length > 1) {
                    i = toInteger(arguments[1]);
                }

                // handle negative indices
                i = i >= 0 ? i : Math.max(0, length + i);
                for (; i < length; i++) {
                    if (i in self && self[i] === sought) {
                        return i;
                    }
                }
                return -1;
            };
        }

        // ES5 15.4.4.15
        // http://es5.github.com/#x15.4.4.15
        // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/lastIndexOf
        if (!Array.prototype.lastIndexOf) {
            Array.prototype.lastIndexOf = function lastIndexOf(sought /*, fromIndex */) {
                var self = toObject(this),
                    length = self.length >>> 0;

                if (!length) {
                    return -1;
                }
                var i = length - 1;
                if (arguments.length > 1) {
                    i = Math.min(i, toInteger(arguments[1]));
                }
                // handle negative indices
                i = i >= 0 ? i : length - Math.abs(i);
                for (; i >= 0; i--) {
                    if (i in self && sought === self[i]) {
                        return i;
                    }
                }
                return -1;
            };
        }
    });
})(typeof define == 'function' ? define : function(deps, factory){ factory(); });

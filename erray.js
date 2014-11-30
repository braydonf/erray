'use strict';

var inspect = require('util').inspect;

/*
 * Define an array of errors based on a specification.
 *
 * @example
 * var Errors = Erray([
 *   'InvalidX', // basic usage, only specify a name
 *   {
 *     name: 'InvalidY', // specify the name
 *     message: 'Invalid Y value for this function', // set a default static message
 *     code: 500 // add an optional code
 *   },
 *   {
 *     name: 'InvalidXY',
 *     message: function(x, y) { // specify a function to handle arguments and return a message
 *       return 'Invalid values x: ' + x + ' and y: ' + y + ' for input.'; 
 *     }
 *   },
 *   {
 *     name: 'NotFound',
 *     code: 404
 *   }
 * ]);
 *
 * // detect the type of error using "instanceof"
 * try {
 *   throw new Errors.InvalidY();
 * } catch(e) {
 *   if (e instanceof Errors.InvalidY) {
 *     // handle this case differently
 *   }
 *   // or check with a code
 *   if (e.code === 500) {
 *     // handle this case differently
 *   }
 * }
 *
 * @params {Array} array - An array of error specifications
 * @returns {Object} An object with keys of each error
 */
var Errors = function(array){
  if (!array || typeof(array.forEach) !== 'function') {
    throw TypeError('Error definition expects an array "object" instead got: '+
                    inspect(array, true, 2));
  }
  if (array.length === 0) {
    throw TypeError('Error definition expects a non-empty array "object".');
  }
  var errors = {};
  array.forEach(function(a){

    var name;
    var message;
    var code;

    if (typeof(a) === 'string') {
      name = a;
    } else if (typeof(a) === 'object') {
      if (a instanceof Error){
        throw TypeError('Error definition does not expect an already generated instance of an Error. '+
                      'A "string" name or an error specification "object" is expected.');
      }
      if (!(a.name)) {
        throw TypeError('Error definition expects a "name" property '+
                        'for the object:' + inspect(a, true, 2));
      }
      name = a.name;
      if ( a.message && (typeof(a.message) !== 'string' && 
                         typeof(a.message) !== 'function')) {
        throw TypeError('Error message definition expects a "string" or a "function", '+
                        'got: "' + typeof(a.message) + '" for value: '+ 
                        inspect(a.message, true, 2));
      }
      message = a.message;
      
      if (a.code && typeof(a.code) !== 'number' ) {
        throw TypeError('Error definition expects a "number" and instead got: "'+
                        typeof(a.code) + '" for value:' + inspect(a.code, true, 2));
      }
      code = a.code;
    } else {
      throw TypeError('Error definition is expected to be a "string" name or '+
                      'an error specification "object"');
    }
    
    if (typeof(name) !== 'string'){
      throw TypeError('Error definition expects the "name" property to be a '+
                            '"string" for object:' + inspect(name, true, 2));
    };
    
    if (!name.match(/^[a-zA-Z]+$/)){
      throw TypeError('Error definition "name" expects only alapha characters,'+
                      ' instead got '+inspect(name, true, 2));
    };
    
    if (typeof(errors[name]) !== 'undefined'){
      throw TypeError('Error definition includes two specs with the same name: "'+
                      a.name+'", and only expects there to be one.');
    }
    
    errors[name] = function(msg) {
      Error.call(this);
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, errors[name]);
      }
      if (typeof (message) === 'function') {
        this.message = message.apply(null, arguments);
      } else {
        this.message = msg || message;
      }
      this.name = name;
      this.code = code ? code : undefined;
    };
    errors[name].prototype = Object.create(Error.prototype);
    errors[name].prototype.constructor = errors[name];
    
  });
  return errors;
};

module.exports = Errors;
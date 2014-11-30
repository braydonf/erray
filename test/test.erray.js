'use strict';

var Erray;
var chai;

if ( typeof(window) === 'undefined' ) {
  Erray = require('../erray');
  chai = require('chai');
} else {
  Erray = window.erray;
  chai = window.chai;
}

describe('Erray', function() {

  var should = chai.should();

  var spec = [
    'InvalidX',
    {
      name: 'InvalidY',
      message: 'Invalid Y value for this function',
      code: 500
    },
    {
      name: 'InvalidXY',
      message: function(x, y) {
        return 'Invalid values x: '+x+' and y: '+y+' for input.'; 
      }
    },
    {
      name: 'NotFound',
      code: 404
    }
  ];

  it('should generate an object of errors', function() {
    var Errors = Erray(spec);
    should.exist(Errors.InvalidX);
    should.exist(Errors.InvalidXY);
    should.exist(Errors.NotFound);
  });
  
  it('should be able to determine the type of an error with instanceof', function() {
    var Errors = Erray(spec);
    var success = false;
    try {
      throw new Errors.InvalidY();
    } catch(e) {
      if (e instanceof Errors.InvalidY) {
        success = true;
      }
    }
    success.should.equal(true);
  });

  it('should be able to determine the type of an error with a code', function() {
    var Errors = Erray(spec);
    var success = false;
    try {
      throw new Errors.InvalidY();
    } catch(e) {
      if (e.code === 500) {
        success = true;
      }
    }
    success.should.equal(true);
  });

  it('code should be undefined if not specified', function() {
    var Errors = Erray(spec);
    var type = null;
    try {
      throw new Errors.InvalidXY(1,2);
    } catch(e) {
      type = typeof(e.code);
    }
    type.should.equal('undefined');
  });

  it('errors should have a stack trace', function() {
    var Errors = Erray(spec);
    var stack = null;
    try {
      throw new Errors.InvalidY();
    } catch(e) {
      stack = e.stack;
    }
    should.exist(stack);
  });

  it('should be able to get the name of an error', function() {
    var Errors = Erray(spec);
    var name = null;
    try {
      throw new Errors.InvalidY();
    } catch(e) {
      name = e.name;
    }
    should.exist(name);
    name.should.equal('InvalidY');
  });

  it('should be able to specify a message with a function', function() {
    var Errors = Erray(spec);
    var message = null;
    try {
      throw new Errors.InvalidXY(1,2);
    } catch(e) {
      message = e.message;
    }
    should.exist(message);
    message.should.equal('Invalid values x: 1 and y: 2 for input.');
  });

  it('should get the default message', function() {
    var Errors = Erray(spec);
    var message = null;
    try {
      throw new Errors.InvalidY();
    } catch(e) {
      message = e.message;
    }
    should.exist(message);
    message.should.equal('Invalid Y value for this function');
  });

  it('should be able to override the default message', function() {
    var Errors = Erray(spec);
    var message = null;
    try {
      throw new Errors.InvalidY('A custom message');
    } catch(e) {
      message = e.message;
    }
    should.exist(message);
    message.should.equal('A custom message');
  });

  it('should not be able to generate without a spec', function() {
    (function(){
      var Errors = Erray();
    }).should.throw('Error definition expects an array "object"');
  });

  it('should not be able to generate with an empty spec', function() {
    (function(){
      var Errors = Erray([]);
    }).should.throw('Error definition expects a non-empty array "object".');
  });

  it('should not be able to generate with invalid specification', function() {
    (function(){
      var Errors = Erray([function(){}]);
    }).should.throw('Error definition is expected to be a "string" name or');
  });

  it('should not be able to generate from direct error objects', function() {
    (function(){
      var Errors = Erray([new Error()]);
    }).should.throw('Error definition does not expect an already generated instance of an Error');
  });

  it('should not be able to generate without a name', function() {
    (function(){
      var Errors = Erray([{ message: 'An error with no name'}]);
    }).should.throw('Error definition expects a "name" property');
  });

  it('should not be able to generate with invalid character name', function() {
    (function(){
      var Errors = Erray(['Invalid X']);      
    }).should.throw('Error definition "name" expects only alapha characters');
  });

  it('should not be able to generate with invalid type name', function() {
    (function(){
      var Errors = Erray([{name: function(){}}]);      
    }).should.throw('Error definition expects the "name" property to be a "string"');
  });

  it('should not be able to generate with invalid message', function() {
    (function(){
      var Errors = Erray([{name: 'InvalidMessage', message: {}}]);
    }).should.throw('Error message definition expects a "string" or a "function"');
  });

  it('should not be able to generate with invalid code', function() {
    (function(){
      var Errors = Erray([{name: 'InvalidCode', message: 'Invalid...', code: 'notacode'}]);
    }).should.throw('Error definition expects a "number" ');
  });

  it('should not be able to generate two identical named errors', function() {
    (function(){
      var Errors = Erray(['InvalidName','InvalidName']);
    }).should.throw('Error definition includes two specs with the same name');
  });

});


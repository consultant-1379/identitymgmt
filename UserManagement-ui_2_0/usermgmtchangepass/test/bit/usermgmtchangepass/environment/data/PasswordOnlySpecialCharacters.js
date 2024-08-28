define(function() {
  'use strict';

  return [{
     "name": "mustNotContainUnsupportedChars",
     "valid": true
  },{
    "name": "maximumLength",
    "valid": true
  }, {
    "name": "minimumLength",
    "valid": true
  }, {
    "name": "minimumLowerCase",
    "valid": false
  }, {
    "name": "minimumUpperCase",
    "valid": false
  }, {
    "name": "minimumDigits",
    "valid": false
  }];
});
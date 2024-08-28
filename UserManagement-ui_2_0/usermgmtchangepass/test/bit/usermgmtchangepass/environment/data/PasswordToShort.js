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
    "valid": false
  }, {
    "name": "minimumLowerCase",
    "valid": true
  }, {
    "name": "minimumUpperCase",
    "valid": true
  }, {
    "name": "minimumDigits",
    "valid": true
  }];
});
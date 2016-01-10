'use strict';

/* global -Promise */
var Promise = require('bluebird');

var fs = Promise.promisifyAll(require('fs'));

exports.fs = fs;

exports.shallowCopy = function shallowCopy(obj, orig) {
   orig = (typeof orig === 'object') ? orig : {};

  return Object.keys(obj)
    .reduce(function (cpy, k) {
      cpy[k] = obj[k];
      return cpy;
    }, orig);
};


exports.fileExists = function fileExists(filePath) {
  return fs.statAsync(filePath)
    .then(function (stat) {
      return stat.isFile();
    })
    .catch(function (err) {
      return false;
    });
};

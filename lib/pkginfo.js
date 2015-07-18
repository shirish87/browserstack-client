'use strict';

var path = require('path');
var pkg = require(path.join(__dirname, '..', 'package.json'));
var os = require('os');

var libVersion = [ pkg.name, pkg.version ].join('/');
var envVersion = [ 'node', process.versions.node ].join('/');
var osVersion = [ os.platform(), os.release() ].join('/');

var id = [ libVersion, envVersion, osVersion ].join(' ');

module.exports = {
  name: pkg.name,
  version: pkg.version,
  id: id
};

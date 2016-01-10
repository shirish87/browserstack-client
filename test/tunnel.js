'use strict';

var assert = require('assert');
var BrowserStackTunnel = require('../').BrowserStackTunnel;


describe('Local Binary', function() {
  this.timeout(0);

  it('should connect with defaults', function (done) {
    var b = new BrowserStackTunnel();

    b.createTunnel()
      .then(function (tunnel) {
        assert.equal('start', tunnel.state);

        tunnel.once('error', done);
        tunnel.once('exit', function (exitCode) {
          done((exitCode < 1) ? undefined : exitCode);
        });

        setTimeout(done, 1000);
      })
      .catch(done);
  });

  it('should produce error for invalid binary home', function (done) {
    var b = new BrowserStackTunnel({
      binaryHome: 'invalid'
    });

    b.createTunnel()
      .then(function (tunnel) {
        done(new Error('Tunnel was created'));
      })
      .catch(function (err) {
        assert.equal(err.message, 'Failed to extract binary. Please try again.');
        done();
      });
  });

});

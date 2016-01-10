'use strict';

var Promise = require('bluebird');
var debug = require('diagnostics')('bstack:client:tunnel:process');

var path = require('path');
var util = require('util');

var Utils = require('./utils');
var fs = Utils.fs;

var EventEmitter = require('events').EventEmitter;
var exec = require('child_process').execFile;


var START_DELAY = 5000;

var processStates = {
  start: {
    matcher: /Press Ctrl-C to exit/g,
    action: function (tunnelProc, data, matches) {
      if (tunnelProc._options.delayedStart) {
        debug('Using delayed start');

        return setTimeout(function () {
          tunnelProc._emitState('start', data);
        }, tunnelProc._options.delayedStartTime || START_DELAY);
      }

      tunnelProc._emitState('start', data);
    }
  },

  error: {
    matcher: /\s+\*\*\* Error:\s+(.*)/g,
    action: function (tunnelProc, data, matches) {
      var err = new Error(matches[1] || data);
      err.verbose = data;
      tunnelProc._emitState('error', err);
    }
  }
};


function TunnelProcess(binPath, args, options) {
  if (typeof this !== 'object')  return new TunnelProcess(binPath, args, options);
  EventEmitter.call(this);

  args = args || [];
  options = options || {};

  var childProc = exec(binPath, args);

  this.pid = childProc.pid;
  this.process = childProc;
  this.exec = binPath + ' ' + args.join(' ');

  this._options = options;

  this._runDeferred = Promise.pending();
  this.promise = this._runDeferred.promise;

  this._init();

  if (this._options.log) {
    this._logPath = path.join(__dirname, 'bin', new Date().toISOString() + '-' + this.pid + '.log');

    var logStream = fs.createWriteStream(this._logPath, {
      flags: 'a',
      encoding: 'utf8'
    });

    childProc.stdout.pipe(logStream);
    childProc.stderr.pipe(logStream);
  }

  if (this._options.silent === false) {
    childProc.stdout.pipe(process.stdout);
    childProc.stderr.pipe(process.stderr);
  }

  debug('TunnelProcess', this.exec);
  return this;
}

util.inherits(TunnelProcess, EventEmitter);


/**
 * Kills the current local tunnel to BrowserStack.
 *
 * @param  {Number} exitCode - Exit code suggesting type of termination (optional).
 * @public
 */
TunnelProcess.prototype.kill = function kill(exitCode) {
  debug('kill | pid:', this.pid);
  this._emitState('exit', exitCode || 0);

  var proc = this.process;
  if (proc) {
    proc.stderr.removeAllListeners('data');
    proc.stdout.removeAllListeners('data');
    proc.removeAllListeners('error');
    proc.kill();
  }

  this._runDeferred.resolve({
    code: exitCode,
    stderr: this.stderr,
    stdout: this.stdout
  });

  if (this._logPath) {
    var logPath = this._logPath;
    debug('Log file: %s', logPath, this._options);

    if (this._options.preserveLog === false) {
      try {
        fs.unlinkSync(logPath);
        debug('Deleted log file: %s', logPath);
      } catch (e) {
        // ignored
      }
    }
  }
};


TunnelProcess.prototype._init = function _init() {
  var childProc = this.process;
  var self = this;

  this.state = 'init';
  this.stdout = '';

  childProc.stdout.on('data', function (data) {
    debug('stdout: %s', data || '');

    self.stdout += data.toString('utf8');
    self._updateState(self.stdout);
  });

  this.stderr = '';
  childProc.stderr.on('data', function (data) {
    debug('stderr: %s', data || '');

    self.stderr += data.toString('utf8');
    self._updateState(self.stderr);
  });

  childProc.on('error', function (err) {
    debug('childProc.error: %s', err || '');

    self._emitState('error', err);
  });

  childProc.on('exit', this.kill.bind(this));

  this.on('error', function () {
    self.kill(1);
  });
};


TunnelProcess.prototype._updateState = function _updateState(data) {
  if (typeof data !== 'string') return;

  var matches;

  for (var state in processStates) {
    while ((matches = processStates[state].matcher.exec(data)) !== null) {
      if (matches.length) {
        processStates[state].action(this, data, matches);
      }
    }
  }
};


TunnelProcess.prototype._emitState = function _emitState(state, data) {
  debug('_emitState', state, data);
  this.state = state;
  this.emit(state, data);
};


module.exports = TunnelProcess;

'use strict';

/* global -Promise */
var Promise = require('bluebird');

var unzip = require('unzip');
var debug = require('diagnostics')('bstack:client:tunnel');

var https = require('https');
var path = require('path');
var url = require('url');

var config = require('./config');
var TunnelProcess = require('./tunnelProcess');
var Utils = require('./utils');
var fs = Utils.fs;


var envAccessKey = process.env.BROWSERSTACK_KEY;
var isPlatformWindows = /^win/.test(process.platform);

var runOptions = [
  {
    name: 'silent',
    type: 'boolean',
    defaultValue: true
  },
  {
    name: 'log',
    type: 'boolean',
    defaultValue: false
  },
  {
    name: 'delayedStart',
    type: 'boolean',
    defaultValue: true
  },
  {
    name: 'delayedStartTime',
    type: 'number',
    defaultValue: 3000
  }
];


/**
 * BrowserStackTunnel
 *
 * @class
 * @classdesc Downloads and manages the BrowserStackLocal binary.
 *
 * @param  {object} - Options for BrowserStackTunnel
 * @param  {string} options.accessKey - Access key for the BrowserStack account. Optional. If not supplied, `BROWSERSTACK_KEY` environment variable is used.
 */
function BrowserStackTunnel(options) {
  if (typeof this !== 'object')  return new BrowserStackTunnel(options);

  this._config = Utils.shallowCopy(config, options || {});
  this._config.accessKey = (envAccessKey || this._config.accessKey);

  this._binaryFileName = config.binaryNamePrefix + (isPlatformWindows ? '.exe' : '');
  this._binaryHome = this._config.binaryHome || path.join(__dirname, 'bin');
  this._binaryPath = path.join(this._binaryHome, this._binaryFileName);
  this._metaPath = path.join(this._binaryHome, 'meta.json');
  this._activeChildProcs = {};

  this._binInitialized = false;
  this._loadMetaSync();

  var exitHandler = function (e) {
    if (!this._isKilling) {
      debug('exitHandler', e);
      this.terminate({ includeSelf: true });
      this._isKilling = true;
    }
  }.bind(this);

  process.on('exit', exitHandler);
  process.on('SIGINT', exitHandler);
}


/**
 * Updates the BrowserStackLocal binary.
 *
 * @returns {Promise} Promise resolving to a boolean value.
 * @public
 */
BrowserStackTunnel.prototype.updateBin = function updateBin(options) {
  options = options || {};
  debug('updateBin', options);

  var checkBin = options.force ? Promise.resolve(false) : this._isBinInitialized();

  return checkBin
    .bind(this)
    .then(function (isBinInit) {
      if (isBinInit) {
        debug('Binary already exists.');
        return false;
      }

      return this._downloadBinZip(options)
        .then(this._unzipFile.bind(this))
        .then(this._initBin.bind(this));
    });
};


/**
 * Terminates all active tunnels.
 *
 * @public
 */
BrowserStackTunnel.prototype.terminate = function terminate(options) {
  options = options || {};
  debug('terminate', options);

  var procs = this._activeChildProcs;
  var pids = Object.keys(procs);

  if (pids.length) {
    debug('killing %d child process(es)', pids.length);

    pids.forEach(function (pid) {
      procs[pid].kill();
    });
  } else if (options.includeSelf) {
    process.exit(0);
  }
};


/**
 * Runs the BrowserStackLocal binary with the provided arguments.
 *
 * @param  {Array} args - Arguments to be passed on to the binary.
 * @param  {Object} options - Options for this command.
 * @param  {boolean} options.silent - Runs the binary in background (default) or foreground.
 * @returns {Promise} Promise resolving to an object to manage the binary.
 * @public
 */
BrowserStackTunnel.prototype.run = function run(args, options) {
  options = options || {};
  options.args = args || [];
  var config = this._config;

  if (typeof config.accessKey === 'string' &&
    options.args.indexOf(config.accessKey) === -1) {
    options.args.unshift(config.accessKey.trim());
  }

  runOptions.forEach(function (opt) {
    if (typeof options[opt.name] !== opt.type) {
      options[opt.name] = (typeof config[opt.name] === opt.type) ?
        config[opt.name] : opt.defaultValue;
    }
  });

  return this._execCommand(options);
};


/**
 * Creates a local tunnel to BrowserStack.
 *
 * @param  {Array} args - Arguments to be passed on to the binary.
 * @param  {Object} options - Options for this command.
 * @param  {boolean} options.silent - Runs the binary in background and returns a promise for managing the binary process.
 * @returns {Promise} Promise resolving to an object.
 * @public
 */
BrowserStackTunnel.prototype.createTunnel = function createTunnel(args, options) {
  if (typeof args === 'object' && !Array.isArray(args)) {
    options = args;
    args = [];
  }

  return this.run(args, options || {}).then(function (tunnel) {
    debug('creating tunnel');
    var deferred = Promise.pending();

    tunnel.once('start', function () {
      debug('creating tunnel: start');
      if (!deferred.isFulfilled) deferred.resolve(tunnel);
    });

    tunnel.once('error', function (err) {
      debug('creating tunnel: error');
      if (!deferred.isFulfilled) deferred.reject(err);
    });

    tunnel.once('exit', function (err) {
      debug('creating tunnel: exit');
      if (!deferred.isFulfilled) deferred.reject(err);
    });

    return deferred.promise;
  });
};


/**
 * Gets the version for the BrowserStackLocal binary currently used.
 *
 * @param  {Object} options - Options for this command.
 * @returns {Promise} Promise resolving to a float (or String value).
 * @public
 */
BrowserStackTunnel.prototype.getBinVersion = function getBinVersion(options) {
  options = options || {};
  options.args = [ '-version' ];
  debug('getBinVersion', options);

  return this._execCommand(options).then(function (res) {
    if (!res || !res.stdout) {
      throw new Error('Failed to execute with "-version" switch.', res.stderr);
    }

    var versionMatches = res.stdout.match(/\d+\.\d+/g);
    if (!versionMatches) {
      throw new Error('Failed to read version.');
    }

    var version = versionMatches.shift();
    var versionNo = version && parseFloat(version);
    return isNaN(versionNo) ? version : versionNo;
  });
};


BrowserStackTunnel.prototype._metaExists = function _metaExists() {
  return Utils.fileExists(this._metaPath);
};


BrowserStackTunnel.prototype._saveMeta = function _saveMeta(data) {
  return fs.writeFileAsync(this._metaPath, JSON.stringify(data), 'utf8')
    .bind(this)
    .tap(this._loadMetaSync);
};


BrowserStackTunnel.prototype._deleteMeta = function _deleteMeta() {
  return fs.unlinkAsync(this._metaPath)
    .thenReturn(true)
    .catch(function (err) {
      return false;
    });
};


BrowserStackTunnel.prototype._loadMetaSync = function _loadMetaSync() {
  try {
    this.meta = require(this._metaPath) || {};
    debug('Loaded meta: %s', this._metaPath);
  } catch (e) {
    this.meta = {};
    debug('Failed to load meta: %s | %s', this._metaPath, e);
  }
};


BrowserStackTunnel.prototype._isBinInitialized = function _isBinInitialized() {
  debug('_isBinInitialized');

  return Utils.fileExists(this._binaryPath)
    .bind(this)
    .then(function (binaryFileExists) {
      return (!binaryFileExists ? false : this._metaExists());
    })
    .catch(function (e) { return false; })
    .then(function (filesExist) {
      debug('filesExist', filesExist);

      if (!filesExist) {
        return false;
      }

      return this.getBinVersion({
        skipBinCheck: true,
        _internal: true
      })
      .bind(this)
      .then(function (version) {
        if (!this.meta.version) {
          this._loadMetaSync();
        }

        // possible meta and binary versions mismatch
        return (version && this.meta.version && version === this.meta.version);
      })
      .catch(function (e) {
        // local binary may be missing, or may have been partially downloaded
        return false;
      });
    });
};


BrowserStackTunnel.prototype._downloadBinZip = function _downloadBinZip(options) {
  options = options || {};
  debug('_downloadBinZip', options);

  var reqOptions = Utils.shallowCopy(this._config.updateEndpoint);
  reqOptions.encoding = null;
  reqOptions.headers = options.headers || {};

  var etag = (typeof this.meta === 'object' && this.meta.etag);
  var useCached = (!options.force && etag);

  if (useCached) {
    reqOptions.headers['If-None-Match'] = etag;
  }

  return new Promise(function (resolve, reject) {
    this.terminate();
    debug('Downloading binary: %s', url.format(reqOptions));

    https.get(reqOptions, function (res) {
      if (!/zip$/.test(res.headers['content-type'])) {
        if (useCached && etag === res.headers.etag) {
          debug('Reusing cached binary');

          return resolve({
            res: res,
            isUpdated: false
          });
        }

        return reject(new Error('Error downloading binary zip.'));
      }

      resolve({ res: res });
    }).on('error', reject);
  }.bind(this));
};


BrowserStackTunnel.prototype._unzipFile = function _unzipFile(result) {
  var res = (typeof result === 'object' && result.res);
  var unzipStream = res && res.pipe(unzip.Parse());

  if (!unzipStream) {
    debug('Download failed');

    return Promise.resolve({
      res: res,
      isUpdated: false
    });
  }

  var deferred = Promise.pending();
  var updateSuccess = false;

  unzipStream
    .on('error', deferred.reject)
    .on('entry', function (entry) {
      if (entry.type.toLowerCase() === 'file' && entry.path === this._binaryFileName) {
        debug('Extracting', this._binaryFileName);

        this._deleteMeta()
          .bind(this)
          .then(function () {
            entry
              .pipe(fs.createWriteStream(this._binaryPath))
              .on('error', function (err) {
                return deferred.reject(new Error('Failed to extract binary. Please try again.'));
              })
              .on('close', function () {
                updateSuccess = true;
              });
          });
      } else {
        entry.autodrain();
      }
    }.bind(this))
    .on('close', function () {
      if (!updateSuccess) {
        return deferred.reject(new Error('Failed to save binary. Please try again.'));
      }

      deferred.resolve({
        res: res,
        isUpdated: true
      });
    });

  return deferred.promise;
};


BrowserStackTunnel.prototype._initBin = function _initBin(result) {
  debug('_initBin');

  var res = result && result.res;
  var isUpdated = result && result.isUpdated;

  debug('Setting execute perms for binary');
  return fs.chmodAsync(this._binaryPath, '0755')
    .bind(this)
    .then(function () {
      return this.getBinVersion({
        skipBinCheck: true,
        _internal: true
      });
    })
    .bind(this)
    .then(function (version) {
      debug('Binary verison: %s', version);

      return this._saveMeta({
        version: version,
        etag: res.headers.etag,
        lastUpdated: Date.now()
      });

    })
    .thenReturn(isUpdated);
};


BrowserStackTunnel.prototype._runBinCheck = function _runBinCheck() {
  debug('_runBinCheck');

  return this._isBinInitialized()
    .bind(this)
    .then(function (binaryFileExists) {
      return binaryFileExists ? Promise.resolve(true) : this.updateBin({
        force: true
      });
    });
};


BrowserStackTunnel.prototype._execCommand = function _execCommand(options) {
  options = options || {};
  var skipBinCheck = !!(this._binInitialized);

  if (!skipBinCheck && typeof options.skipBinCheck === 'boolean') {
    skipBinCheck = options.skipBinCheck;
  }

  debug('_execCommand | skipBinCheck:', skipBinCheck);
  return (skipBinCheck ? Promise.resolve(true) : this._runBinCheck())
    .bind(this)
    .then(function (isBinInit) {
      if (!isBinInit) {
        debug('_execCommand: Binary not initialized');
        return Promise.reject(new Error('Binary not initialized'));
      }

      this._binInitialized = true;
      return this._runChildProc(options);
    });
};


BrowserStackTunnel.prototype._runChildProc = function _runChildProc(options) {
  options = options || {};

  var args = Array.isArray(options.args) ? options.args : [];
  var tunnelProc = new TunnelProcess(this._binaryPath, args, options);

  this._activeChildProcs[tunnelProc.pid] = tunnelProc;
  debug('_runChildProc | pids:', Object.keys(this._activeChildProcs));

  tunnelProc.on('exit', function () {
    debug('_runChildProc | exit:', tunnelProc.pid);
    delete this._activeChildProcs[tunnelProc.pid];
  }.bind(this));

  if (options._internal) {
    return tunnelProc.promise;
  }

  return (options.silent) ? Promise.resolve(tunnelProc) :
    tunnelProc.promise.thenReturn(tunnelProc);
};


module.exports = BrowserStackTunnel;

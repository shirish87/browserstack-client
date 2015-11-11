'use strict';

/* global -Promise */
var Promise = require('bluebird');

var request = require('needle');
var debug = require('diagnostics')('bstack:client');
var pkginfo = require('./pkginfo');


// Global defaults
var envUsername = 'BROWSERSTACK_USERNAME';
var envKey = 'BROWSERSTACK_KEY';

var returnHeaders = false;
var headers = [
  'headers',
  'statusCode',
  'statusMessage'
];

// as an API, unless explicity requested, we shouldn't be caching anything
var useCache = false;
var cacheExpiry = 0;


/**
 * BrowserStack Client
 *
 * @classdesc Manages authenticated access to BrowserStack APIs.
 * @this BStackClient
 * @param {object} options - Options for BStackClient
 * @param {object} defaults - Defaults for BStackClient to be used in case of
 * missing options. Supplied by subclasses of this class.
 * @private
 */
function BStackClient(options, defaults) {
  // Options || Subclass-defaults || Global-defaults
  options = options || {};
  defaults = defaults || {};

  this._options = options;

  this._apiRoot = options.apiRoot || defaults.apiRoot;
  this._username = options.username || process.env[defaults.envUsername || envUsername];
  this._key = options.key || process.env[defaults.envKey || envKey];
  this._userAgent = options.userAgent || pkginfo.id;

  if (!this._username || !this._username.length) {
    throw new Error('Missing options.username');
  }

  if (!this._key || !this._key.length) {
    throw new Error('Missing options.key');
  }

  this._options.returnHeaders = (typeof options.returnHeaders === 'boolean') ?
    options.returnHeaders : (defaults.returnHeaders || returnHeaders);
  this._options.headers = (this._options.returnHeaders) ?
    (options.headers || defaults.headers || headers) : [];

  this._options.useCache = options.useCache || defaults.useCache || useCache;
  this._options.cacheExpiry = options.cacheExpiry || defaults.cacheExpiry || cacheExpiry;

  this._cache = {};

  // Initialize the REST API client
  this._init();
}


/**
 * Initializes a REST API client for making authenticated requests to
 * BrowserStack APIs.
 *
 * @private
 */
BStackClient.prototype._init = function _init() {
  var self = this;

  var apiRoot = this._apiRoot;
  var headerAttrs = this._options.headers;
  var returnHeaders = (this._options.returnHeaders && headerAttrs.length);

  var reqOptions = {
    user_agent: self._userAgent,
    open_timeout: 60000,
    username: self._username,
    password: self._key,
    json: true,
    compressed: true
  };

  this._request = Promise.promisify(function (options, callback) {
    var url = apiRoot + (options.path || '');
    debug('%s %s | ...', options.method, url);

    request.request(options.method, url, options.data, reqOptions, function (err, res) {
      if (err) {
        debug('%s %s | Error.', options.method, url);
        return callback(err);
      }

      var isNonError = (res.statusCode >= 200 && res.statusCode < 300);

      if (!res.body) {
        debug('%s %s | Empty response body.', options.method, url);
        return callback(isNonError ? new Error('Empty response') : new Error(res.statusCode + ': ' + res.statusMessage));
      }

      var data = res.body;
      if (typeof data === 'string') {
        // always return a JS object, even if API returns a string
        data = { message: data };
      }

      if (!isNonError) {
        // Error
        debug('%s %s | Status: %d.', options.method, url, res.statusCode);
        return callback(new Error(data.message || JSON.stringify(data)));
      }

      if (returnHeaders) {
        debug('%s %s | Done. Returning with headers.', options.method, url);
        data = headerAttrs.reduce(function (o, k) {
          if (res[k]) {
            o[k] = res[k];
          }

          return o;
        }, {
          data: res.body
        });
      }

      debug('%s %s | Done.', options.method, url);
      callback(null, data);
    });
  });

  debug('Initialized BStackClient: ', this._options, reqOptions);
};


/**
 * Generates a string key for the internal cache from the provided
 * URL path and options. The cache key is roughly the same as the URL,
 * but no effort is made to construct a valid URL.
 *
 * @param {string}  path - Path for this API request.
 * @param {object}  options - Query String parameters for this API request.
 * @return {string} String that could be used for using or querying the cache.
 * @private
 */
BStackClient.prototype._getCacheKey = function _getCacheKey(path, options) {
  options = options || {};

  var params = Object.keys(options).sort().map(function (k) {
    return k + '=' + options[k];
  }).join('&');

  var cacheKey = this._apiRoot;
  if (params) {
    cacheKey += '?' + params;
  }

  return cacheKey;
};


/**
 * Gets an item previously put in the internal cache.
 *
 * @param {string}  path - Path for this API request.
 * @param {object}  options - Query String parameters for this API request.
 * @return {object} Cached object if found, else null.
 * @private
 */
BStackClient.prototype._getCached = function _getCached(path, options) {
  if (this._options.useCache && this._options.cacheExpiry > 0) {
    var cacheKey = this._getCacheKey(path, options);
    var cacheEntry = this._cache[cacheKey];

    if (cacheEntry) {
      if (Date.now() - cacheEntry.timestamp < this._options.cacheExpiry) {
        debug('Cache hit: %s', path);
        return cacheEntry.data;
      }

      delete this._cache[cacheKey];
    }

    debug('Cache miss: %s', path);
  }

  return null;
};


/**
 * Stores an item in the internal cache.
 *
 * @param {string}  path - Path for this API request.
 * @param {object}  options - Query String parameters for this API request.
 * @param {object}  data - Data item to be cached.
 * @private
 */
BStackClient.prototype._cacheResult = function _cacheResult(path, options, data) {
  if (this._options.useCache && this._options.cacheExpiry > 0) {
    if (typeof options === 'object' && typeof data !== 'object') {
      // _cacheResult(path, data)
      data = options;
      options = null;
    }

    var cacheKey = this._getCacheKey(path, options);
    this._cache[cacheKey] = {
      data: data,
      timestamp: Date.now()
    };
  }
};


/**
 * Stores an item in the internal cache.
 *
 * @param {string}  path - Path containing template placeholders.
 * @param {array}  values - Values with which each placeholder is to be replaced
 * from left to right.
 * @return {string}  Path with all placeholders replaced by values.
 * @private
 */
BStackClient.prototype._buildPath = function _buildPath() {
  var args = Array.prototype.slice.call(arguments);
  var pathTemplate = args.shift();
  var matches = pathTemplate.match(/<[^>]+>/g);

  if (Array.isArray(args[0])) {
    args = args[0];
  }

  if (matches.length !== args.length) {
    throw new Error('Mismatched arguments. ' +
      args.length + ' arguments given for path ' + pathTemplate);
  }

  var path = pathTemplate;
  while (args.length) {
    path = path.replace(matches.shift(), args.shift());
  }

  return path;
};


module.exports = BStackClient;

'use strict';

/* global -Promise */
var Promise = require('bluebird');

var util = require('util');
var debug = require('diagnostics')('bstack:client:api-v4');

var BStackClient = require('./client');
var defaults = require('./defaults').api.v4;
var WorkerPoller = require('./helper/poller');


/**
 * BrowserStack JavaScript Testing API.
 * <br/>
 * Spec: {@link https://github.com/browserstack/api/tree/v4}
 *
 * @class
 * @classdesc Create and manage workers for automated JavaScript testing.
 * @version  v4
 * @param  {object} options - Options for APIClient. Optional.
 * @param  {string} options.username - Username for the BrowserStack account. Optional. If not supplied, `BROWSERSTACK_USERNAME` environment variable is used.
 * @param  {string} options.key - API Key for this product subscription. Optional. If not supplied, `BROWSERSTACK_KEY` environment variable is used.
 * @param  {boolean} options.returnHeaders - Return the API response headers along with the response. If enabled, the response will be available under the `data` node of the result object. Default: `false`.
 * @param  {boolean} options.useCache - Cache the list of browsers returned by the `getBrowsers()` method. Optional. Default: `true`.
 * @param  {number} options.cacheExpiry - Time in milliseconds after which the cache expires. Optional. Default: `864e5`.
 * @public
 */
function APIClient(options) {
  if (!(this instanceof APIClient)) { return new APIClient(options); }

  APIClient.super_.apply(this, [ options, defaults ]);
  this._workerPoller = new WorkerPoller(this);
}

util.inherits(APIClient, BStackClient);


/**
 * Fetches all available browsers.
 *
 * Note that this method may returned cached data. To turn off caching,
 * please create an instance of this class with `options.useCache = false`.
 *
 * @param  {object} options - Options for this request.
 * @param  {boolean} options.flat - Get browser list as a flat JSON structure.
 * @param  {boolean} options.all - Include beta/dev versions of browsers.
 * @param  {callback} callback - Optional callback. Use promise or callback.
 * @return {Promise} Bluebird Promise object
 * @public
 */
APIClient.prototype.getBrowsers = function getBrowsers(options, callback) {
  var self = this;
  var path = '/browsers';

  if (typeof options === 'function') {
    callback = options;
    options = null;
  }

  var cacheEntry = this._getCached(path, options);
  if (cacheEntry) {
    return Promise.resolve(cacheEntry).nodeify(callback);
  }

  return this._request({
    method: 'GET',
    path: path,
    data: options
  }).then(function (data) {
    self._cacheResult(path, options, data);
    return data;
  }).nodeify(callback);
};


/**
 * Gets the list of current workers with their statuses.
 *
 * @param  {callback} callback - Optional callback. Use promise or callback.
 * @return {Promise} Bluebird Promise object
 * @public
 */
APIClient.prototype.getWorkers = function getWorkers(callback) {
  return this._request({
    method: 'GET',
    path: '/workers',
    data: null
  }).nodeify(callback);
};


/**
 * Polls the list of tracked workers for updates
 *
 * @return {Promise} Bluebird Promise object that resolves to a WorkerPoller instance.
 * @public
 */
APIClient.prototype.pollWorkers = function pollWorkers(pollInterval) {
  return this._workerPoller.poll(pollInterval);
};


/**
 * Creates a New Browser Worker.
 *
 * @desc  A browser worker is simply a new browser instance.
 *
 * @param  {object} options - Options for this request.
 * @param  {string} options.url - URL to be opened in the remote browser.
 * @param  {string} options.os - OS name.
 * @param  {string} options.os_version - OS version.
 * @param  {string} options.browser - Browser name.
 * @param  {string} options.browser_version - Browser version (skip for device).
 * @param  {string} options.device - Device to be used (skip for desktop). Defaults to the first available device for the provided OS version.
 * @param  {number} options.timeout - Time in seconds before the worker is terminated. Defaults to 300; max value 1800. Optional.
 * @param  {string} options.name - Name for the worker/session. Optional.
 * @param  {string} options.build - Name of the build the session is running under. Optional.
 * @param  {string} options.project - Name of the project the build is under. Optional.
 * @param  {string} options.track - `true` if the worker is to be polled later with `pollWorkers()`. Optional.
 * @param  {callback} callback - Optional callback. Use promise or callback.
 * @return {Promise} Bluebird Promise object
 * @public
 */
APIClient.prototype.createWorker = function createWorker(options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = null;
  }

  return this._request({
    method: 'POST',
    path: '/worker',
    data: options
  })
  .bind(this)
  .tap(function (worker) {
    if (options && options.track && worker && worker.id) {
      this._workerPoller.track(worker);
    }
  })
  .nodeify(callback);
};


/**
 * Terminate a worker by its ID.
 *
 * @param  {string} workerId - Worker ID for the worker to be terminated.
 * @param  {callback} callback - Optional callback. Use promise or callback.
 * @return {Promise} Bluebird Promise object
 * @public
 */
APIClient.prototype.terminateWorker = function terminateWorker(workerId, callback) {
  var path = this._buildPath('/worker/<worker-id>', workerId);

  return this._request({
    method: 'DELETE',
    path: path,
    data: null
  }).nodeify(callback);
};


/**
 * Gets the properties of a worker by its ID.
 *
 * @param  {string} workerId - Worker ID for the worker to be fetched.
 * @param  {callback} callback - Optional callback. Use promise or callback.
 * @return {Promise} Bluebird Promise object
 * @public
 */
APIClient.prototype.getWorker = function getWorker(workerId, callback) {
  var path = this._buildPath('/worker/<worker-id>', workerId);

  return this._request({
    method: 'GET',
    path: path,
    data: null
  }).nodeify(callback);
};


/**
 * Take a screenshot at the current state of the worker.
 *
 * @param  {string} workerId - Worker ID for the worker to be captured.
 * @param  {callback} callback - Optional callback. Use promise or callback.
 * @return {Promise} Bluebird Promise object
 * @public
 */
APIClient.prototype.takeScreenshot = function takeScreenshot(workerId, callback) {
  var path = this._buildPath('/worker/<worker-id>/screenshot.json', workerId);

  return this._request({
    method: 'GET',
    path: path,
    data: null
  }).nodeify(callback);
};


/**
 * Set a new URL for a worker-browser instance to navigate to.
 *
 * @param  {string} workerId - Worker ID for the worker to be captured.
 * @param  {object} options - Options for this request.
 * @param  {string} options.url - New URL to navigate to.
 * @param  {callback} callback - Optional callback. Use promise or callback.
 * @return {Promise} Bluebird Promise object
 * @public
 */
APIClient.prototype.changeUrl = function changeUrl(workerId, options, callback) {
  var path = this._buildPath('/worker/<worker-id>/url.json', workerId);

  return this._request({
    method: 'PUT',
    path: path,
    data: options
  }).nodeify(callback);
};


/**
 * Gets the current status of API, including no. of workers currently runnning and usage limits.
 *
 * @param  {callback} callback - Optional callback. Use promise or callback.
 * @return {Promise} Bluebird Promise object
 * @public
 */
APIClient.prototype.getStatus = function getStatus(callback) {
  return this._request({
    method: 'GET',
    path: '/status',
    data: null
  }).nodeify(callback);
};


module.exports = APIClient;

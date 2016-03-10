'use strict';

/* global -Promise */
var Promise = require('bluebird');

var util = require('util');
var debug = require('diagnostics')('bstack:client:automate');

var BStackClient = require('./client');
var defaults = require('./defaults').automate.v1;


/**
 * BrowserStack Automate API.
 * <br/>
 * Spec: {@link https://www.browserstack.com/automate/rest-api}
 *
 * @class
 * @classdesc Access and manage information about your BrowserStack Automate tests.
 * @version  v1
 * @param {object} options Options for AutomateClient. Optional.
 * @param  {string} options.username - Username for the BrowserStack account. Optional. If not supplied, `BROWSERSTACK_USERNAME` environment variable is used.
 * @param  {string} options.key - API Key for this product subscription. Optional. If not supplied, `BROWSERSTACK_KEY` environment variable is used.
 * @param  {boolean} options.returnHeaders - Return the API response headers along with the response. If enabled, the response will be available under the `data` node of the result object. Default: `false`.
 * @param  {boolean} options.useCache - Cache the list of browsers returned by the `getBrowsers()` method. Optional. Default: `true`.
 * @param  {number} options.cacheExpiry - Time in milliseconds after which the cache expires. Optional. Default: `864e5`.
 * @public
 */
function AutomateClient(options) {
  if (!(this instanceof AutomateClient)) { return new AutomateClient(options); }

  AutomateClient.super_.apply(this, [ options, defaults ]);
}

util.inherits(AutomateClient, BStackClient);


/**
 * Fetches all available browsers.
 *
 * Note that this method may returned cached data. To turn off caching,
 * please create an instance of this class with `options.useCache = false`.
 *
 * @param  {callback} callback - Optional callback. Use promise or callback.
 * @return {Promise} Bluebird Promise object
 * @public
 */
AutomateClient.prototype.getBrowsers = function getBrowsers(callback) {
  var self = this;
  var path = '/browsers.json';

  var cacheEntry = this._getCached(path);
  if (cacheEntry) {
    return Promise.resolve(cacheEntry).nodeify(callback);
  }

  return this._request({
    method: 'GET',
    path: path,
    data: null
  }).then(function (data) {
    self._cacheResult(path, data);
    return data;
  }).nodeify(callback);
};


/**
 * Fetches information about the current Automate subscription,
 * including maximum no. of parallel sessions allowed and the no. of parallel
 * sessions currently running.
 *
 * @param  {callback} callback - Optional callback. Use promise or callback.
 * @return {Promise} Bluebird Promise object
 * @public
 */
AutomateClient.prototype.getStatus = function getStatus(callback) {
  return this._request({
    method: 'GET',
    path: '/plan.json',
    data: null
  }).nodeify(callback);
};


/**
 * Fetches the list of projects available for this account.
 *
 * @desc  Projects are organizational structures for builds.
 *
 * @param  {callback} callback - Optional callback. Use promise or callback.
 * @return {Promise} Bluebird Promise object
 * @public
 */
AutomateClient.prototype.getProjects = function getProjects(callback) {
  return this._request({
    method: 'GET',
    path: '/projects.json',
    data: null
  }).nodeify(callback);
};


/**
 * Fetches the properties of a project by its project ID.
 *
 * @param  {string} projectId - Project ID for the project to be fetched.
 * @param  {callback} callback - Optional callback. Use promise or callback.
 * @return {Promise} Bluebird Promise object
 * @public
 */
AutomateClient.prototype.getProject = function getProject(projectId, callback) {
  var path = this._buildPath('/projects/<project-id>.json', projectId);

  return this._request({
    method: 'GET',
    path: path,
    data: null
  }).nodeify(callback);
};


/**
 * Fetches the list of builds available for this account.
 *
 * @desc  Builds are organizational structures for tests.
 *
 * @param  {object} options - Options for this request.
 * @param  {number} options.limit - Maximum no. of results to be displayed. Default: 10.
 * @param  {string} options.status - Values: running, done, failed.
 * @param  {callback} callback - Optional callback. Use promise or callback.
 * @return {Promise} Bluebird Promise object
 * @public
 */
AutomateClient.prototype.getBuilds = function getBuilds(options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = null;
  }

  return this._request({
    method: 'GET',
    path: '/builds.json',
    data: options
  }).nodeify(callback);
};


/**
 * Fetches the list of sessions available for a given build.
 *
 * @param  {string} buildId - Build ID for the build to be queried.
 * @param  {object} options - Options for this request.
 * @param  {number} options.limit - Maximum no. of results to be displayed. Default: 10.
 * @param  {string} options.status - Values: running, done, failed.
 * @param  {callback} callback - Optional callback. Use promise or callback.
 * @return {Promise} Bluebird Promise object
 * @public
 */
AutomateClient.prototype.getBuildSessions = function getBuildSessions(buildId, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = null;
  }

  var path = this._buildPath('/builds/<build-id>/sessions.json', buildId);

  return this._request({
    method: 'GET',
    path: path,
    data: options
  }).nodeify(callback);
};


/**
 * Gets the properties of an Automate session by its session ID.
 *
 * @param  {string} sessionId - Session ID for the session to be fetched.
 * @param  {callback} callback - Optional callback. Use promise or callback.
 * @return {Promise} Bluebird Promise object
 * @public
 */
AutomateClient.prototype.getSession = function getSession(sessionId, callback) {
  var path = this._buildPath('/sessions/<session-id>.json', sessionId);

  return this._request({
    method: 'GET',
    path: path,
    data: null
  }).nodeify(callback);
};


/**
 * Sets the status for an Automate session.
 *
 * @param  {string} sessionId - Session ID for the session to be queried.
 * @param  {object} data - Properties to be set.
 * @param  {string} data.status - Set the status. Values: completed, error.
 * @param  {string} data.reason - Set the reason for the change. Optional.
 * @param  {callback} callback - Optional callback. Use promise or callback.
 * @return {Promise} Bluebird Promise object
 * @public
 */
AutomateClient.prototype.setStatus = function setStatus(sessionId, data, callback) {
  var path = this._buildPath('/sessions/<session-id>.json', sessionId);

  return this._request({
    method: 'PUT',
    path: path,
    data: data
  }).nodeify(callback);
};


/**
 * Retrieves the logs for an Automate session.
 *
 * @param  {string} sessionId - Session ID for the session to be queried.
 * @param  {callback} callback - Optional callback. Use promise or callback.
 * @return {Promise} Bluebird Promise object
 * @public
 */
AutomateClient.prototype.getSessionLogs = function getSessionLogs(sessionId, callback) {
  var path = this._buildPath('/sessions/<session-id>/logs', sessionId);

  return this._request({
    method: 'GET',
    path: path,
    data: null
  }).nodeify(callback);
};


/**
 * Obtains a new access key.
 * Note: The same access key is used for Automate and Local Testing.
 *
 * @param  {callback} callback - Optional callback. Use promise or callback.
 * @return {Promise} Bluebird Promise object
 * @public
 */
AutomateClient.prototype.recycleKey = function recycleKey(callback) {
  return this._request({
    method: 'PUT',
    path: '/recycle_key.json',
    data: {}
  }).nodeify(callback);
};


module.exports = AutomateClient;

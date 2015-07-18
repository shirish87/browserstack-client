'use strict';

/* global -Promise */
var Promise = require('bluebird');

var util = require('util');
var debug = require('diagnostics')('bstack:client:screenshots');

var BStackClient = require('./client');
var defaults = require('./defaults').screenshots.v1;


/**
 * BrowserStack Screenshots API.
 * <br/>
 * Spec: {@link https://www.browserstack.com/screenshots/api}
 *
 * @class
 * @classdesc Create and manage Screenshot jobs.
 * @version  v1
 * @param {object} options - Options for ScreenshotsClient
 * @public
 */
function ScreenshotsClient(options) {
  if (!(this instanceof ScreenshotsClient)) {
    return new ScreenshotsClient(options);
  }

  ScreenshotsClient.super_.apply(this, [ options, defaults ]);
}

util.inherits(ScreenshotsClient, BStackClient);


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
ScreenshotsClient.prototype.getBrowsers = function getBrowsers(callback) {
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
 * Creates a new Screenshots Job.
 *
 * @param  {object} options - Options for this request.
 * @param  {string} options.url - URL of the desired page.
 * @param  {string} options.os - OS you want to test.
 * @param  {string} options.os_version - OS version you want to test.
 * @param  {string} options.browser - Browser you want to test.
 * @param  {string} options.browser_version - Browser version you want to test.
 * @param  {string} options.device - Device to be used (skip for desktop).
 * @param  {string} options.orientation - Required if specifying the screen orientation for the device. Values: portrait, landscape. Default: portrait.
 * @param  {string} options.mac_res - Screen resolution for browsers on OSX. Values: 1024x768, 1280x960, 1280x1024, 1600x1200, 1920x1080.
 * @param  {string} options.win_res - Screen resolution for browsers on Windows. Values: 1024x768, 1280x1024.
 * @param  {string} options.quality - Quality of the screenshot. Values: Original, Compressed.
 * @param  {boolean} options.local - Required if the page is local and that a Local Testing connection has been set up.
 * @param  {int} options.wait_time - Time to wait (seconds) before taking the screenshot. Values: 2, 5, 10, 15, 20, 60.
 * @param  {string} options.callback_url - Publicly accessible URL to be used to send results after processing is complete.
 * @param  {callback} callback - Optional callback. Use promise or callback.
 * @return {Promise} Bluebird Promise object
 * @public
 */
ScreenshotsClient.prototype.createJob = function generateScreenshots(options, callback) {
  return this._request({
    method: 'POST',
    data: options
  }).nodeify(callback);
};


/**
 * Gets the properties of a Screenshots Job.
 *
 * @param  {string} jobId - Job ID for the screenshots job.
 * @return {Promise} Bluebird Promise object
 * @public
 */
ScreenshotsClient.prototype.getJob = function generateScreenshots(jobId, callback) {
  var path = this._buildPath('/<job-id>.json', jobId);

  return this._request({
    method: 'GET',
    path: path,
    data: null
  }).nodeify(callback);
};


module.exports = ScreenshotsClient;

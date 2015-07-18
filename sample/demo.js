'use strict';

/* global -Promise */
var Promise = require('bluebird');
var BrowserStack = require('..');

var apiClient = new BrowserStack.APIClient();
var automateClient = new BrowserStack.AutomateClient();
var screenshotsClient = new BrowserStack.ScreenshotsClient();


Promise.join(
  apiClient.getBrowsers({ flat: true }),
  automateClient.getStatus(),
  screenshotsClient.createJob({
    url: 'https://www.google.com/ncr',
    wait_time: 5,
    browsers: [
      {
       os: 'Windows',
       os_version: 'XP',
       browser: 'ie',
       browser_version: '7.0'
      }
    ]
  }),
  function (apiBrowsers, automateStatus, screenshotJob) {
    console.log('API Browsers:', apiBrowsers.length);
    console.log('Automate Status:', automateStatus);
    console.log('New Screenshot Job:', screenshotJob);
  })
  .catch(function (e) {
    console.log('Error', e);
  });

'use strict';

var APIClient = require('./lib/api-v4');
var AutomateClient = require('./lib/automate-v1');
var ScreenshotsClient = require('./lib/screenshots-v1');


module.exports = {
  APIClient: APIClient,
  AutomateClient: AutomateClient,
  ScreenshotsClient: ScreenshotsClient
};

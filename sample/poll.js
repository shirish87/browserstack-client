'use strict';

var BrowserStack = require('../');
var Client = BrowserStack.Client;

var apiClient = new BrowserStack.Client();

apiClient.createWorker({
   os: 'Windows',
   os_version: 'XP',
   browser: 'ie',
   browser_version: '7.0',
   url: 'http://theverge.com',
   track: true     // track for polling with .pollWorkers()
}).then(console.log)
  .catch(console.log);


var pollInterval = 5000;

apiClient.pollWorkers(pollInterval).then(function (poller) {
  poller.on('poll', function (activeWorkers) {
    console.log('poll', activeWorkers);
  });

  poller.on('create', console.log);
  poller.on('delete', console.log);
  poller.on('update', console.log);

}).catch(console.log);

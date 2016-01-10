'use strict';

/* global -Promise */
var Promise = require('bluebird');
var BrowserStack = require('..');

var apiClient = new BrowserStack.Client();

apiClient.getWorkers().then(function (workers) {
  console.log('workerCount', workers.length);

  Promise.map(workers || [], function (worker) {
    console.log('Killing worker', worker.id);
    return apiClient.terminateWorker(worker.id).catch(console.error);
  }, {
    concurrency: 4
  }).then(function (w) {
    console.log('Killed', w);
  }).catch(console.error);

}).catch(console.error);

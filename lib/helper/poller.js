'use strict';

/* global -Promise */
var Promise = require('bluebird');

var EventEmitter = require('events').EventEmitter;
var util = require('util');


function copyProperties(src, dest) {
  if (typeof src === 'object' && !Array.isArray(src)) {
    for (var k in src) {
      if (Object.hasOwnProperty(k)) {
        dest[k] = src[k];
      }
    }
  }

  return dest;
}

function Worker(data) {
  EventEmitter.call(this);

  copyProperties(data, this);
}

util.inherits(Worker, EventEmitter);


/**
 * Tracks worker state across runs.
 */
function WorkerPoller(client) {
  EventEmitter.call(this);

  this._client = client;
  this._workers = {};
}

util.inherits(WorkerPoller, EventEmitter);


WorkerPoller.prototype.track = function track(workerData) {
  if (this._workers[workerData.id]) {
    return this.untrack(this._workers[workerData.id]);
  }

  var worker = new Worker(workerData);
  this._workers[workerData.id] = worker;

  worker.emit('status', worker.status);
  this.emit('create', worker);
  return worker;
};


WorkerPoller.prototype.untrack = function untrack(worker) {
  worker.emit('delete', worker);
  this.emit('delete', worker);
  worker.removeAllListeners();

  delete this._workers[worker.id];
  return worker;
};


WorkerPoller.prototype.update = function update(workerData) {
  var workers = this._workers;
  if (!workers[workerData.id]) return null;

  var worker = workers[workerData.id];
  var prevStatus = worker.status;
  copyProperties(workerData, worker);

  if (worker.status !== prevStatus) {
    worker.emit('status', worker.status);
    this.emit('update', worker);
  }

  return worker;
};


WorkerPoller.prototype._poll = function _poll(pollInterval) {
  this._poller = this._client.getWorkers()
    .bind(this)
    .then(function (updatedWorkers) {
      var self = this;

      var activeWorkers = (updatedWorkers || []).reduce(function (o, worker) {
        o[worker.id] = worker;
        return o;
      }, {});

      Object.keys(this._workers).forEach(function (workerId) {
        if (activeWorkers[workerId]) {
          // process updates
          self.update(activeWorkers[workerId]);
        } else {
          // process deletions
          self.untrack(self._workers[workerId]);
        }
      });

      return Promise.delay(pollInterval).bind(this).then(function () {
        this.emit('poll', activeWorkers);
        return this._poll(pollInterval);
      });
    })
    .cancellable();

  return this._poller;
};


WorkerPoller.prototype.poll = function poll(pollInterval) {
  if (this._poller) return Promise.resolve(this);

  this._poll(pollInterval)
    .bind(this)
    .catch(function (err) {
      this.emit('error', err);
    })
    .finally(function () {
      this._poller = null;
      this.emit('stop', this);
    });

  return Promise.resolve(this);
};


WorkerPoller.prototype.isPolling = function isPolling() {
  return this._poller && !this._poller.isCancelled();
};


WorkerPoller.prototype.stop = function stop() {
  return this.isPolling() && this._poller.cancel();
};


WorkerPoller.prototype.reset = function reset() {
  if (this.isPolling()) this.stop();

  this._workers = {};
  this.removeAllListeners();
};


module.exports = WorkerPoller;

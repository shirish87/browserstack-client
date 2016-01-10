# BrowserStack Client

This module interfaces all REST APIs offered by [BrowserStack](https://www.browserstack.com).

***This module is a work-in-progress and may see breaking changes.***


## Installation
```
$ npm i --save browserstack-client
```

## Requirements

Please ensure that your BrowserStack account contains the required subscription(s) for using the APIs provided by this module.

Add your BrowserStack username and API key for Automate/JavaScript testing to the following environment variables for your shell.

You may also supply these credentials in code when creating an instance of an API client. See `options.username` and `options.key`.
```
BROWSERSTACK_USERNAME=<your-username>
BROWSERSTACK_KEY=<your-access-key>
```


## Usage

```
var BrowserStack = require('browserstack-client');

// BrowserStack JavaScript Testing API
var apiClient = new BrowserStack.Client();

// BrowserStack Automate API
var automateClient = new BrowserStack.AutomateClient();

// BrowserStack Screenshots API
var screenshotsClient = new BrowserStack.ScreenshotsClient();
```


All method calls return a [Bluebird](https://github.com/petkaantonov/bluebird) promise and also take an optional callback parameter.

```
// Using Bluebird Promise
apiClient
  .getStatus()
  .then(function (status) {
    console.log('Status', status);
  })
  .catch(function (e) {
    console.error(e);
  });

// Using node-convention callbacks
apiClient.getStatus(function (err, status) {
  if (err) { return console.error(err); }

  console.log('Status', status);
});

```

Please refer to the documentation below for methods available for each of these clients.

* * *

## Documentation
<dl>
<dt><a href="#Client">Client</a></dt>
<dd><p>Create and manage workers for automated JavaScript testing.</p>
</dd>
<dt><a href="#AutomateClient">AutomateClient</a></dt>
<dd><p>Access and manage information about your BrowserStack Automate tests.</p>
</dd>
<dt><a href="#ScreenshotsClient">ScreenshotsClient</a></dt>
<dd><p>Create and manage Screenshot jobs running under the BrowserStack Screenshots API.</p>
</dd>
</dl>

<a name="Client"></a>
## Client
Create and manage workers for automated JavaScript testing.

**Kind**: global class  
**Access:** public  
**Version**: v4  

* [Client](#Client)
  * [new Client(options)](#new_Client_new)
  * [.getBrowsers(options, callback)](#Client+getBrowsers) ⇒ <code>Promise</code>
  * [.getWorkers(callback)](#Client+getWorkers) ⇒ <code>Promise</code>
  * [.createWorker(options, callback)](#Client+createWorker) ⇒ <code>Promise</code>
  * [.terminateWorker(workerId, callback)](#Client+terminateWorker) ⇒ <code>Promise</code>
  * [.getWorker(workerId, callback)](#Client+getWorker) ⇒ <code>Promise</code>
  * [.takeScreenshot(workerId, callback)](#Client+takeScreenshot) ⇒ <code>Promise</code>
  * [.changeUrl(workerId, options, callback)](#Client+changeUrl) ⇒ <code>Promise</code>
  * [.getStatus(callback)](#Client+getStatus) ⇒ <code>Promise</code>

<a name="new_Client_new"></a>
### new Client(options)
BrowserStack JavaScript Testing API.
<br/>
Spec: [https://github.com/browserstack/api/tree/v4](https://github.com/browserstack/api/tree/v4)


| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | Options for Client. Optional. |
| options.username | <code>string</code> | Username for the BrowserStack account. Optional. If not supplied, `BROWSERSTACK_USERNAME` environment variable is used. |
| options.key | <code>string</code> | API Key for this product subscription. Optional. If not supplied, `BROWSERSTACK_KEY` environment variable is used. |
| options.returnHeaders | <code>boolean</code> | Return the API response headers along with the response. If enabled, the response will be available under the `data` node of the result object. Default: `false`. |
| options.useCache | <code>boolean</code> | Cache the list of browsers returned by the `getBrowsers()` method. Optional. Default: `true`. |
| options.cacheExpiry | <code>number</code> | Time in milliseconds after which the cache expires. Optional. Default: `864e5`. |

<a name="Client+getBrowsers"></a>
### apiClient.getBrowsers(options, callback) ⇒ <code>Promise</code>
Fetches all available browsers.

Note that this method may returned cached data. To turn off caching,
please create an instance of this class with `options.useCache = false`.

**Kind**: instance method of <code>[Client](#Client)</code>  
**Returns**: <code>Promise</code> - Bluebird Promise object  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | Options for this request. |
| options.flat | <code>boolean</code> | Get browser list as a flat JSON structure. |
| options.all | <code>boolean</code> | Include beta/dev versions of browsers. |
| callback | <code>callback</code> | Optional callback. Use promise or callback. |

<a name="Client+getWorkers"></a>
### apiClient.getWorkers(callback) ⇒ <code>Promise</code>
Gets the list of current workers with their statuses.

**Kind**: instance method of <code>[Client](#Client)</code>  
**Returns**: <code>Promise</code> - Bluebird Promise object  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>callback</code> | Optional callback. Use promise or callback. |

<a name="Client+createWorker"></a>
### apiClient.createWorker(options, callback) ⇒ <code>Promise</code>
A browser worker is simply a new browser instance.

**Kind**: instance method of <code>[Client](#Client)</code>  
**Returns**: <code>Promise</code> - Bluebird Promise object  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | Options for this request. |
| options.url | <code>string</code> | URL to be opened in the remote browser. |
| options.os | <code>string</code> | OS name. |
| options.os_version | <code>string</code> | OS version. |
| options.browser | <code>string</code> | Browser name. |
| options.browser_version | <code>string</code> | Browser version (skip for device). |
| options.device | <code>string</code> | Device to be used (skip for desktop). Defaults to the first available device for the provided OS version. |
| options.timeout | <code>number</code> | Time in seconds before the worker is terminated. Defaults to 300; max value 1800. Optional. |
| options.name | <code>string</code> | Name for the worker/session. Optional. |
| options.build | <code>string</code> | Name of the build the session is running under. Optional. |
| options.project | <code>string</code> | Name of the project the build is under. Optional. |
| callback | <code>callback</code> | Optional callback. Use promise or callback. |

<a name="Client+terminateWorker"></a>
### apiClient.terminateWorker(workerId, callback) ⇒ <code>Promise</code>
Terminate a worker by its ID.

**Kind**: instance method of <code>[Client](#Client)</code>  
**Returns**: <code>Promise</code> - Bluebird Promise object  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| workerId | <code>string</code> | Worker ID for the worker to be terminated. |
| callback | <code>callback</code> | Optional callback. Use promise or callback. |

<a name="Client+getWorker"></a>
### apiClient.getWorker(workerId, callback) ⇒ <code>Promise</code>
Gets the properties of a worker by its ID.

**Kind**: instance method of <code>[Client](#Client)</code>  
**Returns**: <code>Promise</code> - Bluebird Promise object  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| workerId | <code>string</code> | Worker ID for the worker to be fetched. |
| callback | <code>callback</code> | Optional callback. Use promise or callback. |

<a name="Client+takeScreenshot"></a>
### apiClient.takeScreenshot(workerId, callback) ⇒ <code>Promise</code>
Take a screenshot at the current state of the worker.

**Kind**: instance method of <code>[Client](#Client)</code>  
**Returns**: <code>Promise</code> - Bluebird Promise object  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| workerId | <code>string</code> | Worker ID for the worker to be captured. |
| callback | <code>callback</code> | Optional callback. Use promise or callback. |

<a name="Client+changeUrl"></a>
### apiClient.changeUrl(workerId, options, callback) ⇒ <code>Promise</code>
Set a new URL for a worker-browser instance to navigate to.

**Kind**: instance method of <code>[Client](#Client)</code>  
**Returns**: <code>Promise</code> - Bluebird Promise object  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| workerId | <code>string</code> | Worker ID for the worker to be captured. |
| options | <code>object</code> | Options for this request. |
| options.url | <code>string</code> | New URL to navigate to. |
| callback | <code>callback</code> | Optional callback. Use promise or callback. |

<a name="Client+getStatus"></a>
### apiClient.getStatus(callback) ⇒ <code>Promise</code>
Gets the current status of API, including no. of workers currently runnning and usage limits.

**Kind**: instance method of <code>[Client](#Client)</code>  
**Returns**: <code>Promise</code> - Bluebird Promise object  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>callback</code> | Optional callback. Use promise or callback. |



<a name="AutomateClient"></a>
## AutomateClient
Access and manage information about your BrowserStack Automate tests.

**Kind**: global class  
**Access:** public  
**Version**: v1  

* [AutomateClient](#AutomateClient)
  * [new AutomateClient(options)](#new_AutomateClient_new)
  * [.getBrowsers(callback)](#AutomateClient+getBrowsers) ⇒ <code>Promise</code>
  * [.getStatus(callback)](#AutomateClient+getStatus) ⇒ <code>Promise</code>
  * [.getProjects(callback)](#AutomateClient+getProjects) ⇒ <code>Promise</code>
  * [.getProject(projectId, callback)](#AutomateClient+getProject) ⇒ <code>Promise</code>
  * [.getBuilds(options, callback)](#AutomateClient+getBuilds) ⇒ <code>Promise</code>
  * [.getBuildSessions(buildId, options, callback)](#AutomateClient+getBuildSessions) ⇒ <code>Promise</code>
  * [.getSession(sessionId, callback)](#AutomateClient+getSession) ⇒ <code>Promise</code>
  * [.setStatus(buildId, sessionId, data, callback)](#AutomateClient+setStatus) ⇒ <code>Promise</code>
  * [.getSessionLogs(sessionId, callback)](#AutomateClient+getSessionLogs) ⇒ <code>Promise</code>
  * [.recycleKey(callback)](#AutomateClient+recycleKey) ⇒ <code>Promise</code>

<a name="new_AutomateClient_new"></a>
### new AutomateClient(options)
BrowserStack Automate API.
<br/>
Spec: [https://www.browserstack.com/automate/rest-api](https://www.browserstack.com/automate/rest-api)


| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | Options for AutomateClient. Optional. |
| options.username | <code>string</code> | Username for the BrowserStack account. Optional. If not supplied, `BROWSERSTACK_USERNAME` environment variable is used. |
| options.key | <code>string</code> | API Key for this product subscription. Optional. If not supplied, `BROWSERSTACK_KEY` environment variable is used. |
| options.returnHeaders | <code>boolean</code> | Return the API response headers along with the response. If enabled, the response will be available under the `data` node of the result object. Default: `false`. |
| options.useCache | <code>boolean</code> | Cache the list of browsers returned by the `getBrowsers()` method. Optional. Default: `true`. |
| options.cacheExpiry | <code>number</code> | Time in milliseconds after which the cache expires. Optional. Default: `864e5`. |

<a name="AutomateClient+getBrowsers"></a>
### automateClient.getBrowsers(callback) ⇒ <code>Promise</code>
Fetches all available browsers.

Note that this method may returned cached data. To turn off caching,
please create an instance of this class with `options.useCache = false`.

**Kind**: instance method of <code>[AutomateClient](#AutomateClient)</code>  
**Returns**: <code>Promise</code> - Bluebird Promise object  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>callback</code> | Optional callback. Use promise or callback. |

<a name="AutomateClient+getStatus"></a>
### automateClient.getStatus(callback) ⇒ <code>Promise</code>
Fetches information about the current Automate subscription,
including maximum no. of parallel sessions allowed and the no. of parallel
sessions currently running.

**Kind**: instance method of <code>[AutomateClient](#AutomateClient)</code>  
**Returns**: <code>Promise</code> - Bluebird Promise object  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>callback</code> | Optional callback. Use promise or callback. |

<a name="AutomateClient+getProjects"></a>
### automateClient.getProjects(callback) ⇒ <code>Promise</code>
Projects are organizational structures for builds.

**Kind**: instance method of <code>[AutomateClient](#AutomateClient)</code>  
**Returns**: <code>Promise</code> - Bluebird Promise object  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>callback</code> | Optional callback. Use promise or callback. |

<a name="AutomateClient+getProject"></a>
### automateClient.getProject(projectId, callback) ⇒ <code>Promise</code>
Fetches the properties of a project by its project ID.

**Kind**: instance method of <code>[AutomateClient](#AutomateClient)</code>  
**Returns**: <code>Promise</code> - Bluebird Promise object  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| projectId | <code>string</code> | Project ID for the project to be fetched. |
| callback | <code>callback</code> | Optional callback. Use promise or callback. |

<a name="AutomateClient+getBuilds"></a>
### automateClient.getBuilds(options, callback) ⇒ <code>Promise</code>
Builds are organizational structures for tests.

**Kind**: instance method of <code>[AutomateClient](#AutomateClient)</code>  
**Returns**: <code>Promise</code> - Bluebird Promise object  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | Options for this request. |
| options.limit | <code>number</code> | Maximum no. of results to be displayed. Default: 10. |
| options.status | <code>string</code> | Values: running, done, failed. |
| callback | <code>callback</code> | Optional callback. Use promise or callback. |

<a name="AutomateClient+getBuildSessions"></a>
### automateClient.getBuildSessions(buildId, options, callback) ⇒ <code>Promise</code>
Fetches the list of sessions available for a given build.

**Kind**: instance method of <code>[AutomateClient](#AutomateClient)</code>  
**Returns**: <code>Promise</code> - Bluebird Promise object  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| buildId | <code>string</code> | Build ID for the build to be queried. |
| options | <code>object</code> | Options for this request. |
| options.limit | <code>number</code> | Maximum no. of results to be displayed. Default: 10. |
| options.status | <code>string</code> | Values: running, done, failed. |
| callback | <code>callback</code> | Optional callback. Use promise or callback. |

<a name="AutomateClient+getSession"></a>
### automateClient.getSession(sessionId, callback) ⇒ <code>Promise</code>
Gets the properties of an Automate session by its session ID.

**Kind**: instance method of <code>[AutomateClient](#AutomateClient)</code>  
**Returns**: <code>Promise</code> - Bluebird Promise object  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| sessionId | <code>string</code> | Session ID for the session to be fetched. |
| callback | <code>callback</code> | Optional callback. Use promise or callback. |

<a name="AutomateClient+setStatus"></a>
### automateClient.setStatus(buildId, sessionId, data, callback) ⇒ <code>Promise</code>
Sets the status for an Automate session.

**Kind**: instance method of <code>[AutomateClient](#AutomateClient)</code>  
**Returns**: <code>Promise</code> - Bluebird Promise object  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| buildId | <code>string</code> | Build ID for the build. |
| sessionId | <code>string</code> | Session ID for the session to be queried. |
| data | <code>object</code> | Properties to be set. |
| data.status | <code>string</code> | Set the status. Values: completed, error. |
| data.reason | <code>string</code> | Set the reason for the change. Optional. |
| callback | <code>callback</code> | Optional callback. Use promise or callback. |

<a name="AutomateClient+getSessionLogs"></a>
### automateClient.getSessionLogs(sessionId, callback) ⇒ <code>Promise</code>
Retrieves the logs for an Automate session.

**Kind**: instance method of <code>[AutomateClient](#AutomateClient)</code>  
**Returns**: <code>Promise</code> - Bluebird Promise object  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| sessionId | <code>string</code> | Session ID for the session to be queried. |
| callback | <code>callback</code> | Optional callback. Use promise or callback. |

<a name="AutomateClient+recycleKey"></a>
### automateClient.recycleKey(callback) ⇒ <code>Promise</code>
Obtains a new access key.
Note: The same access key is used for Automate and Local Testing.

**Kind**: instance method of <code>[AutomateClient](#AutomateClient)</code>  
**Returns**: <code>Promise</code> - Bluebird Promise object  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>callback</code> | Optional callback. Use promise or callback. |



<a name="ScreenshotsClient"></a>
## ScreenshotsClient
Create and manage Screenshot jobs running under the BrowserStack Screenshots API.

**Kind**: global class  
**Access:** public  
**Version**: v1  

* [ScreenshotsClient](#ScreenshotsClient)
  * [new ScreenshotsClient(options)](#new_ScreenshotsClient_new)
  * [.getBrowsers(callback)](#ScreenshotsClient+getBrowsers) ⇒ <code>Promise</code>
  * [.createJob(options, callback)](#ScreenshotsClient+createJob) ⇒ <code>Promise</code>
  * [.getJob(jobId, callback)](#ScreenshotsClient+getJob) ⇒ <code>Promise</code>

<a name="new_ScreenshotsClient_new"></a>
### new ScreenshotsClient(options)
BrowserStack Screenshots API.
<br/>
Spec: [https://www.browserstack.com/screenshots/api](https://www.browserstack.com/screenshots/api)


| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | Options for ScreenshotsClient. Optional. |
| options.username | <code>string</code> | Username for the BrowserStack account. Optional. If not supplied, `BROWSERSTACK_USERNAME` environment variable is used. |
| options.key | <code>string</code> | API Key for this product subscription. Optional. If not supplied, `BROWSERSTACK_KEY` environment variable is used. |
| options.returnHeaders | <code>boolean</code> | Return the API response headers along with the response. If enabled, the response will be available under the `data` node of the result object. Default: `false`. |
| options.useCache | <code>boolean</code> | Cache the list of browsers returned by the `getBrowsers()` method. Optional. Default: `true`. |
| options.cacheExpiry | <code>number</code> | Time in milliseconds after which the cache expires. Optional. Default: `864e5`. |

<a name="ScreenshotsClient+getBrowsers"></a>
### screenshotsClient.getBrowsers(callback) ⇒ <code>Promise</code>
Fetches all available browsers.

Note that this method may returned cached data. To turn off caching,
please create an instance of this class with `options.useCache = false`.

**Kind**: instance method of <code>[ScreenshotsClient](#ScreenshotsClient)</code>  
**Returns**: <code>Promise</code> - Bluebird Promise object  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>callback</code> | Optional callback. Use promise or callback. |

<a name="ScreenshotsClient+createJob"></a>
### screenshotsClient.createJob(options, callback) ⇒ <code>Promise</code>
Creates a new Screenshots Job.

**Kind**: instance method of <code>[ScreenshotsClient](#ScreenshotsClient)</code>  
**Returns**: <code>Promise</code> - Bluebird Promise object  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | Options for this request. |
| options.url | <code>string</code> | URL of the desired page. |
| options.os | <code>string</code> | OS you want to test. |
| options.os_version | <code>string</code> | OS version you want to test. |
| options.browser | <code>string</code> | Browser you want to test. |
| options.browser_version | <code>string</code> | Browser version you want to test. |
| options.device | <code>string</code> | Device to be used (skip for desktop). |
| options.orientation | <code>string</code> | Required if specifying the screen orientation for the device. Values: portrait, landscape. Default: portrait. |
| options.mac_res | <code>string</code> | Screen resolution for browsers on OSX. Values: 1024x768, 1280x960, 1280x1024, 1600x1200, 1920x1080. |
| options.win_res | <code>string</code> | Screen resolution for browsers on Windows. Values: 1024x768, 1280x1024. |
| options.quality | <code>string</code> | Quality of the screenshot. Values: Original, Compressed. |
| options.local | <code>boolean</code> | Required if the page is local and that a Local Testing connection has been set up. |
| options.wait_time | <code>number</code> | Time to wait (seconds) before taking the screenshot. Values: 2, 5, 10, 15, 20, 60. |
| options.callback_url | <code>string</code> | Publicly accessible URL to be used to send results after processing is complete. |
| callback | <code>callback</code> | Optional callback. Use promise or callback. |

<a name="ScreenshotsClient+getJob"></a>
### screenshotsClient.getJob(jobId, callback) ⇒ <code>Promise</code>
Gets the properties of a Screenshots Job.

**Kind**: instance method of <code>[ScreenshotsClient](#ScreenshotsClient)</code>  
**Returns**: <code>Promise</code> - Bluebird Promise object  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| jobId | <code>string</code> | Job ID for the screenshots job. |
| callback | <code>callback</code> | Optional callback. Use promise or callback. |



* * *

## TODO
- Tests

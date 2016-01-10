
var binaryNamePrefix = 'BrowserStackLocal';


module.exports = {
  binaryNamePrefix: binaryNamePrefix,
  updateEndpoint: {
    hostname: 'www.browserstack.com',
    port: 443,
    path: '/browserstack-local/' + [
      binaryNamePrefix,
      process.platform,
      process.arch
    ].join('-') + '.zip'
  }
};

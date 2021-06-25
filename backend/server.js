require('dotenv').config()
const https = require('https')
const fs = require('fs')
var process = require('process')
require('log-timestamp')
var express = require('express')
const { app, apiServer } = require('./api')

// write PID to file for killing
fs.writeFileSync('.server.pid', process.pid);

var httpServer = undefined;
var httpsServer = undefined;
var httpToHttpsServer = undefined;

async function shutdown() {
  if (httpsServer) {
    console.info(`HTTPS: Terminating servers on ${process.env.DOMAIN}:${process.env.HTTPS_PORT}/*`);
    httpsServer.close();
  }

  if (httpServer) {
    console.info(`HTTP: Terminating servers on ${process.env.DOMAIN}:${process.env.HTTP_PORT}/*`);
    httpServer.close();
  }

  if (httpToHttpsServer) {
    console.info(`HTTP-to-HTTPS: Terminating servers on ${process.env.DOMAIN}:${process.env.HTTP_TO_HTTPS_PORT}/*`);
    httpToHttpsServer.close();
  }

  console.info("Stopping Apollo server");
  await apiServer.stop();

  console.info("Stopped All");
}

process.on('exit', (code) => {
  console.info(`Terminating with exit code ${code}`);
  fs.unlinkSync('.server.pid');
});

process.on('SIGTERM', async() => {
  console.info('Received SIGTERM');
  shutdown().then(() => process.exit(0));
});

if (process.env.CERT_FILE && process.env.KEY_FILE && process.env.HTTPS_PORT) {
  var key = fs.readFileSync(process.env.KEY_FILE);
  var cert = fs.readFileSync(process.env.CERT_FILE);

  httpsServer = https.createServer({
    key: key,
    cert: cert
  }, app);

  httpsServer.listen(
    process.env.HTTPS_PORT, 
    () => {
      console.info(`HTTPS: WebUI server listening on ${process.env.DOMAIN}:${process.env.HTTPS_PORT}`);
      console.info(`HTTPS: Attachments server listening on ${process.env.DOMAIN}:${process.env.HTTPS_PORT}/attachment`);
      console.info(`HTTPS: GraphQL API server listening on ${process.env.DOMAIN}:${process.env.HTTPS_PORT}/api`);
    }
  );
}
else {
  console.warn('Unable to start HTTPS server.')
}

if (process.env.HTTP_PORT) {
  httpServer = app.listen(
    process.env.HTTP_PORT, 
    () => {
      console.info(`HTTP: WebUI server listening on ${process.env.DOMAIN}:${process.env.HTTP_PORT}`);
      console.info(`HTTP: Attachments server listening on ${process.env.DOMAIN}:${process.env.HTTP_PORT}/attachment`);
      console.info(`HTTP: GraphQL API server listening on ${process.env.DOMAIN}:${process.env.HTTP_PORT}/api`);
    }
  );
}
else {
  console.warn('Unable to start HTTP server.')
}

if (process.env.HTTPS_REDIRECT_DOMAIN && process.env.HTTP_TO_HTTPS_PORT) {
  var http_to_https = express();

  // set up a route to redirect http to https
  http_to_https.get('*', function(req, res) {  
    res.redirect('https://' + process.env.HTTPS_REDIRECT_DOMAIN + req.url);
  });

  httpToHttpsServer = http_to_https.listen(
    process.env.HTTP_TO_HTTPS_PORT,
    () => {
      console.info(`HTTP-to-HTTPS: Redirect server listening on ${process.env.DOMAIN}:${process.env.HTTP_TO_HTTPS_PORT}`);
    }
  );
}
else {
  console.warn('Unable to start HTTP-to-HTTPS redirect server');
}

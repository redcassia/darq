require('dotenv').config()
const https = require('https')
const fs = require('fs')
var express = require('express')
var app = require('./api')

if (process.env.CERT_FILE && process.env.KEY_FILE && process.env.HTTPS_PORT) {
  var key = fs.readFileSync(process.env.KEY_FILE);
  var cert = fs.readFileSync(process.env.CERT_FILE);

  var https_server = https.createServer({
    key: key,
    cert: cert
  }, app);

  https_server.listen(
    process.env.HTTPS_PORT, 
    () => {
      console.log(`HTTPS: WebUI server listening on ${process.env.DOMAIN}:${process.env.HTTPS_PORT}`);
      console.log(`HTTPS: Attachments server listening on ${process.env.DOMAIN}:${process.env.HTTPS_PORT}/attachment`);
      console.log(`HTTPS: GraphQL API server listening on ${process.env.DOMAIN}:${process.env.HTTPS_PORT}/api`);
    }
  );
}
else {
  console.log('WARNING: Unable to start HTTPS server.')
}

if (process.env.HTTP_PORT) {
  app.listen(
    process.env.HTTP_PORT, 
    () => {
      console.log(`HTTP: WebUI server listening on ${process.env.DOMAIN}:${process.env.HTTP_PORT}`);
      console.log(`HTTP: Attachments server listening on ${process.env.DOMAIN}:${process.env.HTTP_PORT}/attachment`);
      console.log(`HTTP: GraphQL API server listening on ${process.env.DOMAIN}:${process.env.HTTP_PORT}/api`);
    }
  );
}
else {
  console.log('WARNING: Unable to start HTTP server.')
}

if (process.env.HTTPS_REDIRECT_DOMAIN && process.env.HTTP_TO_HTTPS_PORT) {
  var http_to_https = express();

  // set up a route to redirect http to https
  http_to_https.get('*', function(req, res) {  
    res.redirect('https://' + process.env.HTTPS_REDIRECT_DOMAIN + req.url);
  });

  http_to_https.listen(process.env.HTTP_TO_HTTPS_PORT);
}

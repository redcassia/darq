require('dotenv').config()
const https = require('https')
const fs = require('fs')
var express = require('express')
var path = require('path')
var app = require('./api')

app.use('/', express.static(path.join(__dirname, '..', 'webui')));
app.use('/admin', express.static(path.join(__dirname, '..', 'webui', 'admin.html')));

if (process.env.CERT_FILE) {
    var key = fs.readFileSync(process.env.KEY_FILE);
    var cert = fs.readFileSync(process.env.CERT_FILE);

    var https_server = https.createServer({
        key: key,
        cert: cert
    }, app);

    https_server.listen(
        process.env.HTTPS_PORT, 
        () => {
            console.log('HTTPS: WebUI server started on localhost:' + process.env.HTTPS_PORT);
            console.log('HTTPS: Attachments server started on localhost:' + process.env.HTTPS_PORT + '/attachment');
            console.log('HTTPS: GraphQL API server started on localhost:' + process.env.HTTPS_PORT + '/api');
        }
    );
}
else {
    console.log('WARNING: no SSL certificate found! Cannot start HTTPS server.')
}

app.listen(
    process.env.HTTP_PORT, 
    () => {
        console.log('HTTP: WebUI server started on localhost:' + process.env.HTTP_PORT);
        console.log('HTTP: Attachments server started on localhost:' + process.env.HTTP_PORT + '/attachment');
        console.log('HTTP: GraphQL API server started on localhost:' + process.env.HTTP_PORT + '/api');
    }
);

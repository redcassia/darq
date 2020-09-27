require('dotenv').config()
var api_app = require('./api')
var webui_app = require('./webui')
const https = require('https')
const fs = require('fs')

if (process.env.CERT_FILE) {
    var key = fs.readFileSync(process.env.KEY_FILE);
    var cert = fs.readFileSync(process.env.CERT_FILE);

    var api_server = https.createServer({
        key: key,
        cert: cert
    }, api_app);

    api_server.listen(
        process.env.API_PORT, 
        () => console.log('GraphQL API server started on localhost:' + process.env.API_PORT + '/api')
    );

    var webui_server = https.createServer({
        key: key,
        cert: cert
    }, webui_app);

    webui_server.listen(
        process.env.WEBUI_PORT, 
        () => console.log('WebUI server started on localhost:' + process.env.WEBUI_PORT)
    );
}
else {
    console.log('WARNING: no SSL certificate found!')
    api_app.listen(
        process.env.API_PORT, 
        () => console.log('GraphQL API server started on localhost:' + process.env.API_PORT + '/api')
    );

    webui_app.listen(
        process.env.WEBUI_PORT,
        () => console.log('WebUI server started on localhost:' + process.env.WEBUI_PORT)
    );
}

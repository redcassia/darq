require('dotenv').config()
var api_app = require('./api')
var webui_app = require('./webui')
const https = require('https')
const fs = require('fs')

api_app.listen(
    process.env.API_PORT, 
    () => console.log('GraphQL API server started on localhost:' + process.env.API_PORT + '/api')
);

if (process.env.CERT_FILE > 0) {
    https.createServer({
        key: fs.readFileSync(process.env.KEY_FILE),
        cert: fs.readFileSync(process.env.CERT_FILE)
    }).listen(process.env.WEBUI_PORT);
    console.log('WebUI server started on localhost:' + process.env.WEBUI_PORT);
}
else {
    console.log('WARNING: no SSL certificate found!')
    webui_app.listen(
        process.env.WEBUI_PORT,
        () => console.log('WebUI server started on localhost:' + process.env.WEBUI_PORT)
    );
}

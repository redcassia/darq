require('dotenv').config()
var api_app = require('./api')
var webui_app = require('./webui')

api_app.listen(
    process.env.API_PORT, 
    () => console.log('GraphQL API server started on localhost:' + process.env.API_PORT + '/api')
);

webui_app.listen(
    process.env.WEBUI_PORT,
    () => console.log('WebUI server started on localhost:' + process.env.WEBUI_PORT)
);

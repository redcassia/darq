var api = require('./api')
var webui = require('./webui')

api.app.listen(7070, () => console.log('API server started on localhost:7070/api'));

webui.app.listen(3000, () => console.log('WebUI server started on localhost:3000'))

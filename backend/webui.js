var express = require('express');
var path = require('path')

const app = express();
app.use('/', express.static(path.join(__dirname, '..', 'webui')));
app.use('/admin', express.static(path.join(__dirname, '..', 'webui', 'admin.html')));

module.exports = app

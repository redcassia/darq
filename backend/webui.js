var express = require('express');
var path = require('path')

exports.app = express();
exports.app.use('/', express.static(path.join(__dirname, 'webui')))

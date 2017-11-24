var express = require('express');
var app = express();

app.use('/', require('./stockview'))

var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("App listening at http://%s:%s", host, port);
});

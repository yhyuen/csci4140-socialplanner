var express = require('express');
var router = require('./route');


var app = express();
app.use('/',  router);


var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Social Planner is listening at http://%s:%s", host, port)
})
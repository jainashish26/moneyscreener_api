var express = require('express');
var fs = require('fs');
var path = require('path');

var app = express();

var logger = function(req, res, next){
  console.log('Logging...');
  next();
}

app.use(logger);

//Set static path for source data
app.use(express.static(path.join(__dirname,'public')));

app.get('/:id', function (req, res) {
   //Read stock market data: stocksdata.csv
   fs.readFile( __dirname + "/public/" + "aboutmarkets.csv", 'utf8', function (err, data) {
     var allTextLines = data.split(/\r\n|\n/);
     var headers = allTextLines[0].split(',');
     var lines = [];
     var flag = false;
     for (var i=1; i<allTextLines.length; i++) {
         var stockdata = allTextLines[i].split(',');
         if (stockdata.length == headers.length) {
            if (stockdata[0] == req.params.id || stockdata[1] == req.params.id ) {
              flag = true;
              console.log('Data available for ISIN : ' + stockdata[0] + ' and BSEID: ' +stockdata[1]);
              res.send(allTextLines[i]);
              return;
            }
         }
     }
     if (flag == false) {
       console.log('Data not available for ISIN : ' + stockdata[0] + ' and BSEID: ' +stockdata[1]);
       res.send('Data Unavailable');
       return;
     }
   });
});

var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("App listening at http://%s:%s", host, port);
});

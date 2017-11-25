var express = require('express')
var router = express.Router()
var fs = require('fs');
var path = require('path');

var app = express();

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  //console.log('Time: ', Date.now())
  next();
});

//Set static path for source data
app.use(express.static(path.join(__dirname,'public')));

// define the route for http://localhost:8080/stockinfo?stockid=INE528G01027&field=piotroski
router.get('/stockinfo', function (req, res) {
   //Read stock market data: stocksdata.csv
   fs.readFile( __dirname + "/public/" + "stocksdata.csv", 'utf8', function (err, data) {
     var allTextLines = data.split(/\r\n|\n/);
     var headers = allTextLines[0].split(',');
     var lines = [];
     var flag = false;
     var fieldnum = -1;
     var jsonResponse = [];
     for (var i=0; i<headers.length; i++) {
       //console.log(headers[i].toLowerCase() + ' == ' + req.query.field.toLowerCase());
       if (headers[i].toLowerCase() == req.query.field.toLowerCase()) {
         fieldnum = i;
         break;
       }
     }

     if (fieldnum != -1){
       for (var i=1; i<allTextLines.length; i++) {
           var stockdata = allTextLines[i].split(',');
           if (stockdata.length == headers.length) {
              if (stockdata[0] == req.query.stockid || stockdata[1] == req.query.stockid || stockdata[2] == req.query.stockid) {
                flag = true;
                console.log('Data available for ISIN : ' + stockdata[0] + ' and BSEID: ' +stockdata[1]);
                jsonResponse.push({"text" : stockdata[fieldnum]});
                res.send(jsonResponse);
                break;
              }
           }
       }
     }

     if (flag == false) {
       console.log('Data not available for ID : ' + req.query.stockid + ' and field: ' +  req.query.field);
       res.send('Data Unavailable');
     }
   });
});

// Define the http://localhost:8080/INE528G01027
router.get('/:id', function (req, res, next) {
   //Read stock market data: stocksdata.csv
   if (req.url == '/stockinfo' || req.url == '/favicon.ico') return next();
   fs.readFile( __dirname + "/public/" + "stocksdata.csv", 'utf8', function (err, data) {
     var allTextLines = data.split(/\r\n|\n/);
     var headers = allTextLines[0].split(',');
     var lines = [];
     var flag = false;
     for (var i=1; i<allTextLines.length; i++) {
         var stockdata = allTextLines[i].split(',');
         if (stockdata.length == headers.length) {
            if (stockdata[0] == req.params.id || stockdata[1] == req.params.id || stockdata[2] == req.params.id ) {
              flag = true;
              console.log('Data available for ISIN -> ' + stockdata[0] + ' and BSEID -> ' +stockdata[1]);
              res.send(allTextLines[i]);
              break;
            }
         }
     }
     if (flag == false) {
       console.log('Data not available for StockID -> ' + req.params.id);
       res.send('Data Unavailable');
     }
   });
});

module.exports = router

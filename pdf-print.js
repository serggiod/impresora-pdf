var libExpss = require('express');
var libPath  = require('path');
var libLogg  = require('morgan');
var libBody  = require('body-parser');
var router   = require('./routes/router');
var pdfPrint = libExpss();

pdfPrint.use(libLogg('dev'));
pdfPrint.use(libBody.text());
pdfPrint.use(function(rq, rs, n) {
  rs.header("Access-Control-Allow-Origin", "*");
  rs.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  n();
});
pdfPrint.use('/',router);

module.exports = pdfPrint;
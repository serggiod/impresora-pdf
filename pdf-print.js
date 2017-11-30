var libExpss = require('express');
var libPath  = require('path');
var libLogg  = require('morgan');
var router   = require('./routes/router');
var pdfPrint = libExpss();

pdfPrint.use(function(rq, rs, n) {
  let body = [];
  rq
    .on('data',(c)=>{
      body.push(c);
    })
    .on('end',()=>{
      body = Buffer.concat(body).toString();
      rq.body = body;
      n();
    });
});
pdfPrint.use(libLogg('dev'));
pdfPrint.use(function(rq, rs, n) {
  rs.header("Access-Control-Allow-Origin", "*");
  rs.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
  n();
});
pdfPrint.use('/',router);

module.exports = pdfPrint;
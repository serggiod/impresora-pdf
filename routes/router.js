var exprss = require('express');
var router = exprss.Router();
var uniqid = require('uniqid');
var fileys = require('fs');
var htmlPdf= require('html-pdf');
var libPath= require('path');

router.get('/', (rq, rs, n)=>{
  rs.send('Hola mundo desde GET');
});

router.get('/download/:pdffile',(rq,rs,n)=>{
  file = libPath.join(__dirname,'../download/' + rq.params.pdffile);
  rs.sendFile(file);
});

router.post('/', (rq, rs, n)=>{
  json = {};
  file = 'download/' + uniqid() + '.pdf';
  html = rq.body;
  htmlPdf
    .create(html,{formar:'A4'})
    .toFile(libPath.join(__dirname,'/../',file),function(e,r){

      if(e===null) json = {result:true,rows:'http:\/\/' + rq.headers.host + '/' +file};
      else json = {result:false,rows:'No se pudo crear el archivo pdf.'};
      rs.send(json);

    });
});

module.exports = router;
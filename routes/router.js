var exprss = require('express');
var router = exprss.Router();
var uniqid = require('uniqid');
var fileSys = require('fs');
var htmlPdf= require('html-pdf');
var libPath= require('path');

router.get('/', (rq, rs, n)=>{
  rs.send('Impresora PDF');
});

router.get('/download/:pdffile/:pdfname?',(rq,rs,n)=>{
  file = libPath.join(__dirname,'../download/' + rq.params.pdffile);
  name = rq.params.pdfname;
  if(!name) name = 'nombre_del_archivo';
  rs.set('Content-Type', 'application/force-download'); 
  rs.set('Content-Type','application/download');
  rs.set('Content-Disposition', 'attachment; filename=' + name + '.pdf');
  rs.set('Content-Transfer-Encoding', 'binary');
  rs.sendFile(file,null,(e)=>{
    if(e){
      rs.status(404).end();
      console.log('No se ha descargado el archivo ' + file + '.');
    }
    /*if(!e) fileSys.unlink(file,()=>{
      console.log('Se ha descargado el archivo ' + file + '.');  
    });*/
  });
});

router.post('/', (rq, rs, n)=>{
  file = 'download/' + uniqid();
  html = rq.body;
  if(typeof(html)!='string'){
    json = {result:false,rows:'No se pudo crear el archivo pdf.'};
    rs.send(json);
  }
  if(typeof(html)==='string'){
    config = {
      format: 'A4',
      orientation: 'portrait',
      width: '21cm',
      height: '29.7cm'
    };
    htmlPdf
    .create(html,config)
    .toFile(libPath.join(__dirname,'/../',file),(e,r)=>{
      if(!e) json = {result:true,rows:'http:\/\/' + rq.headers.host + '/' + file};
      if(e)  json = {result:false,rows:'No se pudo crear el archivo pdf.'};
      rs.send(json);
    });
  }
});



module.exports = router;
var exprss  = require('express');
var router  = exprss.Router();
var uniqid  = require('uniqid');
var fileSys = require('fs');
var htmlPdf = require('html-pdf');
var libPath = require('path');

router.get('/', (rq, rs, n)=>{
  rs.send('Impresora PDF');
});

router.get('/download/:pdffile/:pdfname?',(rq,rs,n)=>{
  file = libPath.join(__dirname,'../download/' + rq.params.pdffile + '.pdf');
  name = rq.params.pdfname;
  if(!name) name = 'file-name.pdf';
  rs.set('Content-Type', 'application/force-download'); 
  rs.set('Content-Type','application/download');
  rs.set('Content-Disposition', 'attachment; filename=' + name);
  rs.set('Content-Transfer-Encoding', 'binary');
  rs.sendFile(file,null,(e)=>{
    if(e){
      rs.status(404).end();
      console.log('No se ha descargado el archivo ' + file + '.');
    }
    if(!e) fileSys.unlink(file,()=>{
      console.log('Se ha descargado el archivo ' + file + '.');  
    });
  });
});

router.post('/', (rq, rs, n)=>{
  let file = 'download/pdf' + uniqid();
  let html = rq.body;
  if(typeof(html)!='string'){
    json = {result:false,rows:'No se pudo crear el archivo pdf.'};
    rs.send(json);
  }
  if(typeof(html)==='string'){
    config = {
      format: 'A4',
      orientation: 'portrait',
      width: '21cm',
      height: '29.7cm',
      border: {
        top:   '0.8cm',
        right: '0.8cm',
        bottom:'0.8cm',
        left:  '0.8cm'
      },
    };
    htmlPdf
    .create(html,config)
    .toFile(libPath.join(__dirname,'/../',file + '.pdf'),(e,r)=>{
      if(e===null) json = {result:true,rows:'http:\/\/' + rq.headers.host + '/' + file + '/file-name.pdf'};
      else json = {result:false,rows:'No se pudo crear el archivo pdf.'};
      rs.send(json);
    });
  }
});

module.exports = router;
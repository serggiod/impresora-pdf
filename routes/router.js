var exprss  = require('express');
var router  = exprss.Router();
var uniqid  = require('uniqid');
var fileSys = require('fs');
var htmlPdf = require('html-pdf');
var libPath = require('path');

router.post('/', (rq, rs, n)=>{
  let file = libPath.join(__dirname,'/../','download/' + uniqid() + '.pdf');
  let html = rq.body;
  let user = rq.headers['Pragma-User'];
  let pass = rq.headers['Pragma-Pass'];

  if(user === '' && pass=== ''){
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
      .toFile(file,(e,r)=>{

        if(e===null){
          rs.set('Content-Type', 'application/force-download'); 
          rs.set('Content-Type', 'application/download');
          rs.set('Content-Disposition', 'attachment; filename=file.pdf');
          rs.set('Content-Transfer-Encoding', 'binary');
          rs.sendFile(file,null,(e)=>{
            if(!e) fileSys.unlink(file,()=>{
              console.log('Se ha descargado el archivo ' + file + '.');  
            });
            if(e){
              rs.status(404).end();
              console.log('No se ha descargado el archivo ' + file + '.');
            }
          });
        } 
        else {
          rs.status(404).end();
          console.log('No se ha descargado el archivo ' + file + '.');
        }
      
      });
    }
  } else rs.status(404).end();
});

router.all('/', (rq, rs, n)=>{
  rs.status(404).end();
});

module.exports = router;
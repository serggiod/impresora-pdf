var exprss  = require('express');
var router  = exprss.Router();
var uniqid  = require('uniqid');
var fileSys = require('fs');
var htmlPdf = require('html-pdf');
var libPath = require('path');
var login   = require('passwd');

router.post('/', (rq, rs, n)=>{
  let html = rq.body;
  let user = rq.headers['pragma-user'];
  let pass = rq.headers['pragma-pass'];
  
  if(user === login.user && pass === login.pass){
    if(typeof(html)!='string') rs.status(404).end();
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
        .toBuffer((e,b)=>{
          if(e===null) rs.send(b.toString('base64')).end();
          else rs.status(404).end();
        });
    }
  } else rs.status(404).end();
});

router.all('/',(rq, rs, n)=>{
  rs.status(404).end();
});

module.exports = router;

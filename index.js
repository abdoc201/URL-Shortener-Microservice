require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const req = require('express/lib/request');
const app = express();
const dns = require('dns');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

const numGenerator = (req)=>{
    let x = req.body.url;
    let t = 0;
    for(let i=0;i<x.length;i++){
      t += x.charCodeAt();
    }
    return t;
}

app.post('/api/shorturl',bodyParser.urlencoded({extended: false}),(req,res)=>{
  if(/^https?:\/\/www[.].+[.]com.*$/.test(req.body.url)){
    dns.lookup(req.body.url.match(/[.](.+$)/)[1],(error,address,family)=>{
        if(error){
          console.log(error)
          res.json({
            error: 'invalid url'
          })
        }
        else {
          console.log(`The ip address is ${address} and the ip version is ${family}`)
          res.json({
            original_url: req.body.url ,
            short_url: numGenerator(req)
          })
        }
    });
}
})


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

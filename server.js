const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname + '/client')));

app.use((req, res, next) => {
    res.show = (name) => {
      res.sendFile(path.join(__dirname + `/client/${name}`));
    };
    next();
  });

app.get('/', function (req, res) {
    res.show('index.html')
  })
   
  app.listen(8000);
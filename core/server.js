var express = require("express");
var app = express();

var https = require('https');

var fs = require('fs');

var router = express.Router();


const cors = require('cors');

const multer = require("multer");

app.use(multer({dest: './public/uploads/'}).single('file'));

app.use(cors());

const bodyParser = require('body-parser');
const { request } = require("http");
const { response } = require("express");
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

const sqlite = require('sqlite3').verbose();
const db = new sqlite.Database('cityhall.db');

var zh = false;

app.post('/message', (req, res) => {
    console.log(req.body);
    var v = req.body;

    db.serialize(() => {
        const stmt = db.prepare("INSERT INTO TMessage (sBody,sUrl) VALUES (?,?)");
        stmt.run([v.s,v.u]);
        
        stmt.finalize();
      });
    res.send({ message: "OK" });
    zh = true;
    console.log("情報が入りました。");
    setTimeout(function(){
        zh = false;
    },1*60*1000);
});

app.get("/", (request, response) => {
    response.status(200).send({ message: "OK" });
});

app.use(express.static('public'));
app.post("/information",(req,res) => {
    var v;

    v = req.body;
    console.log(v);
    console.log(req.file);

    db.serialize(() => {
      const stmt = db.prepare("INSERT INTO information (title,text,image) VALUES (?,?,?)");
      if (req.file != null){
        stmt.run([v.title,v.text,req.file.filename]);
      }
      else{
        stmt.run([v.title,v.text,null]);
      }
      stmt.finalize();
    });
    res.send({message: "OK"});
});

app.get("/information", (req,res) => {
    var r = [];
    db.serialize(() => {
        db.each("SELECT * FROM information", (error, row) => {
          if(error) {
            console.error('Error!', error);
            return;
          }
          
          r.push(row);
        });
      });
      setTimeout(function(){
        res.status(200).send(r);
      },100);
});

app.get("/message", (request, response) => {
    var r = [];
    db.serialize(() => {
        db.each("SELECT * FROM TMessage order by dtCreated desc", (error, row) => {
          if(error) {
            console.error('Error!', error);
            return;
          }
          
          r.push(row);
        });
      });
      setTimeout(function(){
        response.status(200).send(r);
      },100);
});


var ssl_server_key = 'server_key.pem';
var ssl_server_crt = 'server_crt.pem';

var options = {
  key: fs.readFileSync(ssl_server_key),
  cert: fs.readFileSync(ssl_server_crt)
};

https.createServer(options, app).listen(8080);
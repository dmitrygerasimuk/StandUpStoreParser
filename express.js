// jshint esversion: 6

var express = require('express');
var app = express();
const ip = process.env.IP || 'localhost';
const port = process.env.PORT || 8080;
var pjson = require('./package.json');


const CHANNEL = "thatisnotfunny";

const Murl = `https://telegram.me/${CHANNEL}`




var MongoClient = require('mongodb').MongoClient;
var idArray = [];
const COLLECTION = 'timeChecked';
//const COLLECTION = 'hey';

const url = 'mongodb://heroku_hgmz9f00:lbig8lpkh4egih77ct3uh7v0ci@ds047958.mlab.com:47958/heroku_hgmz9f00';


app.get('/', function (req, res) {



    MongoClient.connect(url, function(err, client) {
        let db = client.db('heroku_hgmz9f00')
        let songs = db.collection(COLLECTION);
        var emptyBase;
        
        
        
        songs.find().toArray(function(err,item) {
            
            if (item.length === 0 ) {
                console.log('Base is empty');
                
            } else 
            {
                console.log('Base is populated');
              
            }
        
        });
        
        songs.find().each(function(err,item) {
            
            if (item != null) {
            
             idArray = item.time;
              //console.log(item.id);
            }
        
        });
         
        
        client.close(function(err) {
            
            let output = `This is StandUp bot on <a href = '${Murl}'>${Murl}</a>`;
            output += `<br>Last update: ${idArray}`;
            output += `<br> Version: ${pjson.version}`;

            res.send(output);
            
        
        });
        }); 
        
       

});


  
app.listen(port, function () {
    console.log(`Example app listening on port ${port}`);
  });
  

// jshint esversion: 6

var express = require('express');
var app = express();
pug = require('pug');
const ip = process.env.IP || 'localhost';
const port = process.env.PORT || 8080;
var pjson = require('./package.json');
path = require('path')// allows path combinations https://www.npmjs.com/package/path

const CHANNEL = "thatisnotfunny";

const Murl = `https://telegram.me/${CHANNEL}`




var MongoClient = require('mongodb').MongoClient;
var idArray = [];
const COLLECTION = 'timeChecked';
//const COLLECTION = 'hey';

const url = 'mongodb://heroku_hgmz9f00:lbig8lpkh4egih77ct3uh7v0ci@ds047958.mlab.com:47958/heroku_hgmz9f00';

app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, 'views')); // sets up view directory
app.set('view engine', 'pug'); // sets view engine to use pug


app.get('/', function (req, res) {



    MongoClient.connect(url,   {useUnifiedTopology: true}, function(err, client) {
        let db = client.db('heroku_hgmz9f00')
        let songs = db.collection(COLLECTION);
        let myEvents = db.collection('standup-events');
        let myVault=[];
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
        myEvents.find().each(function(err,item) {
            
            if (item != null) {
            
             myVault.push(item);
              //console.log(item.id);
            }
        
        });


         
        
        client.close(function(err) {
            
            let welcome = `This is StandUp bot on ${Murl}`;
 

            myObj =
            [ 
                {
                id: 'asadasd',
                name: 'asdasda',
                value: 'GREAT'
            
            },
        {
            id: 'asada2222sd',
            name: 'asd3333asda',
            value: 'GR333EAT'
        

        } ];


        

            res.render('index', { 
                             title: 'Hey',
                            Murl: Murl,
                             welcome: welcome,
                             lastupdate: idArray,
                             version: pjson.version, 
                             obj:  myVault
                            
                            });
    
            
        
        });
        }); 
        
       

});



app.listen(port, function () {
    console.log(`Example app listening on port ${port}`);
  });
  

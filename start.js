const http = require('http')
const ip = process.env.IP || 'localhost'
const port = process.env.PORT || 8080
const CHANNEL = "thatisnotfunny";

const Murl = `https://telegram.me/${CHANNEL}`

var MongoClient = require('mongodb').MongoClient;
var idArray = [];
const COLLECTION = 'timeChecked';
//const COLLECTION = 'hey';

const url = 'mongodb://heroku_hgmz9f00:lbig8lpkh4egih77ct3uh7v0ci@ds047958.mlab.com:47958/heroku_hgmz9f00';


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
   
    let server = http.createServer((request, response) => {
        response.writeHead(200, {'Content-Type': 'text/html'})
        response.end(`This is StandUp bot on <a href = '${Murl}'>${Murl}</a>`)
      })
      server.listen(port)
      console.log(`Server listening at http://${ip}:${port}/`)

});
}); 



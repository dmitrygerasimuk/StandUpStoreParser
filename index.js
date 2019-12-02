// jshint esversion: 6

const LOGO = `
╔═╗┌┬┐┌─┐┌┐┌┌┬┐╦ ╦┌─┐
╚═╗ │ ├─┤│││ ││║ ║├─┘
╚═╝ ┴ ┴ ┴┘└┘─┴┘╚═╝┴  
      ╔═╗┌┬┐┌─┐┬─┐┌─┐      
      ╚═╗ │ │ │├┬┘├┤       
      ╚═╝ ┴ └─┘┴└─└─┘      (c) hello@dmitrygerasimuk.com
   ╔═╗┌─┐┬─┐┌─┐┌─┐┬─┐          nov, 2019
   ╠═╝├─┤├┬┘└─┐├┤ ├┬┘   
   ╩  ┴ ┴┴└─└─┘└─┘┴└─             
 `;

process.env.NTBA_FIX_350 = '1';
var MongoClient = require('mongodb').MongoClient;
const COLLECTION = 'standupparser-base2';
const url = 'mongodb://heroku_hgmz9f00:lbig8lpkh4egih77ct3uh7v0ci@ds047958.mlab.com:47958/heroku_hgmz9f00';
var clc = require("cli-color");
var idArray=[];
const TOKEN = "960806477:AAHDFrxvFaG4KhPUkF9AUXiRUUi2lae_Mb4";
const CHANNEL = "thatisnotfunny";
const getUrls = require('get-urls');
const Telegram = require('node-telegram-bot-api')
const osmosis = require('osmosis');
const _ = require("underscore");
const tg = new Telegram(TOKEN);
const UPDATE_TIMEOUT = 9000;


var error = clc.red.bold;
var warn = clc.yellow;
var notice = clc.blue;
var standObject = {};
let myArray = [];
let Vault = [];
let idList = [];
let _saveID;
let _counter=0;
const standUpParser = {

    savedArray: [],
    savedIdList: [],
};

lastCheck = () => {
    
    MongoClient.connect(url,  {useUnifiedTopology: true}, function(err, myclient) {
        var d = new Date();
        var myDate=d.toString();
        let db = myclient.db('heroku_hgmz9f00')
        let timeBase = db.collection('timeChecked');
        timeBase.find().each(function(err,item) {
        
            if (item != null) {
            
            console.log(`Last checked:   `, notice(item.time)); 
              //console.log(item.id);
            }});

   
            
        
        //songs.insertOne({time:myDate});
        timeBase.drop();
        timeBase.insertOne({time:myDate});
        myclient.close(function(err,date) {
            if (err) {
                console.log('Error ',err);
            } else {

            
            console.log(`Added this time: ${myDate} to the base`);
            }
            });


});

}
checkBase = (idList,_idList) => {
    //console.log(idList);
    console.log('Checking...');

    if (!_.isEmpty(thisdifference(idList,_idList))) {

        
        console.log(thisdifference(idList,_idList));
        printNewEvent(thisdifference(idList,_idList),myArray);


        } else {
            console.log(notice('Nothing changed'));
        }
        lastCheck();
}

findInsideDB = (idlist) => {

};

insertNewId = (id) => {
    MongoClient.connect(url,   {useUnifiedTopology: true}, function(err, client) {
        let db = client.db('heroku_hgmz9f00')
        let songs = db.collection(COLLECTION);
        songs.insertOne({id:id});
        client.close(function(err) {
            console.log(`Added id: ${id} to the base`);

            });


});
};

updatesBase = (updates) => {
   
    MongoClient.connect(url,   {useUnifiedTopology: true}, function(err, client) {
        let db = client.db('heroku_hgmz9f00')
        let songs = db.collection('lastupdate-events');
        songs.drop();
        updates.forEach(element => {
            songs.insertOne(element);
            
        });
        client.close(function(err) {
        console.log('Populated base');
        });

});

};

vaultBase = (Vault) => {

    MongoClient.connect(url,   {useUnifiedTopology: true}, function(err, client) {
        let db = client.db('heroku_hgmz9f00')
        let songs = db.collection('standup-events');
        songs.drop();
        Vault.forEach(element => {
            songs.insertOne(element);
            
        });
        client.close(function(err) {
        console.log('Populated base');
        });

});
};

populateBase = (idList) => {
    MongoClient.connect(url,   {useUnifiedTopology: true}, function(err, client) {
        let db = client.db('heroku_hgmz9f00')
        let songs = db.collection(COLLECTION);
        idList.forEach(element => {
            songs.insertOne({id: element});
            
        });
        client.close(function(err) {
        console.log('Populated base');
        });

});

};

getIdfromDB = (idList,myArray) => {



MongoClient.connect(url,   {useUnifiedTopology: true}, function(err, client) {
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
        
         idArray.push(item.id); 
          //console.log(item.id);
        }

    });

    
    

    //noinspection JSDeprecatedSymbols
    /*
    songs.find().each(function(err, item) {

    console.log(item.length);
     if (item != null) {
          console.log(item.id); 
        }

    });

    */

    client.close(function(err) {
        if (idArray.length ===0 ) {
            console.log('No base');
            populateBase(idList);
            return idArray;
        } else { 
           // console.log(idArray);
           console.log('Yes base');
            checkBase(idList,idArray);
            return idArray;
        }
        

    });
}); 
};


function thisdifference(a1, a2) {
    var result = [];
    for (var i = 0; i < a1.length; i++) {
      if (a2.indexOf(a1[i]) === -1) {
        result.push(a1[i]);
      }
    }
    return result;
  }

//Array.prototype.diff = function(arr2) { return this.filter(x => arr2.includes(x)); }
Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};


sendMessage = (msg,url) => {

    console.log(`Posting telegram ${url}`);
    // tg.sendMessage('@' + CHANNEL, strURL);
    //tg.sendMessage('@'+CHANNEL,'Update');
     tg.sendPhoto('@' + CHANNEL, url, { caption: msg })
     .catch((error) => {
        console.log(error.code);  // => 'ETELEGRAM'
        console.log(error.response.body); // => { ok: false, error_code: 400, description: 'Bad Request: chat not found' }
        tg.sendMessage('@' + CHANNEL,msg+url);
    });
     
     



};

printNewEvent = (idArray,eArray) => {



console.log(eArray.length-1);

    for (var i =0; i<=idArray.length-1; i++) {
        for (var j=0; j<=eArray.length-1; j++) {

            if (eArray[j][0] === idArray[i]) {
                
                console.log(eArray[j][0]); // id
                console.log(eArray[j][1]); // date
                console.log(eArray[j][2]); // seats 
                console.log(eArray[j][3]); // price
                console.log(eArray[j][4]); // picture
                
                msg = `${eArray[j][1]}, мест:${eArray[j][2]}, цена:${eArray[j][3]}. `;
                var strURL = getUrls(eArray[j][4]).values().next().value;
                strURL = strURL.substring(0, strURL.length-3);
                insertNewId(eArray[j][0]);
                sendMessage(msg,strURL);

                
               /*

                console.log(`Posting telegram ${strURL}`);
               // tg.sendMessage('@' + CHANNEL, strURL);
                tg.sendPhoto('@' + CHANNEL, strURL, { caption: `${eArray[j][1]}, мест:${eArray[j][2]}, цена:${eArray[j][3]}. https://standupstore.ru/` });
                tg.sendMessage('@' + CHANNEL,`${eArray[j][1]}, мест:${eArray[j][2]}, цена:${eArray[j][3]}. https://standupstore.ru/`);
               */

            }
        }
        
        
        
    }
 

  
  

    };

    
doThePost = (array) => {
    max=array.length-1;
    
    for (i=max; i>=0; i--) {

    
    console.log(`id:        ${array[i][0]}`);
    console.log(`дата:      ${array[i][1]}`);
    console.log(`мест:      ${array[i][2]}`);
    console.log(`цена:      ${array[i][3]}`);
    console.log(`картинка:  ${array[i][4]}`);

    }
    

  
   
    
    
}


function checkUpdates(array) {
    
    let firstID = array[0][0];
    let len=array.length-1;
    let lastID = array[len][0];
    console.log(`First ID: ${firstID}, Last ID: ${lastID}, Length: ${len}`);
    if (!standUpParser.savedArray[0]) {
        console.log('No saved array');
        standUpParser.savedArray = array.slice(0);
        standUpParser.savedIdList = idList.slice(0);
        //console.log( standUpParser.savedIdList);


    } else {
        console.log('Saved array is present');
        let _firstID = standUpParser.savedArray[0][0];
        let _len=standUpParser.savedArray.length-1;
        let _lastID = standUpParser.savedArray[len][0];
        if (_firstID === firstID) { console.log('First ID equal'); };
        if (_len === len) { console.log('Len eq');};
        if (_lastID === lastID) { console.log('last id equal');};


       
        //console.log( idList.diff(standUpParser.savedIdList));
        //console.log(_(idList).difference(standUpParser.savedIdList));
        //console.log(_.difference(idList, standUpParser.savedIdList));
       // console.log(_.difference(idList,standUpParser.savedIdList));
        if (!_.isEmpty(thisdifference(idList,standUpParser.savedIdList))) {

        
        console.log(thisdifference(idList,standUpParser.savedIdList));
        
        printNewEvent(thisdifference(idList,standUpParser.savedIdList),array);

        }


        
        standUpParser.savedIdList = idList.slice(0);
       // console.log( idList);
        


        //console.log(idList.diff(standUpParser.savedIdList));

      
        
    }


}

 function storeValues(array) { 
     
    let myID=array[0][0];

    

    if (_saveID === myID) {
        
        console.log('Nothing changed');
        


    } else {
        
        if (_saveID) {
            console.log('Update found, posting');
            doThePost(array);
        } else {

        
        console.log('ID is new, update');
        doThePost(array);
        
        }
        _saveID = myID;

    }

    console.log(`Last known id: ${array[0][0]}`);

    checkUpdates(array);

 }
 

function niceParse(data) {


    var myObject = {
        id: data.id[1],
        date:data.date[1],
        seats:data.seats[1],
        cost:data.cost[1],
        img:data.img[1],


    };
    Vault.push(myObject);
    myArray.push([data.id[1],data.date[1],data.seats[1],data.cost[1],data.img[1]]);
    idList.push(data.id[1]);



 };


runParser = () => {


osmosis
    .get('https://standupstore.ru')
    //.set({'related': ['.infiniti-contant']})
    .paginate('.inf-next-link > a', 20)
    .find('.js-product')

    .set({'id': ['a[href]@data-id'],
          'date': ['a[href]@data-date'],
          'seats' : ['a[href]@data-seats'],
          'cost' : ['a[href]@data-cost'],
          'img': ['.t-bgimg@style']})
          
    


    .data(function(data) {
       
       niceParse(data);

      


    }).done(function(){
        
        
        //console.log(myArray);
        // i have myArray
        // i have idList


        console.log(myArray.length-1);
        
        vaultBase(Vault);
        
        
        // get old ID from base
        // find new ID
        // cal print with new ID
       
        getIdfromDB(idList,myArray);

        
       

        


    });


 
 
};



    
console.log(clc.red(LOGO));
    runParser();
    
    

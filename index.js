// jshint: es6
process.env.NTBA_FIX_350 = '1';
const fs = require('fs');

const TOKEN = "960806477:AAHDFrxvFaG4KhPUkF9AUXiRUUi2lae_Mb4";
const CHANNEL = "thatisnotfunny";
const getUrls = require('get-urls');

const Telegram = require('node-telegram-bot-api')
const osmosis = require('osmosis');
const _ = require("underscore");


const tg = new Telegram(TOKEN);

const UPDATE_TIMEOUT = 9000;


var standObject = {};
let myArray = [];
let idList = [];
let _saveID;
let _counter=0;
const standUpParser = {

    savedArray: [],
    savedIdList: [],


};


const path = './student.txt';

try {
  if (fs.existsSync(path)) {
    //file exists
    console.log('File exists!');
    let rawdata = fs.readFileSync('student.txt');
    standUpParser.savedIdList = JSON.parse(rawdata);
    let _rawdata = fs.readFileSync('myArray.txt');
    standUpParser.savedArray = JSON.parse(_rawdata);




  } else {
      console.log('No file');
  }
} catch(err) {
  console.error(err)
  console.log('No file');
}

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
    tg.sendMessage('@'+CHANNEL,'Update');
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
    
    myArray.push([data.id[1],data.date[1],data.seats[1],data.cost[1],data.img[1]]);
    idList.push(data.id[1]);



 };



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
        _counter++;
       console.log(_counter);
        
        //console.log(myArray);
        
        console.log(myArray.length-1);
        
        console.log(myArray[0][0])
        let _data = JSON.stringify(idList,null, 2);
        console.log(_data);
        fs.writeFileSync('student.txt', _data);

        let _array = JSON.stringify(myArray,null, 2);
        fs.writeFileSync('myArray.txt', _array);

        storeValues(myArray);

        myArray=[];
        idList=[];
      
        


    });


 
/*

console.log('asda');



osmosis
    .get('www.google.com')
    .set({'Title': 'title'})   // альтернатива: `.find('title').set('Title')`
    .data(console.log); // выведет {'Title': 'Google'}
    osmosis
    .get('https://www.google.co.in/search?q=analytics')
    .find('#botstuff')
    .set({'related': ['.card-section .brs_col p a']})
    .data(function(data) {
        console.log(data);
    });
    osmosis
   .get('https://www.google.co.in/search?q=analytics')
   .paginate('#navcnt table tr > td a[href]', 5)
   .find('#botstuff')
   .set({'related': ['.card-section .brs_col p a']})
   .data(console.log)
   .log(console.log) // включить логи
   .error(console.error);
   */

//},1000);


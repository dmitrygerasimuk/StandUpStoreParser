// jshint: es6

const osmosis = require('osmosis');


const UPDATE_TIMEOUT = 5000;


var standObject = {};
 let myArray = [];
let _saveID;
let _counter=0;;
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


 };


setInterval(function() {
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
        
        console.log(myArray.length);
        
        console.log(myArray[0][0])
        
        storeValues(myArray);

        myArray=[];
        


    });
},UPDATE_TIMEOUT);

 
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


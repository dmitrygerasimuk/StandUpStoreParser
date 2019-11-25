const osmosis = require('osmosis');
var myData;
//setInterval(function() {

osmosis
    .get('https://standupstore.ru')
    //.set({'related': ['.infiniti-contant']})
   .paginate('.inf-next-link > a', 10)
    //.set({'related': ['.infiniti-contant']})
    
    .set({'wow': ['.t-descr'], 'img': ['.t-bgimg@style']})
    
    

    .data(function(data) {
        //console.log(data.a[data.a.length-1]);
        //console.log(data.wow[data.wow.length-1]);
   
        //myData = data;
       console.log(data);

    });



/*


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



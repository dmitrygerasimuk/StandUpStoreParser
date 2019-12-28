var osmosis = require('osmosis');
const cheerio = require("cheerio");
const $ = require('cheerio');




osmosis
.get('https://standupstore.ru')
//.set({'related': ['.infiniti-contant']})
.paginate('.inf-next-link > a', 20)
.find('.js-product')

.set({'id': ['comment()[1]'],
      'href': ['a[href]@href'],
      'seats' : ['a[href]@data-seats'],
      'cost' : ['a[href]@data-cost'],
      'img': ['.t-bgimg@style']})
      
.data(function(listing) {
    // do something with listing data
   // console.log(listing.id);
  
   
   $(listing.id[0],'.order').each(function() {
    var data = {};
    data.id=$(this).attr('data-id');
    data.date=$(this).attr('data-date');
    data.seats=$(this).attr('data-seats');
    data.cost=$(this).attr('data-cost');
    data.img=listing.img;
    data.href=listing.href;
    console.log(data);

  
  //console.log('lol');
});

})
.log(console.log)
.error(console.log)
.debug(console.log)




const express = require('express');
const app = express();
const async = require("async");
const port = process.env.PORT || 3000;
const morgan = require('morgan');
const bodyParser = require('body-parser');
const router = express.Router();
var Scraper = require ('images-scraper')
var google = new Scraper.Google();
var SearchDetail = require('./models/SearchDetail');
var mongoose = require('mongoose');
var fs = require('fs');
var Jimp = require("jimp");
var path = require('path');
var mkdirp = require('mkdirp');
var readfiles = require('readfiles');




// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));
app.use(morgan('dev'));
app.use('/',router);

// mongodb://<dbuser>:<dbpassword>@ds119306.mlab.com:19306/googlesearchdata
var MONGOLAB_URI = 'mongodb://akki:1111111@ds119306.mlab.com:19306/googlesearchdata'
// var MONGOLAB_URI = 'mongodb://localhost/GoogleSearchData';
//connect Database
mongoose.connect(MONGOLAB_URI, (err,response) =>{
    if(err){
      console.log('falied to connect');
    }
    else {
      console.log('connected to db' +MONGOLAB_URI );
    }
  })

app.use(express.static(__dirname + '/public'));
app.post('/api/imageScrapeAndProcessing',imageScrapeAndProcessing);
app.get('/api/getAllSearch',getAllSearch);
app.get('/api/getSearchById/:id',getSearchById);

//   image processing
function imageScrapeAndProcessing (req,res){
    var searchKeyWord = req.body.searchKeyWord

   
    var folderPath = './data/ImageData_'+searchKeyWord ;
     mkdirp(folderPath, function(err) { 
            // path exists unless there was an error
            var search = new SearchDetail()
            search.searchKeyword = searchKeyWord;
            search.path = folderPath;
            search.save(function(err,searchKey){
                 if(err){
                   res.status(400).send('Error occurred while creating bookmark');
                 }else{
                //    res.status(201).json(searchKey);
                
                    google.list({
                        keyword: searchKeyWord,
                        num: 15,
                        detail: false,
                        nightmare: {
                            show: false
                        }
                    })
                    .then(function (image) {
                            image.forEach(function(element,index) {
                                Jimp.read(element.url).then(function (item) {
                                    var imagePath = search.path + '/imageDataBase' + index+".jpg"
                                    item.resize(100, 100)            // resize 
                                        .quality(60)                 // set JPEG quality 
                                        .greyscale()                 // set greyscale 
                                        .write(imagePath); // save 
                                }).catch(function (err) {
                                    console.error(err);
                                    console.log('done')
                                });
                            })
                            res.status(201).json(image);
                            
                        }).catch(function(err) {
                        console.log('err', err);
                    });

                 }
             });
        
        });

    

    
}

function getAllSearch(req,res){
    SearchDetail.find()
    .sort('-createdDate')
    .exec(function(err,search){
        if(err){
          console.log(err);
          res.json(err);
        }else{
          console.log(search);
          res.json(search);
        }
      })

}

function getSearchById (req,res)
{
    
    SearchDetail.findOne({_id:req.params.id})
    .exec(function(err,search){
        if(err){
          res.json(err);
        }else{
          res.json(search)      
        }
      })
}


app.listen(port,() =>{
    console.log('server started  : ' + port);
})
var cloudinary = require('cloudinary');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var url = require('url');
var ejs = require('ejs');
//Initialize express
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname), '/bower_components'));

app.set('view engine', 'ejs');
app.engine('.html', ejs.renderFile);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/******** Cloudinary config ***********/
var imageUpload = require('./resources/cloudinary-util.js');
var cloudConfig = new imageUpload.CloudConfig();
cloudConfig.load();

var imageUtil = require('./resources/image-util.js');
/*app.use(bodyParser.json());
app.use(bodyParser.urlencoded());*/


app.use(function(req, res, next) {
    console.log('%s %s %s', req.method, req.url, req.path);
    next();
});

app.get('/', function(req, res){
  res.render('index.html');
});

/////////////////////////////////

//Getting required data for client upload.
app.get('/getUploadDetails', function(req, res) {

    //Cloudinary URL
    var uploadUrl = imageUtil.getUploadURL(req);
    /* formData contain attributes which needs to be send to cloudinary along with file
     Attributes : {'timestamp', 'callback', 'signature', 'api_key'}" 
     */
    var formData = imageUtil.getFormData(req);
    
    res.json({
      url : uploadUrl,
      formData : formData
    });

});

/**
 * Saving image details on our server.
 * imageUtil is used to extract identifier details of the image. 
 * Its designed on top of cloudinary api
 * @param  req  request object containing uploaded image details in JSON format
 * @param  res response object
 * @return return photo object created by our server which can be checked on browser console
 */
app.post('/', function(req, res) {    
    console.log(req.body);

    var ImageIdentifier = new imageUtil.ImageIdentifier(req.body);
    //Image id is to be store in DB for future use.
    var imageId =  ImageIdentifier.getImageId();

    console.log(imageId);

    var photo = {};
    photo.image_id = ImageIdentifier.getImageURL();
    console.log(photo.image_id);    

    res.json(photo);
});

var server = app.listen(process.env.PORT || 3333, function() {
    console.log('Listening on port %d', server.address().port);
});



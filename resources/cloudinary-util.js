/******** Cloudinary config ***********/
//## Cloudinary API version 1.1
/**
This will configure cloud settings for uploading Image.
It will also check if cloud server in in service.

Current Service : http://cloudinary.com/

*/
var ImageUpload = {};

var cloudinary = require('cloudinary');
var https = require('https');
var config = require('./config.js');

/**
 * This constructor contain configurations for image cloud
 * [Currently contain settings for cloudinary]
 */
var CloudConfig = function (){
    this.cloudName = config.cloudinary.cloudName;
    this.apiKey    = config.cloudinary.apiKey;  
    this.apiSecret = config.cloudinary.apiSecret;
    this.version   = config.cloudinary.version;
  }

/**
 * Load configuration so that it can be used by image storing service.
 * It also check if service for which it loading cofiguration is available.
 */
CloudConfig.prototype.load = function(){
    cloudinary.config({ 
    cloud_name: this.cloudName, 
    api_key: this.apiKey, 
    api_secret: this.apiSecret 
    });

    console.log("### Current Cloudinary Config ###");
    console.log(cloudinary.config());

    //Test if cloudinary service is available.
    CLOUDINARY_URL = 'https://'+ this.apiKey + ':' + this.apiSecret + '@api.cloudinary.com/' 
                      + this.version + '/' + this.cloudName + '/';

    PING_URL = CLOUDINARY_URL + 'ping'

    //console.log("ping url:" + PING_URL);

    var req = https.request(PING_URL, function(res) {
    if(res.statusCode == 200){
      console.log('Cloudinary Service >>>> OK')
    }
    else{
      console.log('####FATAL ERROR#### : Cloudinary Service >>>> NOT available')
    }
    }).on('error', function(e) {
        console.error("#### Error connecitng Cloudinary server. Please check connection");
    });
    
    req.end();
}

ImageUpload.CloudConfig = CloudConfig;

module.exports = ImageUpload;

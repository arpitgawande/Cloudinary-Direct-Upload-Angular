/**
 * Contains all Image upload related utility functions.
 * As Cloudinary service is used for storing images, 
 * most of the cloudinary API are used to achieve functionality
 * Upload images: http://cloudinary.com/documentation/upload_images
 */
var cloudinary = require('cloudinary');

var ImageUtil = {}

/**
 * ImageIdentifier is used to set required image details in object.
 * @param {JSON} uploadedImgData : contain details of uploaded image.
 */
ImageIdentifier = function (uploadedImgData){
    this.publicId = uploadedImgData.public_id;
    this.version = uploadedImgData.version;
    this.format = uploadedImgData.format;
    this.signature = uploadedImgData.signature;
    this.imageId = null;
    //Extranct Image identifier to be store.
    expected_signature = cloudinary.utils.api_sign_request({
      public_id: this.publicId,
      version: this.version
    }, cloudinary.config().api_secret);

    if(expected_signature == this.signature){
      console.log("Valid Image");
    } else {
      console.log("***In Valid Image");
    }
}

/**
 * Get image id which will be stored in DB.
 * @return {String} imageid;
 */
ImageIdentifier.prototype.getImageId = function (){
  var filename = this.publicId + '.' + this.format
  return "v" + this.version + "/" + filename;
}

/**
 * Build image url which can be used to render image on html.
 * This use the ImageIdentifier object attributes
 * @return {[String]} image URL
 */
ImageIdentifier.prototype.getImageURL = function(){
  return cloudinary.utils.url(this.getImageId(), { crop: "fill", width: 120, height: 80 })
}

/**
 * Set different options to be passed while uploading image.
 * @param  {JSON} req request object
 * @return {JSON} object containing all the objects
 */
var getOptions = function (req){
  var cloudinary_cors = "http://" + req.headers.host + "/cloudinary_cors.html";
  //var options = { callback: cloudinary_cors, type: "private"};
  //var options = { callback: cloudinary_cors, type: "authenticated"};
  var options = { callback: cloudinary_cors};
  return options;
}

/**
 * Get URL to which image has to be uploaded.
 * @param  {JSON} req: Request object
 * @return {String} URL
 */
var getUploadURL = function(req){
    var options = getOptions(req);
    var uploadURL = cloudinary.uploader.upload_url(options);
    console.log(uploadURL);
    return uploadURL;
}

/**
 * Cretate Form Data which has to be submited to server for uploading
 * It mainly contain header, signature, timestanp etc
 * e.g.
 * {'timestamp':1426945697,
 *  'callback':'http://localhost:3000/cloudinary_cors.html',
 *  'signature':'a99ca648fa81002a317c558ecf215e6393f3aefc',
 *  'api_key':'823717731868925'}"
 *   
 * @param  {JSON} req: Request object
 * @return {JSON} Form Data
 */
var getFormData = function(req){
    var options = getOptions(req);
    var formData = cloudinary.uploader.upload_tag_params(options);
    console.log(formData);
    return formData;
}

ImageUtil.ImageIdentifier = ImageIdentifier;
ImageUtil.getUploadURL = getUploadURL;
ImageUtil.getFormData = getFormData;

module.exports = ImageUtil;
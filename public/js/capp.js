(function(){

  //File Upload Options - https://github.com/blueimp/jQuery-File-Upload/wiki/Options
	var app = angular.module("cUploadApp", ['blueimp.fileupload']);

	app.config([
            '$httpProvider', 'fileUploadProvider',
            function ($httpProvider, fileUploadProvider) {
                delete $httpProvider.defaults.headers.common['X-Requested-With'];
                fileUploadProvider.defaults.redirect = window.location.href.replace(
                    /\/[^\/]*$/,
                    '/cloudinary_cors.html?%s'
                );
                //Set defualt values for your application upload feature.
                angular.extend(fileUploadProvider.defaults, {
                    // Enable image resizing, except for Android and Opera,
                    // which actually support image resizing, but fail to
                    // send Blob objects via XHR requests:
                    disableImageResize: /Android(?!.*Chrome)|Opera/
                        .test(window.navigator.userAgent),
                    maxFileSize: 5000000,
                    acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
                    //To file name appear
                    replaceFileInput: true,
                    dataType: 'json',
  					        headers: {"X-Requested-With": "XMLHttpRequest"},
                    //Start upload when added, default value is false.
                    autoUpload: true
                });
            }
        ])

	app.controller('ImageUplaodController', ['$http', '$scope', '$log', '$filter', '$window', 
		function($http, $scope, $log){
		var data = {}; //image options
    $scope.Imgsource = "";

		$http.get('/getUploadDetails', data).
		  success(function(data, status, headers, config) {
		    // this callback will be called asynchronously
		    // when the response is available
		    $log.debug(data);
		    $log.debug(data.url);

        var formObj = JSON.parse(data.formData);

        $log.debug($.type(formObj))

		    $scope.options = {
            	url: data.url,
              formData: formObj
       		 };
		  }).
		  error(function(data, status, headers, config) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		    $log.error("Error getting data");
		  });
          
         //On File upload completed.
         $('#fileupload').on('fileuploaddone', function(e, data){
            $log.debug(data.result);
            //$log.debug(JSON.parse(data.result))
            
            $http.post('/', data.result).
            success(function(data, status, headers, config) {
              $log.debug('sucessfuly sent');
              $log.debug(data);
              $scope.Imgsource = data.image_id;
            }).
            error(function(data, status, headers, config) {
              // called asynchronously if an error occurs
              // or server returns response with an error status.
              $log.error("Error getting data");
            });
         });
       
  	}]);		  

})();
(function() {

    'use strict';

    angular
        .module('app')
        .factory('MyFavoriteModel', MyFavoriteModel);

    MyFavoriteModel.$inject = ['$http', '$q', '$timeout', '$rootScope', 'CacheFactory', 'AppAuthenticationService', 'API', 'ENUM'];

    function MyFavoriteModel($http, $q, $timeout, $rootScope, CacheFactory, AppAuthenticationService, API, ENUM) {
  	    function isSignIn(){
  		  var user = AppAuthenticationService.getUser();
  		  if(user.state == false){
  			$rootScope.goSignin();
  		  }
  	    }
  	    isSignIn();
        var PER_PAGE = 10;

        var service = {};
        service.currentPage = 1;
        service.isEmpty = false;
        service.isLoaded = false;
        service.isLoading = false;
        service.isLastPage = false;
        service.products = null;
        service.fetch = _fetch;
        service.reload = _reload;
        service.loadMore = _loadMore;
        service.delete = _delete;
        return service;

        function _delete(product) {
        	var _this = this;
        	console.log(product);
      	    var sendData={
  		        "data": {
  		            "goodsId": product.goodsId,
  		            "isCollect": 0
  		        }
  	        };
  		    $.ajax({
  		        type: "post",
  		        async:false,
  		        url: "/stage/updateIsCollect/",
  		        contentType:'application/json',
  		        data: JSON.stringify(sendData),
  		        dataType : "json",
  		        success: function(data){ 
  		          if(data.errorInfo==null){
                      $rootScope.toast("取消收藏")
  		        	  _this.reload();
  		          }else{
                      $rootScope.toast(data.errorInfo)
  		          }
  		        },
  		        error:function(info){
  		     	   console.log(info);
  		        }
  		     });
        }

        function _reload() {

            if (this.isLoading)
                return;
            this.currentPage = 1;
            this.products = null;
            this.isEmpty = false;
            this.isLoaded = false;
            this.isLastPage = false;

            this.fetch(1, PER_PAGE);
        }

        function _loadMore() {

            if ( this.isLoading )
                return;
            if ( this.isLastPage )
                return;

            if (this.products && this.products.length) {
                this.fetch( (++this.currentPage), PER_PAGE );
            } else {
                this.fetch( 1, PER_PAGE );
            }
        }

        function _fetch( page, perPage ) {

            this.isLoading = true;
            var _this = this;
    	    var sendData={
	            "data": {
	                "queryRows": perPage,
	                "queryPage": page
	            }
	        };
		    $.ajax({
		        type: "post",
		        async:false,
		        // url: "/stage/getCollectList/",
				url:"/stage/getCollectGoods",
		        contentType:'application/json',
		        data: JSON.stringify(sendData),
		        dataType : "json",
		        success : function(data){

                  _this.products = _this.products ? _this.products.concat(data.data.shopList) : data.data.shopList;
                  _this.isEmpty = (_this.products && _this.products.length) ? false : true;
                  _this.isLoaded = true;
                  _this.isLoading = false;
                  _this.isLastPage = (data.data.pageNo == _this.currentPage) ? true : false;
		        },
		        error:function(error){
		     	   $rootScope.toast(error.errorInfo);
		        }
		     });
        }

    }

})();
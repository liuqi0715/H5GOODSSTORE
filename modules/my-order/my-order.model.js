(function () {

	'use strict';

	angular
		.module('app')
		.factory('MyOrderModel', MyOrderModel);

	MyOrderModel.$inject = ['$http', '$q', '$timeout', '$rootScope', 'CacheFactory', 'AppAuthenticationService', 'API', 'ENUM'];

	function MyOrderModel($http, $q, $timeout, $rootScope, CacheFactory, AppAuthenticationService, API, ENUM) {

		var PER_PAGE = 10;
		var service = {};
		service.isEmpty = false;
		service.isLoaded = false;
		service.isLoading = false;
		service.isLastPage = false;
		service.currentPage = 1;
		service.status = null;
		service.orders = [];
		service.fetch = _fetch;
		service.reload = _reload;
		service.loadMore = _loadMore;
		return service;
		function _reload() {
//
//			if (!AppAuthenticationService.getToken())
//				return;
			if (this.isLoading)
				return;
			this.orders = [];
			this.currentPage = 1;
			this.isEmpty = false;
			this.isLoaded = false;
			this.isLastPage = false;

			this.fetch(1, PER_PAGE);
		}

		function _loadMore() {
//			if (!AppAuthenticationService.getToken())
//				return;

			if (this.isLoading)
				return;
			if (this.isLastPage)
				return;
			if (this.orders && this.orders.length) {
				this.fetch((++this.currentPage), PER_PAGE);
			} else {
				this.fetch(1, PER_PAGE);
			}
		}

		function _fetch(page, perPage) {

//			if (!AppAuthenticationService.getToken())
//				return;

			this.isLoading = true;

//			var params = {
//				page: page,
//				per_page: perPage
//			};
//
//			if (null != this.status) {
//				params.status = this.status;
//			}

			var _this = this;
//			API.order.list(params).then(function (orders) {
//				_this.orders = _this.orders ? _this.orders.concat(orders) : orders;
//				_this.isEmpty = (_this.orders && _this.orders.length) ? false : true;
//				_this.isLoaded = true;
//				_this.isLoading = false;
//				_this.isLastPage = (orders && orders.length < perPage) ? !_this.isEmpty : false;
//			});
		    var sendData={
		    	 "data":{
		            "status": this.status,
		            "pageSize": perPage,
		            "pageCount": page 
		    	 }
	        };
		    // var promise = $.ajax({
		    //     type: "post",
		    //     async: false,
		    //     url: "/stage/getHistory/",
		    //     contentType:'application/json',
		    //     data: JSON.stringify(sendData),
		    //     dataType : "json",
		    //     success: function(data){
		    //       if(data.errorInfo==null){
		    //     	  _this.isLoading = false;
		    //     	  _this.orders = _this.orders.length>0 ? _this.orders.concat(data.data.orderList) : data.data.orderList;
		    //     	  _this.isLastPage = _this.currentPage==data.data.totalPage ? true : false;
		    //       }else{
             //          $scope.toast(data.errorInfo);
		    //       	 _this.isLoading = false;
		    //       }
		    //     },
		    //     error:function(info){
		    //  	   console.log(info);
		    //     }
		    // });
//		    return promise;
            $.ajax({
                type: "post",
                async: false,
                url: "/stage/getOrderList",
                contentType:'application/json',
                data: JSON.stringify(sendData),
                dataType : "json",
                success: function(data){
                    if(data.errorInfo==null){
                        _this.isLoading = false;
                        _this.orders = _this.orders.length>0 ? _this.orders.concat(data.data.orderList) : data.data.orderList;
                        _this.isLastPage = _this.currentPage==data.data.totalPage ? true : false;
                    }else{
                        $scope.toast(data.errorInfo);
                        _this.isLoading = false;
                    }
                },
                error:function(info){
                    console.log(info);
                }
            });
		}

	}

})();
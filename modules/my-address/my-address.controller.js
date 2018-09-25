(function () {

	'use strict';

	angular
		.module('app')
		.controller('MyAddressController', MyAddressController);

	MyAddressController.$inject = ['$scope', '$http', '$rootScope', '$stateParams', '$location', '$state', 'API', 'ENUM', 'AddressEditModel', 'MyAddressModel'];

	function MyAddressController($scope, $http, $rootScope, $stateParams, $location, $state, API, ENUM, AddressEditModel, MyAddressModel) {

		$scope.touchCreate = _touchCreate;
		$scope.touchModify = _touchModify;

		$scope.myAddressModel = MyAddressModel;
		$scope.addressEditModel = AddressEditModel;

		function _touchCreate() {
			$scope.addressEditModel.clear();
			$scope.addressEditModel.consignee = null;

			$state.go('address-edit', {isEdit:null});
		}

		function _touchModify(consignee) {
			$scope.addressEditModel.clear();
			$scope.addressEditModel.consignee = consignee;
			$state.go('address-edit', {isEdit:JSON.stringify(consignee)});
		}

		$scope.addressList=null;
//		$scope.myAddressModel.reload();
		$scope.getAddressInfo=function(){
		    var sendData1={
	            "data": {}
	        };
		    // $.ajax({
		    //     type: "post",
		    //     url: "/user/searchAddressInfo/",
		    //     contentType:'application/json',
		    //     data: JSON.stringify(sendData1),
		    //     dataType : "json",
		    //     success : function(data){
		    //       if(data.errorInfo==null){
		    //     	 console.log(data);
		    //     	 $scope.addrInfos=data.data.userAddressBeans;
		    //     	 $scope.$apply();
		    //       }else{
             //          $scope.toast(data.errorInfo);
		    //       }
		    //     },
		    //     error:function(info){
             //        $scope.toast("服务器异常")
		    //     }
		    //  });

            $.ajax({
                type: "post",
                url: "/storesInfo/queryStoresReceivingAddress",
                contentType:'application/json',
                data: JSON.stringify(sendData1),
                dataType : "json",
                success : function(data){
                    if(data.errorInfo==null){
                        $scope.addressList=data.data.addressList;
                    	$scope.$apply();
                    }else{
                       $scope.toast(data.errorInfo);
                    }
                },
                error:function(info){
                      $scope.toast("服务器异常")
                }
            });
		};
		$scope.getAddressInfo();
	}

})();
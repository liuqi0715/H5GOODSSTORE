(function () {

	'use strict';

	angular
		.module('app')
		.controller('AddressSelectController', AddressSelectController);

	AddressSelectController.$inject = ['$scope', '$http', '$stateParams', '$rootScope', '$state', 'API', 'ENUM', 'AddressEditModel', 'AddressSelectModel'];

	function AddressSelectController($scope, $http, $stateParams, $rootScope, $state, API, ENUM, AddressEditModel, AddressSelectModel) {
		
		console.log($stateParams);
		if($stateParams.selectUse){
			$scope.selectUse=$stateParams.selectUse;
		}
		$scope.selectedId = $stateParams.address;

		$scope.addressSelectModel = AddressSelectModel;

		$scope.touchCreate = _touchCreate;
		$scope.touchModify = _touchModify;
//		$scope.touchConsignee = _touchConsignee;

		$scope.addressEditModel = AddressEditModel;

		function _touchCreate() {
			$scope.addressEditModel.clear();
			$scope.addressEditModel.consignee = null;
			$state.go('address-edit',{location: 'replace'});
		}
		$scope.addrFeddBack=function(consignee){
			if($scope.selectUse=="1"){
				$state.go('confirm-product',
					{sendData:$stateParams.keptData,addrData:JSON.stringify(consignee),shipType:$stateParams.shipType},
					{location: 'replace'});
			}
		};

		function _touchModify(consignee) {
			$scope.addressEditModel.clear();
			$scope.addressEditModel.consignee = consignee;

            $state.go('address-edit',{isEdit:JSON.stringify(consignee)});
		}


		$scope.addressSelectModel.clear();

		$scope.getAddressInfo=function(){
		    var sendData1={
	            "data": {}
	        };

            $.ajax({
                type: "post",
                url: "/storesInfo/queryStoresReceivingAddress",
                contentType:'application/json',
                data: JSON.stringify(sendData1),
                dataType : "json",
                success : function(data){
                    if(data.errorInfo==null){

                        $scope.addrInfos=data.data.addressList;
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
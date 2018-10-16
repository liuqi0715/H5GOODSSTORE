(function () {

	'use strict';

	angular
		.module('app')
		.controller('PaymentController', PaymentController);

	PaymentController.$inject = ['$scope', '$http', '$location', '$state','$window', '$rootScope', '$timeout', '$stateParams', 'API', 'ENUM', 'PaymentModel'];

	function PaymentController($scope, $http, $location, $state,$window, $rootScope, $timeout, $stateParams, API, ENUM, PaymentModel) {



		$scope.payment={
            orderSn:[]
		},$scope.payList={};
		if($stateParams.order){
            // $scope.payment.orderSn = JSON.parse($stateParams.order);
			if (typeof (JSON.parse($stateParams.order))=="string"){
               var order = {"orderNo":JSON.parse($stateParams.order)};
			   ($scope.payment.orderSn).push(order);
			}else {
                $scope.payment.orderSn = JSON.parse($stateParams.order);
			}
		}
		if($stateParams.sum){
			$scope.payment.orderTotal=$stateParams.sum;
		}
		$scope.selectedType = null;
		$scope.payActive={};
		$scope.payList.isLoaded = false;

		$scope.isSelected = _isSelected;
		$scope.touchSelect = _touchSelect;
		$scope.touchSubmit = _touchSubmit;
		$scope.touchDetail = _touchDetail;

		function _isSelected(type) {
			if (type.payId == $scope.selectedType) {
				return true;
			}else{
				return false;
			}
		}

		function _touchSelect(type) {
			$scope.selectedType = type.payId;
			$scope.selectedTypeName = type.payName;
			$scope.payActive={
				"background":"#F7523E"
			};
		}

		function _touchSubmit() {
			if (!$scope.selectedType) {
				$scope.toast('请选择支持方式');
				return;
			}
		    var sendData={
	            "data": {
	            	"orderNoList": $scope.payment.orderSn,
                    "payId":$scope.selectedType,
	            	"pay_amount":$scope.payment.orderTotal,
	            	"payName":$scope.selectedTypeName
	            }
	        };
		    $.ajax({
		        type: "post",
		        url: "/order/payment",
		        contentType:'application/json',
		        data: JSON.stringify(sendData),
		        dataType : "json",
		        success: function(data){  
		          if(data.errorInfo==null){

		        	if (data.data.url && data.data.url!=null){
                        $window.location.href = data.data.url;
                    }else {
		        		$scope.toast("付款成功")
						$state.go("my-order",{
							"hassuccess":true
						}, {location: 'replace'});
						// console.log($state,"$state")
						$window.history.length==1;
					}
		          }else{
		          	$scope.toast(data.errorInfo);
		          }
		        },
		        error:function(info){
		     	   $scope.toast("服务器异常")
		        }
		    });

		}

		function _touchDetail() {
			$state.go('order-detail', {
				order: $scope.paymentModel.order.id
			});
		}

		function _reload() {
//			$scope.paymentModel
//				.reload()
//				.then(function (succeed) {
//					if (succeed) {
//						
//					}
//				});
		    var sendData={
	            "data": {}
	        };
		    $.ajax({
		        type: "post",
		        url: "/stage/getPayment/",
		        contentType:'application/json',
		        data: JSON.stringify(sendData),
		        dataType : "json",
		        success: function(data){  
		          if(data.errorInfo==null){
		        	  $scope.payList=data.data.payList;
		        	  $scope.payList.isLoaded = true;
		        	  $scope.$apply();
		          }else{
		          	$scope.toast(data.errorInfo);
		          }
		        },
		        error:function(){
		     	  $scope.toast("服务器异常")
		        }
		    });
		}

		_reload();
	}

})();
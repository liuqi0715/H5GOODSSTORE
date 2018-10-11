(function () {

	'use strict';

	angular
		.module('app')
		.controller('MyOrderController', MyOrderController);

	MyOrderController.$inject = ['$scope', '$rootScope', '$http', '$window', '$timeout', '$location', '$state', '$stateParams', 'API', 'ENUM', 'PaymentModel', 'MyOrderModel', 'OrderExpressModel', 'AppAuthenticationService'];

	function MyOrderController($scope, $rootScope, $http, $window, $timeout, $location, $state, $stateParams, API, ENUM, PaymentModel, MyOrderModel, OrderExpressModel, AppAuthenticationService) {

		if(AppAuthenticationService.getUser().state == false){
			$rootScope.goSignin();
		}
		
		$scope.TAB_ALL = 0;
		$scope.TAB_CREATED = 1;
		$scope.TAB_PAID = 2;
		$scope.TAB_DELIVERING = 3;
		$scope.TAB_DELIVERIED = 4;

		$scope.currentTab = $scope.TAB_ALL;
		$scope.confirmOrder=null;
		$scope.cancellingOrder = null;

		$scope.myOrderModel = MyOrderModel;
		$scope.paymentModel = PaymentModel;
		$scope.orderExpressModel = OrderExpressModel;

		if ($stateParams.tab == 'all') {
			$scope.currentTab = $scope.TAB_ALL;
			$scope.myOrderModel.status = null;
		} else if ($stateParams.tab == 'created') {
			$scope.currentTab = $scope.TAB_CREATED;
			$scope.myOrderModel.status = 1;
		} else if ($stateParams.tab == 'paid') {
			$scope.currentTab = $scope.TAB_PAID;
			$scope.myOrderModel.status = 2;
		} else if ($stateParams.tab == 'delivering') {
			$scope.currentTab = $scope.TAB_DELIVERING;
			$scope.myOrderModel.status = 3;
		} else if ($stateParams.tab == 'delivered') {
			$scope.currentTab = $scope.TAB_DELIVERIED;
			$scope.myOrderModel.status = 4;
		} else {
			$scope.currentTab = $scope.TAB_ALL;
			$scope.myOrderModel.status = null;
		}

		$scope.touchTabAll = _touchTabAll;
		$scope.touchTabCreated = _touchTabCreated;
		$scope.touchTabPaid = _touchTabPaid;
		$scope.touchTabDelivering = _touchTabDelivering;
		$scope.touchTabDeliveried = _touchTabDeliveried;

		$scope.touchDialogCancel = _touchDialogCancel;
		$scope.touchDialogConfirm = _touchDialogConfirm;

		$scope.touchOrder = _touchOrder;
		$scope.touchPay = _touchPay;
		$scope.touchCancel = _touchCancel;
		$scope.touchConfirm = _touchConfirm;
		$scope.touchExpress = _touchExpress;
		$scope.touchComment = _touchComment;
		//获取验证嘛方法
		$scope.getCode = _getCode;
		//倒计时方法
		$scope.getTime = _getTime;
		$scope.comfirmOrderCode=null;
		$scope.isCode = true;
        $scope.showDialog = false;






		function _touchTabAll() {
			if ($scope.currentTab != $scope.TAB_ALL) {
				$scope.currentTab = $scope.TAB_ALL;
				$scope.myOrderModel.status = 0;
				$scope.myOrderModel.reload();
			}
		}

		function _touchTabCreated() {
			if ($scope.currentTab != $scope.TAB_CREATED) {
				$scope.currentTab = $scope.TAB_CREATED;
				$scope.myOrderModel.status = 1;
				$scope.myOrderModel.reload();
			}
		}

		function _touchTabPaid() {
			if ($scope.currentTab != $scope.TAB_PAID) {
				$scope.currentTab = $scope.TAB_PAID;
				$scope.myOrderModel.status = 2;
				$scope.myOrderModel.reload();
			}
		}

		function _touchTabDelivering() {
			if ($scope.currentTab != $scope.TAB_DELIVERING) {
				$scope.currentTab = $scope.TAB_DELIVERING;
				$scope.myOrderModel.status = 3;
				$scope.myOrderModel.reload();
			}
		}

		function _touchTabDeliveried() {
			if ($scope.currentTab != $scope.TAB_DELIVERIED) {
				$scope.currentTab = $scope.TAB_DELIVERIED;
				$scope.myOrderModel.status = 4;
				$scope.myOrderModel.reload();
			}
		}

		function _touchOrder(order) {
			$state.go('order-detail', {
				order: order.orderNo
			});
		}
		function _getTime() {
            $scope.date = 60;
            var interval = setInterval(function() {
                if ($scope.date > 0) {
                    $scope.date --;
                } else {
                    clearInterval(interval);
                    $scope.isCode = true;
                }
                $scope.$digest();
            }, 1200);
        }
		function _touchConfirm(order) {
			$scope.confirmOrder = order;
			$scope.showDialog = true;
		}
		function _getCode() {
			var sendJson = {
               "data": {
                "orderNo":$scope.confirmOrder.orderNo
			   }
           };
           $.ajax({
               type: "post",
               url: "/order/getVerificationCode/",
               contentType: 'application/json',
               data: JSON.stringify(sendJson),
               dataType: "json",
               success: function(data) {
                   if (data.errorInfo == null) {
                   		$scope.isCode = false;
                       _getTime()					//成功拿到数据后执行，倒计时函数
                   } else {
                       $scope.toast(data.errorInfo);
                   }
               },
               error: function(info) {
                   console.log(info);
               }
           });
        }
		function _touchExpress(order) {
			$scope.orderExpressModel.clear();
			$scope.orderExpressModel.order = order;
			$state.go('order-express', {
				order: order.id
			});
		}

		function _touchComment(order) {
			var param = JSON.stringify(order);
			$scope.isLoaded = true;

			$state.go('order-review', {
				order:param
            });
        }

		function _touchPay(order) {
			$state.go('payment', {order: JSON.stringify(order.orderNo) ,sum:order.sumPrice});
		}

		function _touchCancel(order) {
			$scope.cancellingOrder = order;
			$scope.showDialog = true;
		}

		function _touchDialogCancel() {
			$scope.cancellingOrder = null;
			$scope.confirmOrder = null;
			$scope.showDialog = false;
		}

		function _touchDialogConfirm() {
			if($scope.cancellingOrder != null){

		        var sendJson = {
	                "data": {
	                	"orderNo": $scope.cancellingOrder.orderNo
	                }
	            };
		        var relatedUrl="/order/cancelOrder/";
			}else{

		        var sendJson = {
	                "data": {
	                	"orderNo": $scope.confirmOrder.orderNo,
	                }
	            };
		        var relatedUrl="/order/confirmReceipt/";
			}

            $.ajax({
                type: "post",
                url: relatedUrl,
                contentType: 'application/json',
                data: JSON.stringify(sendJson),
                dataType: "json",
                success: function(data) {
                    if (data.errorInfo == null) {
        				$scope.myOrderModel.reload();
        				$scope.cancellingOrder = null;
        				$scope.confirmOrder = null;
        				$scope.showDialog = false;
                        $scope.toast("操作成功")
                        $scope.$apply();
                    } else {
                        $scope.toast(data.errorInfo);
        				$scope.cancellingOrder = null;
        				$scope.confirmOrder = null;
        				$scope.showDialog = false;
        				$scope.$apply();
                    }
                },
                error: function(info) {

                    $scope.toast("服务器异常")
    				$scope.cancellingOrder = null;
    				$scope.confirmOrder = null;
    				$scope.showDialog = false;
    				$scope.$apply();
                }
            });
		}
		$scope.myOrderModel.reload();

	}

})();
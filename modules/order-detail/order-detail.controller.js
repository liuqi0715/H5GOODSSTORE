(function () {

	'use strict';

	angular
		.module('app')
		.controller('OrderDetailController', OrderDetailController);

	OrderDetailController.$inject = ['$scope', '$http', '$window', '$timeout', '$location', '$state', '$stateParams', 'API', 'ENUM', 'PaymentModel', 'OrderExpressModel'];

	function OrderDetailController($scope, $http, $window, $timeout, $location, $state, $stateParams, API, ENUM, PaymentModel, OrderExpressModel) {

		var orderId = $stateParams.order;
		var orderList = $stateParams.order.goodList;
		console.log(orderId,"orderId")
		$scope.order = {
			id: orderId,
            goodsList:orderList
		};
		console.log("$scope.order",$scope.order)
		$scope.isLoading = false;
		$scope.isLoaded = false;

		$scope.touchPay = _touchPay;
		$scope.touchCancel = _touchCancel;
		$scope.touchConfirm = _touchConfirm;
		$scope.touchExpress = _touchExpress;
		$scope.touchComment = _touchComment;
		$scope.touchProduct = _touchProduct;
		$scope.confirmOrder=null;
		$scope.cancellingOrder = null;
		$scope.showDialog = false;
		$scope.comfirmOrderCode = {};
		$scope.comfirmOrderCode.codes = null;
		$scope.touchDialogCancel = _touchDialogCancel;
		$scope.touchDialogConfirm = _touchDialogConfirm;
		$scope.paymentModel = PaymentModel;
		$scope.orderExpressModel = OrderExpressModel;

		function _touchPay() {
			if (!$scope.order)
				return;
			$scope.paymentModel.clear();
			$scope.paymentModel.order = $scope.order;
			$state.go('payment', {order:orderId,sum:$scope.orderDetails.orderAmount});
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

        function _touchConfirm(order) {
            $scope.confirmOrder = order;
            $scope.showDialog = true;

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
            console.log(sendJson);
            $.ajax({
                type: "post",
                url: relatedUrl,
                contentType: 'application/json',
                data: JSON.stringify(sendJson),
                dataType: "json",
                success: function(data) {
                    if (data.errorInfo == null) {
                        console.log(data);
                        _reload();
                        $scope.cancellingOrder = null;
                        $scope.confirmOrder = null;
                        $scope.showDialog = false;
                        $scope.toast("已确认收货")
						// history.back()

                        $scope.$apply();
                    } else {
                        alert(data.errorInfo);
                        $scope.cancellingOrder = null;
                        $scope.confirmOrder = null;
                        $scope.showDialog = false;
                        $scope.$apply();
                    }
                },
                error: function(info) {
                    console.log(info);
                    $scope.cancellingOrder = null;
                    $scope.confirmOrder = null;
                    $scope.showDialog = false;
                    $scope.$apply();
                }
            });
        }

		function _touchExpress() {
			$scope.orderExpressModel.clear();
			$scope.orderExpressModel.order = $scope.order;

			$state.go('order-express', {
				order: $scope.order.id,
                // goods:$scope.order.orderList
			});
		}

		function _touchComment() {
            console.log($scope.orderDetails,"+++++++++++++++++++")
            $state.go('order-review', {
                order: JSON.stringify($scope.orderDetails),
				// goods: $scope.order.goodsList,
			});


		}

		function _touchProduct(product) {
			$state.go('product', {
				product: product.goodsId
			});
		}

		function _reload() {
			$scope.isLoading = true;
			$scope.isLoaded = false;
		    var sendData={
		    	 "data":{
		    		 "orderNo": orderId
		    	 }
	        };
		    $.ajax({
		        type: "post",
		        async:false,
		        url: "/stage/getOrderDetails/",
		        contentType:'application/json',
		        data: JSON.stringify(sendData),
		        dataType : "json",
		        success: function(data){  
		          if(data.errorInfo==null){
		        	 $scope.orderDetails=data.data;
					 $scope.isLoading = false;
					 $scope.isLoaded = true;
		          }else{
		          	$scope.toast(data.errorInfo);
		          	window.history.back(-1)
					$scope.isLoading = false;
					$scope.isLoaded = true;
		          }
		        },
		        error:function(info){
		     	   console.log(info);
		        }
		    });
//			API.order.get({
//				order: orderId,
//			}).then(function (order) {
//				$scope.order = order;
//				var promos = order.promos;
//				$scope.promos = [];
//				// score:积分  cashgift:红包  preferential:优惠金额(折扣价格)  goods_reduction:商品减免   order_reduction:(订单减免)   coupon_reduction:(优惠券减免)
//				for (var key in promos) {
//					if (promos[key].promo == 'score') {
//						promos[key].name = "积分";
//					} else if (promos[key].promo == 'cashgift') {
//						promos[key].name = "红包";
//					} else if (promos[key].promo == 'preferential') {
//						promos[key].name = "优惠金额";
//					} else if (promos[key].promo == 'goods_reduction') {
//						promos[key].name = "商品减免";
//					} else if (promos[key].promo == 'order_reduction') {
//						promos[key].name = "订单减免";
//					} else if (promos[key].promo == 'coupon_reduction') {
//						promos[key].name = "优惠券减免";
//					}
//				}
//
//				$scope.promos = promos;
//				$scope.isLoading = false;
//				$scope.isLoaded = true;
//			});
		}

		_reload();
	}

})();
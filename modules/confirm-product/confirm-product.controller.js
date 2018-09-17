(function () {

	'use strict';

	angular
		.module('app')
		.controller('ConfirmController', ConfirmController);

	ConfirmController.$inject = ['$scope', '$state', '$rootScope', '$location','$stateParams', 'API', 'ConfirmProductService', 'ExpressSelectService', 'InvoiceSelectService', 'PaymentModel','AppAuthenticationService'];

	function ConfirmController($scope, $state, $rootScope,$location,$stateParams, API, ConfirmProductService, ExpressSelectService, InvoiceSelectService, PaymentModel,AppAuthenticationService) {
		$scope.newData = JSON.parse(localStorage.getItem("submitDatas"))
		if ($scope.newData){
            $scope.submitDatas = $scope.newData;
		}else {
            $scope.submitDatas={
                shopList:[],
                userAddressId:"",
                isShoppingCart:""
            };
		}

        $scope.user = AppAuthenticationService.getUser();
		//购物车或者商品详情页面传递过来的数据。
		if($stateParams.sendData!=undefined){
			var searchData=JSON.parse($stateParams.sendData);
		}
		if($stateParams.shipType!=undefined){
			var shipData=JSON.parse($stateParams.shipType);
			$scope.submitDatas.express=shipData;
			$scope.submitDatas.shippingId=shipData.shippingId;
		}else {
			console.log("$stateParams.shipType==undefined")
		}

		$scope.getOrderInfos=function(){
            if($scope.user.state == false){
                $rootScope.goSignin();
                $scope.toast('请先登录');
            }else {
		    $.ajax({
		        type: "post",
		        // url: "/stage/addBuyGood/",
				url:"/stage/orderInfoConfirm",
		        contentType:'application/json',
		        data: JSON.stringify(searchData),
		        dataType : "json",
		        success: function(data){  
		          if(data.errorInfo==null){
		        	 $scope.orderInfo=data.data;

		     		 if($stateParams.addrData!=undefined){
		    			var addrData=JSON.parse($stateParams.addrData);
		    			$scope.orderInfo.address=addrData;
		    		 }
		     		 if($scope.orderInfo.address){
		     			$scope.orderInfo.userAddressId=$scope.orderInfo.address.addressId;
		     		 }
		        	 $scope.orderInfo.isShoppingCart=$scope.orderInfo.isBuy;

		        	 $scope.$apply();
		          }else{
		          	$scope.toast(data.errorInfo);
		          	history.back()
		          }
		        },
		        error:function(info){
		     	   console.log(info);
		        }
		     });
            }
		};
		$scope.getOrderInfos();
		$scope.touchAddress = _touchAddress;
		$scope.touchExpress = _touchExpress;
		$scope.touchInvoice = _touchInvoice;
		$scope.touchCashgift = _touchCashgift;
		$scope.touchSubmit = _touchSubmit;
//		$scope.refreshScore = _refreshScore;
		$scope.refreshComment = _refreshComment;
		$scope.consigneeList = [];
		$scope.consignee = ConfirmProductService.consignee;
		$scope.invoiceType = ConfirmProductService.invoiceType;
		$scope.invoiceTitle = ConfirmProductService.invoiceTitle;
		$scope.invoiceContent = ConfirmProductService.invoiceContent;
		$scope.cashgift = ConfirmProductService.cashgift;
		$scope.express = ConfirmProductService.express;
		$scope.coupon = ConfirmProductService.coupon;
		$scope.all_discount = 0;

		$scope.input = {
			score: 0,
			comment: ""
		};

		$scope.input.score = ConfirmProductService.input.score;
		$scope.input.comment = ConfirmProductService.input.comment;

		if($scope.input.score == 0){
			$scope.input.score = "";
		}
		$scope.rule = "";
		$scope.scoreInfo = null;
		$scope.priceInfo = {};
		$scope.canPurchase = _checkCanPurchase;
		$scope.formatPromo = _formatPromo;
        $scope.touchDialog = _touchDialog;
        $scope.touchDialogConfirm = _touchDialogConfirm;
        $scope.touchDialogCancel = _touchDialogCancel;

		$scope.maxUseScore = 0;
		$scope.selectedGoods = [];

		if(ConfirmProductService.product){
			var card_good = {};
			card_good.product = ConfirmProductService.product;
			var attrs = ConfirmProductService.attrs;
			card_good.property = "";
			card_good.attrs = [];
			var product_price = parseFloat(card_good.product.current_price);

			var attrsLength = attrs.length;
			for (var i = 0; i < attrsLength; i++) {

				var propertiesLength = card_good.product.properties.length;
				for (var j = 0; j < propertiesLength; j++) {
					var property = card_good.product.properties[j];
					var attrsLength = property.attrs.length;
					for (var k = 0; k < attrsLength; k++) {
						var attrItem = property.attrs[k];
						if (parseInt(attrItem.id) == attrs[i]) {
							if (card_good.property.length > 0) {
								card_good.property += "," + attrItem.attr_name;
							} else {
								card_good.property = attrItem.attr_name;
							}
							card_good.attrs.push(attrItem.id);
							product_price += parseFloat(attrItem.attr_price);
						}
					}
				}
			}

			card_good.amount = ConfirmProductService.amount;
			card_good.price = product_price;

			$scope.selectedGoods.push(card_good);
		}
		else{
			return;
		}

//		_reloadConsignee();
//		_reloadScore();
//		_refreshOrderPrice();

		function _touchAddress() {
			$state.go('address-select',{keptData:$stateParams.sendData,selectUse:1,shipType:$stateParams.shipType});
		}

		function _touchExpress(orderInfo,order) {
			localStorage.setItem("submitDatas",JSON.stringify($scope.submitDatas))
			$state.go('express-select', {keptData:$stateParams.sendData,addrData:$stateParams.addrData,addressId:orderInfo.address.addressId,
                shopId:order.shopId

			});
			console.log(orderInfo.address.addressId,order)
		}

		function _touchInvoice() {
			InvoiceSelectService.clear();
			InvoiceSelectService.type = $scope.invoiceType ? $scope.invoiceType : null;
			InvoiceSelectService.title = $scope.invoiceTitle;
			InvoiceSelectService.content = $scope.invoiceContent ? $scope.invoiceContent : null;

			$state.go('invoice-select', {});
		}

		function _touchCashgift() {
			$state.go('cashgift-select', {
				cashgift: $scope.cashgift ? $scope.cashgift.id : null,
				total: $scope.priceInfo ? $scope.priceInfo.product_price : 0
			});
		}

		function _checkCanPurchase() {
			if (!$scope.selectedGoods || !$scope.selectedGoods.length)
				return false;
			if (!$scope.consignee)
				return false;
			if (!$scope.express)
				return false;
			return true;
		}

		function _formatPromo(key) {
			if (key == 'score') {
				return "积分";
			} else if (key == 'cashgift') {
				return "红包";
			} else if (key == 'preferential') {
				return "优惠金额";
			} else if (key == 'goods_reduction') {
				return "商品减免";
			} else if (key == 'order_reduction') {
				return "订单减免";
			} else if (key == 'coupon_reduction') {
				return "优惠券减免";
			} else {
				return "其他优惠";
			}
		}

		function _refreshComment(){
			ConfirmProductService.input.comment = $scope.input.comment;
		}

		function _refreshOrderPrice() {

			if (!$scope.consignee) {
				return;
			}

			var products = [];

			for (var key in $scope.selectedGoods) {
				var good = $scope.selectedGoods[key];
				var shoppingProduct = {
					goods_id: good.product.id,
					property: good.attrs,
					num: good.amount,
					total_amount: good.amount
				};
				products.push(shoppingProduct);
			}

			var params = {};
			params.order_product = JSON.stringify(products);
			if ($scope.consignee) {
				params.consignee = $scope.consignee.id;
			}

			if ($scope.express) {
				params.shipping = $scope.express.id;
			}

			if ($scope.cashgift) {
				params.cashgift = $scope.cashgift.id;
			}

			if ($scope.coupon) {
				params.coupon = $scope.coupon.id;
			}

			if ($scope.input.score) {
				params.score = $scope.input.score;
			}

			API.order
				.price(params)
				.then(function (priceInfo) {
					if(priceInfo){
						$scope.priceInfo = priceInfo;
						$scope.all_discount = priceInfo.discount_price;
						for(var promo in priceInfo.promos){
							$scope.all_discount += parseFloat(priceInfo.promos[promo].price);
						}							
					}
					
				})
		}

        $scope.showDialog = false;
		function _touchDialogCancel() {
            $scope.showDialog = false;
        }
        function _touchDialogConfirm() {
            $scope.touchSubmit();
        }
     	function _touchDialog() {

            localStorage.removeItem("submitDatas")
            if (!$scope.orderInfo.userAddressId) {
                $scope.toast('请填写地址')
                return;
            }
            // if (!$scope.orderInfo.shippingId) {
            // 	$scope.toast('请选择快递')
            // 	return;
            // }
            for (var i=0;i<$scope.orderInfo.shopList.length;i++){
                if (!$scope.orderInfo.shopList[i].shippingId) {
                    $scope.toast("第"+i+"件商品未选择快递");
                    return;
                }
            }
            for (var i=0;i<$scope.orderInfo.shopList.length;i++){
                $scope.orderInfo.shopList[i].orderGoods = $scope.orderInfo.shopList[i].goodsList
            }
            $scope.showDialog = true;
        }
		function _touchSubmit() {



		    var sendData={
	            "data": $scope.orderInfo
	        };
		    $.ajax({
		        type: "post",
		        url: "/order/addOrder",
		        contentType:'application/json',
		        data: JSON.stringify(sendData),
		        dataType : "json",
		        success: function(data){  
		          if(data.errorInfo==null){
					  $state.go('payment', {
						order: JSON.stringify(data.data.orderNolist) ,
						sum: $scope.orderInfo.sumPrice
					  }, {location: 'replace'});
                      $scope.showDialog = false;
					  if ($stateParams.sendData){
                          $location.path('/confirm-product').replace();
					  }

		          }else{
		          	$scope.toast(data.errorInfo);
		          }
		        },
		        error:function(info){
		     	   $scope.toast("服务器异常，请稍候再试");
		        }
		    });

		}
        $scope.clearPost = function () {
			$scope.submitDatas.postscript = "";
        }

	}

})();
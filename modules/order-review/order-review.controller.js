/**
 * Created by howiezhang on 16/10/19.
 */
(function () {

	'use strict';

	angular
		.module('app')
		.controller('OrderReviewController', OrderReviewController);

	OrderReviewController.$inject = ['$scope', '$http', '$window', '$timeout', '$location', '$state', '$stateParams', 'API', 'ENUM'];

	function OrderReviewController($scope, $http, $window, $timeout, $location, $state, $stateParams, API, ENUM) {

		var order0 = JSON.parse($stateParams.order);		//传值

		$scope.order = order0;


		$scope.isLoading = false;
		$scope.isLoaded = true;
		$scope.isAnonymous = 0;

		$scope.touchGood = _touchGood;
		$scope.touchMedium = _touchMedium;
		$scope.touchBad = _touchBad;
		$scope.touchSetAnonymous = _touchSetAnonymous;
		$scope.touchSubmit = _touchSubmit;

		function _reload() {

			$scope.isLoading = true;
			$scope.isLoaded = true;
			if ($scope.order.goodList){
                $scope.goodsList = $scope.order.goodList;
			} else {
                $scope.goodsList = $scope.order.goodsList;
			}


			for(var i = 0; i<$scope.goodsList.length; i++){
				$scope.goodsList[i].commentText = null;
				$scope.goodsList[i].level = null;
                $scope.goodsList[i].orderNo = $scope.order.orderNo
			}

/*			API.order.get({
				order: orderId,
			}).then(function (order) {
				$scope.order = order;
				$scope.isLoading = false;
				$scope.isLoaded = true;
			});*/
		}

		function _touchGood(goods) {
			// console.log(goods.level,"评价情况");
			if (!goods.level) {
				goods.level = {};
			}
//			goods.level = 1;
//             console.log(goods.level,"评价情况+++");

            goods.level = ENUM.ORDER_GRADE.GOOD;
			if (!goods.commentText) {
				goods.commentText = "";
			}

		}

		function _touchMedium(goods) {
			if (!goods.level) {
				goods.level = {};
			}
			// goods.review.goods = goods.id;
			goods.level = ENUM.ORDER_GRADE.MEDIUM;
			if (!goods.commentText) {
				goods.commentText = "";
			}
		}

		function _touchBad(goods) {

			if (!goods.level) {
				goods.level = {};
			}
			goods.level = ENUM.ORDER_GRADE.BAD;
			if (!goods.commentText) {
				goods.commentText = "";
			}
		}

		function _touchSetAnonymous() {
			$scope.isAnonymous = !$scope.isAnonymous;
		}

		function _touchSubmit() {


			var level = [];
            var commentText = [];

            for (var i = 0; i < $scope.goodsList.length; i++) {
				var good = $scope.goodsList[i];
				if(good.level!=null){
                    level.push(good.level);
				}else if(good.level==null){
                    $scope.toast('请选择评价等级');
                    return;
				}
				/*//对评价内容判断，不能为空；
                if(good.commentText!=null){
                    commentText.push(good.commentText);
                    console.log(good.commentText,"提交评价内容++++++++++")
                }else if(good.commentText==null){
                    $scope.toast('请输入评价内容');
                    console.log(good.commentText,"提交评价内容++++++++++");
                    return;
                }*/
               /* if (level.length < $scope.goodsList.length) {
                    $scope.toast('请评价全部商品');
                    return;
                }*/
			}

            var sendJson = {
	                "data": {
	                	"goodsList":$scope.goodsList
	                }
	            };
	            $.ajax({
	                type: "post",
	                url: "/stage/addGoodsComment/",
	                contentType: 'application/json',
	                data: JSON.stringify(sendJson),
	                dataType: "json",
	                success: function(data) {
	                    if (data.errorInfo == null) {
	                        console.log(data);
                            $scope.toast("评价成功");
                            $state.go('home', {
                                // comment:JSON.parse(order).goodsList
                                },{location: 'replace'});
	                    } else {

							$scope.toast("操作失败")
                            $scope.toast("操作失败")
	                    }
	                },
	                error: function(info) {
	                    console.log(info);
	                }
	            });


		}

		_reload();
	}

})();
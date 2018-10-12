(function () {

	'use strict';

	angular
		.module('app')
		.controller('CategoryController', CategoryController);

	CategoryController.$inject = ['$scope', '$http', '$location', '$state', 'API', 'ENUM', 'CartModel'];

	function CategoryController($scope, $http, $location, $state, API, ENUM, CartModel) {
		var PER_PAGE = 1000;
		$scope.categories = [];
		$scope.selectedSide = {};
		$scope.selectedSide.idx=0;
		$scope.touchSearch = _touchSearch;
		$scope.touchSide = _touchSide;
		$scope.touchMain = _touchMain;

//		$scope.cartModel = CartModel;

		function _touchSearch() {
			$state.go('search', {});
		}

		function _touchSide(idx,side) {
			$scope.selectedSide.idx = idx;
			$scope.selectedSide.obj=side;
		}

		function _touchMain(main) {
			if (!main) {

				var side = $scope.selectedSide.obj;

				$state.go('search-result', {
					"catId":$scope.selectedSide.obj.catId,
					"catName":$scope.selectedSide.obj.catName,
					"orderId":0
				});

			} else {

				$state.go('search-result', {
					"catId":main.catId,
					"catName":main.catName,
					"orderId":0
				});
			}
		}

		function _reloadCategories() {
	        var sendData = {
                "data": {}
            };
            $.ajax({
                type: "post",
                url: "/category/searchCategory/",
                contentType: 'application/json',
                data: JSON.stringify(sendData),
                dataType: "json",
                success: function(data) {
                    if (data.errorInfo == null) {
                        var datas = data.data.listCategory;
                        $scope.categories = data.data.listCategory;
                        $scope.selectedSide.obj = $scope.categories[0];
//                        setTimeout(function(){
//                           alert($("#test").html());
//                        },1000);
                        $scope.$apply();
                    }
                },
                error: function(info) {
                    console.log(info);
                }
            });
		}

		function _reload() {
			_reloadCategories();
		}

		_reload();
	}

})();
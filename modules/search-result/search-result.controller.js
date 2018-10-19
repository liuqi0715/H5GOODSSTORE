(function () {

	'use strict';

	angular
		.module('app')
		.controller('SearchResultController', SearchResultController);

	SearchResultController.$inject = ['$scope', '$http', '$window', '$timeout', '$location', '$state', '$stateParams', 'API', 'ENUM'];

	function SearchResultController($scope, $http, $window, $timeout, $location, $state, $stateParams, API, ENUM) {

		var PER_PAGE = 10;
		$scope.currentPage = 1;
		$scope.searchInput = {};
		console.log($stateParams,"$stateParams")
		//分类
		if($stateParams.catId!=undefined && $stateParams.orderId!=undefined){
			$scope.navTitle = $stateParams.catName;
			$scope.currentSortKey = $scope.searchInput.name;						//关键字
			$scope.currentKeyword = $stateParams.orderId;	//排序
            $scope.catIdQUERY = $stateParams.catId;			//分类Id搜索时为空
			$scope.navStyle = 'default';
		}
		//搜索
		if($stateParams.isSearch!=undefined){
			$scope.currentSortKey = $stateParams.isSearch;  //关键字
			$scope.currentKeyword = 0;						//排序
			$scope.catIdQUERY = null;							//分类Id搜索时为空
			$scope.navStyle = 'search';
			$scope.searchInput.name = $scope.currentSortKey;
		}
		//标签
		if ($stateParams.tagId!=undefined && $stateParams.tagName!=undefined){
            $scope.navTitle = $stateParams.tagName;
            $scope.currentSortKey = $scope.searchInput.name;  //关键字
            $scope.currentKeyword = $stateParams.tagId;						//排序
            $scope.catIdQUERY = null;							        //分类Id搜索时为空
            $scope.navStyle = 'search';
		}
		$scope.allActive = true;
		$scope.saleActive = false;
		$scope.priceActive = false;
		$scope.priceUpActive = false;
		$scope.styleUpActive = false;
		$scope.newActive = false;
		$scope.products = null;

		$scope.touchSearch = _touchSearch;
		$scope.touchSortDefault = _touchSortDefault;
		$scope.touchSortSale = _touchSortSale;
		$scope.touchSortNew = _touchSortNew;
		$scope.touchSortPrice = _touchSortPrice;
		$scope.touchSortCredit = _touchSortCredit;
		$scope.touchProduct = _touchProduct;
		$scope.loadMore = _loadMore;
		$scope.tagSearch = _tagSearch;
		$scope.showTag = _showTag;

		$scope.isEmpty = false;
		$scope.isLoaded = false;
		$scope.isLoading = false;
		$scope.isLastPage = false;

        $scope.select = 0;
        $scope.show = true;

		$scope.searchObj = function(){
			 $scope.currentSortKey = $scope.searchInput.name;
			_reload();
		}
		function _touchSearch() {
			_reload();
		}

		function _touchSortDefault() {
			$scope.allActive = true;
			$scope.saleActive = false;
            $scope.currentPage = 1;
			$scope.priceActive = false;
			$scope.priceUpActive = false;
            $scope.styleUpActive = false;
			$scope.newActive = false;
			$scope.currentKeyword = 0;

            $scope.isLastPage = false;
			_reload();
            $scope.listHeight = {
                "height":0 + "px",
                "transition": "all .2s ease-out"
            }
            $scope.show=true;

		}

		function _touchSortSale() {
			$scope.allActive = false;
			$scope.saleActive = true;
			$scope.priceActive = false;
			$scope.priceUpActive = false;
            $scope.styleUpActive = false;
			$scope.newActive = false;
			$scope.currentKeyword = 0;
			$scope.isLastPage = false;
			_reload();
            $scope.listHeight = {
                "height":0 + "px",
                "transition": "all .2s ease-out"
            }
            $scope.show=true;
		}

		function _touchSortNew() {
			$scope.allActive = false;
			$scope.saleActive = false;
			$scope.priceActive = false;
			$scope.priceUpActive = false;
            $scope.styleUpActive = false;
			$scope.newActive = true;
			$scope.currentKeyword = 3;
            $scope.currentPage = 1;
			_reload();
		}

		function _touchSortPrice() {
			$scope.allActive = false;
			$scope.saleActive = false;
			$scope.priceActive = false;
            $scope.styleUpActive = false;
			$scope.priceUpActive = !$scope.priceUpActive;

			$scope.newActive = false;
			if($scope.priceUpActive == true){
				$scope.currentKeyword = 2;
			}else{
				$scope.currentKeyword = 1;
			}
			_reload();
            $scope.listHeight = {
                "height":0 + "px",
                "transition": "all .2s ease-out"
            }
            $scope.show=true;
		}

		function _touchSortCredit() {
			var key = ENUM.SORT_KEY.CREDIT;
			var val = ENUM.SORT_VALUE.DESC;
			if (key != $scope.currentSortKey || val != $scope.currentSortValue) {
				$scope.currentSortKey = key;
				$scope.currentSortValue = val;
				_reload();
			}
		}

		function _touchProduct(product) {
			console.log(product);
			$state.go('product', {
				product: product.goodsId
			});
		}

		function _reload() {
			if ($scope.isLoading)
				return;
			$scope.products = null;
			$scope.isEmpty = false;
			$scope.isLoaded = false;

			_fetch(1, PER_PAGE);
		}

		function _loadMore() {
			if ($scope.isLoading)
				return;
			if ($scope.isLastPage)
				return;

			if ($scope.products && $scope.products.length) {
				_fetch((++$scope.currentPage), PER_PAGE);
			} else {
				_fetch(1, PER_PAGE);
			}
		}
		function _getTagList() {

            $.ajax({
                type: "post",
                url: "/stage/getTag",
                contentType: 'application/json',
                dataType: "json",
                success: function(data) {
                    if (data.errorInfo == null) {

                    	$scope.tagList = data.data.tagList;

                        if ($stateParams.tagId!=undefined){
                            $scope.defaultTag = $stateParams.tagName;
                        } else {
                            $scope.defaultTag = $scope.tagList[0].tagName;
                        }

                        $scope.$apply();
                    }else {
                        $scope.toast(data.errorInfo)
                    }
                },
                error: function(info) {
                    $scope.toast("服务器异常")
                }
            });
        }
        _getTagList();

		function _tagSearch(tag,i) {
            console.log("??")
			$scope.defaultTag = tag.tagName;
            $scope.currentSortKey = $scope.searchInput.name;  				//关键字
            $scope.currentKeyword = JSON.stringify(tag.tagId) ;				//排序
            $scope.catIdQUERY = $stateParams.catId;							//分类Id搜索时为空
            $scope.allActive = true;
            $scope.saleActive = false;
            $scope.currentPage = 1;
			$scope.select = i;
            $scope.styleUpActive = false;

            _reload();
            $scope.listHeight = {
                "height":0 + "px",
                "transition": "all .2s ease-out"
            }
            $scope.show=true;
        }

        function _showTag() {
            $scope.show = !$scope.show;
            $scope.styleUpActive = !$scope.styleUpActive;
            if ($scope.show ==false){
                $scope.listHeight = {
                    "height":$scope.tagList.length*25 + "px",
                    "transition": "all .2s ease-out"
                }
			} else {
                $scope.listHeight = {
                    "height":0 + "px",
                    "transition": "all .2s ease-out"
                }
			}

        }
		function _fetch(page, PER_PAGE) {
			$scope.isLoading = true;
			if($stateParams.isSearch == undefined){
				var urls = "/stage/goodsQuery";
                // /stage/getGoodsByCatId/
			}else{
				var urls = "/stage/goodsQuery";
			}
	        var sendData = {
                "data": {
                	"queryRows":PER_PAGE,
                	"queryPage":page,
                	"catId": ($scope.catIdQUERY),		//类id
                	"orderId":$scope.currentKeyword,	//排序
					"keyWord":$scope.currentSortKey		//关键字
                }
            };

            $.ajax({
                type: "post",
                url: urls,
                contentType: 'application/json',
                data: JSON.stringify(sendData),
                dataType: "json",
                success: function(data) {
                    if (data.errorInfo == null) {
                        $scope.products = $scope.products!=null ? $scope.products.concat(data.data.goodsList) : data.data.goodsList;
                    	if($scope.products.length==0){
                    		$scope.isEmpty = true;
                    	}
                    	$scope.isLastPage = $scope.currentPage==data.data.pageNo ? true : false;
                    	$scope.isLoading = false;
                    	$scope.isLoaded = true;
                        $scope.$apply();
                    }else {
                    	$scope.toast(data.errorInfo)
					}
                },
                error: function(info) {
                		$scope.toast("服务器异常")
                }
            });
		}

		_reload();
	}

})();
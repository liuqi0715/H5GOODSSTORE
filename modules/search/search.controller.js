(function () {

	'use strict';

	angular
		.module('app')
		.controller('SearchController', SearchController);

	SearchController.$inject = ['$scope', '$http', '$window', '$timeout', '$rootScope', '$state', 'API', 'ENUM', '$stateParams','SearchService'];

	function SearchController($scope, $http, $window, $timeout, $rootScope, $state, API, ENUM,$stateParams,SearchService) {

		$scope.currentKeyword = '';

		$scope.keywords = null;
		$scope.history = null;

		$scope.touchSearch = touchSearch;
		$scope.search = {};
		$scope.search.input = null;
		console.log($stateParams)
		$scope.touchKeyword = function(keyword){
			$scope.search.input = keyword.key_word;
			$scope.touchSearch();
		};
		function touchSearch() {
			if (!$scope.search.input || $scope.search.input.length < 1) {
				$scope.toast('请输入正确的关键字');
				return;
			}

			$state.go('search-result', {isSearch:$scope.search.input});
		}


		function _reload() {
		    var sendData1={
	            "data": {}
	        };
		    $.ajax({
		        type: "post",
		        url: "/goodsQuery/getSearchKeywordByUserId/",
		        contentType:'application/json',
		        data: JSON.stringify(sendData1),
		        dataType : "json",
		        success : function(data){  
		          if(data.errorInfo==null){
		        	 $scope.history = data.data.keywords;
		        	 $scope.$apply();
		          }else{
		          	$scope.toast(data.errorInfo);
		          }
		        },
		        error:function(info){
		     	   console.log(info);
		        }
		     });
		}

		_reload();
	}

})();